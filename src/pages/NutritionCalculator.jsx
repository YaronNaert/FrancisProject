import React, { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";

import { Header } from "../components/UIComponents";
import { StepType, StepData, StepActivity, StepPrefs, StepResult } from "../components/Steps";
import { CAT_BREEDS, DOG_BREEDS, ACTIVITY_LEVELS, BODY_CONDITION, TREATS, INGREDIENTS } from "../data";
import { clamp, diffYearsMonths, rerKcal, roundTo3kgBags } from "../utils";

export default function NutritionCalculator({ pets, setPets }) {
  const { petId } = useParams();
  const navigate = useNavigate();
  const passportRef = useRef(null);

  // --- STYLES OBJECT ---
  const styles = {
    calculatorWrapper: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      minHeight: "80vh"
    },
    progressSection: {
      marginBottom: "20px"
    },
    stepCard: {
      background: "white",
      borderRadius: "32px",
      padding: "40px",
      border: "1px solid #edf2f7",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      transition: "all 0.3s ease"
    }
  };

  // Initialize state: Check if we are editing an existing pet
  const [state, setState] = useState(() => {
    const existing = pets?.find((p) => p.id === petId);
    return existing || {
      petType: "",
      name: "",
      breed: "Gemengd ras / Onbekend",
      gender: "male",
      idealWeight: 25,
      conditionPct: 100,
      ageYears: 1,
      birthDate: "",
      activity: "normaal",
      neutered: false,
      bodyCond: "ideaal",
      treats: "no",
      excluded: [],
      foodType: "Droogvoer",
      subscriptionDays: 30,
    };
  });

  const [step, setStep] = useState(petId ? 2 : 1);
  const [maxStep, setMaxStep] = useState(petId ? 5 : 1);

  useEffect(() => {
    if (step > maxStep) setMaxStep(step);
  }, [step, maxStep]);

  const breeds = useMemo(() => {
    return state.petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
  }, [state.petType]);

  useEffect(() => {
    if (!state.petType) return;
    const currentBreeds = state.petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
    const found = currentBreeds.find((b) => b.name === state.breed) || currentBreeds[0];
    const ideal = state.gender === "male" ? found.male : found.female;
    setState((s) => ({ ...s, idealWeight: ideal }));
  }, [state.breed, state.gender, state.petType]);

  useEffect(() => {
    if (!state.birthDate) return;
    const { years } = diffYearsMonths(state.birthDate);
    if (years != null) {
      setState((s) => ({ ...s, ageYears: clamp(years, 0, 30) }));
    }
  }, [state.birthDate]);

  const adjustedWeightKg = useMemo(() => {
    return clamp(Number(state.idealWeight) * (Number(state.conditionPct) / 100), 0.8, 120);
  }, [state.idealWeight, state.conditionPct]);

  const activityObj = useMemo(() => {
    return ACTIVITY_LEVELS.find((a) => a.key === state.activity) || ACTIVITY_LEVELS[1];
  }, [state.activity]);

  const activityFactor = state.petType === "cat" ? activityObj.factorCat : activityObj.factorDog;
  const neuterFactor = state.neutered ? 0.9 : 1.0;
  const bodyCondFactor = (BODY_CONDITION.find((b) => b.key === state.bodyCond) || BODY_CONDITION[1]).factor;
  const treatsFactor = (TREATS.find((t) => t.key === state.treats) || TREATS[1]).factor;

  const isPuppy = state.petType === "dog" && Number(state.ageYears) < 1;
  const ofKcalPerKg = isPuppy ? 4080 : 3808;

  const RER = rerKcal(adjustedWeightKg);
  const MER = RER * activityFactor * neuterFactor * bodyCondFactor * treatsFactor;

  const ofGramsPerDay = (MER / ofKcalPerKg) * 1000;
  const avgBrandGramsPerDay = ofGramsPerDay * 1.118;
  const OF_PRICE_PER_KG = 5.49;
  const AVG_PRICE_PER_KG = 6.5;

  const ofCostPerDay = (ofGramsPerDay / 1000) * OF_PRICE_PER_KG;
  const avgCostPerDay = (avgBrandGramsPerDay / 1000) * AVG_PRICE_PER_KG;
  const ofCostPerMonth = ofCostPerDay * 30;
  const avgCostPerMonth = avgCostPerDay * 30;
  const gramsLessPct = 1 - ofGramsPerDay / avgBrandGramsPerDay;
  const savingsPerMonth = avgCostPerMonth - ofCostPerMonth;

  const subscriptionGrams = ofGramsPerDay * state.subscriptionDays;
  const subscriptionKgRounded = roundTo3kgBags(subscriptionGrams);
  const bagsNeeded = subscriptionKgRounded / 3;
  const subscriptionDaysActual = Math.floor((subscriptionKgRounded * 1000) / ofGramsPerDay);
  const orderCostOF = subscriptionKgRounded * OF_PRICE_PER_KG;

  const excludedSet = useMemo(() => new Set(state.excluded), [state.excluded]);
  const preferredIngredients = useMemo(() => INGREDIENTS.filter((i) => !excludedSet.has(i)), [excludedSet]);

  const { years: ageYFromBirth, months: ageMFromBirth } = useMemo(() => diffYearsMonths(state.birthDate), [state.birthDate]);

  const ageDisplay = useMemo(() => {
    if (state.birthDate && ageYFromBirth != null) {
      return `${ageYFromBirth} jaar, ${ageMFromBirth ?? 0} maanden`;
    }
    return `${clamp(Number(state.ageYears), 0, 30)} jaar`;
  }, [state.birthDate, state.ageYears, ageYFromBirth, ageMFromBirth]);

  function handleStepJump(targetStep) {
    if (targetStep <= maxStep) setStep(targetStep);
  }

  function goNext(patch = {}) {
    setState((s) => ({ ...s, ...patch }));
    setStep((n) => Math.min(5, n + 1));
  }

  function goBack() {
    setStep((n) => Math.max(1, n - 1));
  }

  // Inside NutritionCalculator.jsx

  function handleOrderFlow(finalState) {
    // 1. Save the pet data to local storage or a temporary state 
    // so it isn't lost during registration
    localStorage.setItem("pending_pet_data", JSON.stringify(finalState));

    // 2. Navigate to your registration/signup page
    // We pass a 'redirect' query so the app knows where to go after signup
    navigate("/register?redirect=checkout");
  }

  // Then update the StepResult call:
  {step === 5 && (
    <StepResult
      // ... all other props ...
      onOrder={handleOrderFlow} 
    />
  )}

  async function downloadPassportPdf() {
    const node = passportRef.current;
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
    pdf.save(`OthonFriends_Voedingsplan_${(state.name || "huisdier").replaceAll(" ", "_")}.pdf`);
  }

  return (
    <div style={styles.calculatorWrapper}>
      <div style={styles.progressSection}>
        <Header step={step} maxStep={maxStep} onStepClick={handleStepJump} variant="steps-only" />
      </div>

      <div style={styles.stepCard}>
        {step === 1 && (
          <StepType onPick={(type) => goNext({ petType: type })} />
        )}
        {step === 2 && (
          <StepData 
            state={state} 
            breeds={breeds} 
            onChange={setState} 
            onBack={goBack} 
            onNext={goNext} 
            ageDisplay={ageDisplay} 
          />
        )}
        {step === 3 && (
          <StepActivity 
            state={state} 
            onChange={setState} 
            onBack={goBack} 
            onNext={goNext} 
          />
        )}
        {step === 4 && (
          <StepPrefs 
            state={state} 
            onChange={setState} 
            onBack={goBack} 
            onNext={goNext} 
          />
        )}
        {step === 5 && (
          <StepResult
            state={state} preferredIngredients={preferredIngredients} adjustedWeightKg={adjustedWeightKg}
            ageDisplay={ageDisplay} ofGramsPerDay={ofGramsPerDay} avgBrandGramsPerDay={avgBrandGramsPerDay}
            ofCostPerDay={ofCostPerDay} avgCostPerDay={avgCostPerDay} ofCostPerMonth={ofCostPerMonth}
            avgCostPerMonth={avgCostPerMonth} gramsLessPct={gramsLessPct} savingsPerMonth={savingsPerMonth}
            subscriptionKgRounded={subscriptionKgRounded} bagsNeeded={bagsNeeded}
            subscriptionDaysActual={subscriptionDaysActual} orderCostOF={orderCostOF}
            passportRef={passportRef} onReset={() => navigate('/')} onDownload={downloadPassportPdf}
          />
        )}
      </div>
    </div>
  );
}