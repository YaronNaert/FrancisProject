import React, { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// The imports from your new files
import { Header, StyleTag } from "./components/UIComponents";
import { StepType, StepData, StepActivity, StepPrefs, StepResult } from "./components/Steps";
import { CAT_BREEDS, DOG_BREEDS, ACTIVITY_LEVELS, 
  BODY_CONDITION, 
  TREATS, 
  INGREDIENTS } from "./data";
import { clamp, diffYearsMonths, rerKcal, roundTo3kgBags } from "./utils";
import "./index.css";



export default function App() {
  const [step, setStep] = useState(1);

  const [maxStep, setMaxStep] = useState(1); // Track how far they've gone

  const [state, setState] = useState({
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
  });

  const passportRef = useRef(null);

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
    if (!state.petType) return;
    const found = breeds.find((b) => b.name === state.breed) || breeds[0];
    const ideal = state.gender === "male" ? found.male : found.female;
    setState((s) => ({ ...s, idealWeight: ideal }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.breed, state.gender]);

  useEffect(() => {
    if (!state.birthDate) return;
    const { years } = diffYearsMonths(state.birthDate);
    if (years != null) {
      setState((s) => ({ ...s, ageYears: clamp(years, 0, 30) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.birthDate]);

  const adjustedWeightKg = useMemo(() => {
    return clamp(
      Number(state.idealWeight) * (Number(state.conditionPct) / 100),
      0.8,
      120
    );
  }, [state.idealWeight, state.conditionPct]);

  const activityObj = useMemo(() => {
    return ACTIVITY_LEVELS.find((a) => a.key === state.activity) || ACTIVITY_LEVELS[1];
  }, [state.activity]);

  const activityFactor =
    state.petType === "cat" ? activityObj.factorCat : activityObj.factorDog;

  const neuterFactor = state.neutered ? 0.9 : 1.0;
  const bodyCondFactor =
    (BODY_CONDITION.find((b) => b.key === state.bodyCond) || BODY_CONDITION[1]).factor;
  const treatsFactor =
    (TREATS.find((t) => t.key === state.treats) || TREATS[1]).factor;

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
  const subscriptionDaysActual = Math.floor(
    (subscriptionKgRounded * 1000) / ofGramsPerDay
  );
  const orderCostOF = subscriptionKgRounded * OF_PRICE_PER_KG;

  const excludedSet = useMemo(() => new Set(state.excluded), [state.excluded]);
  const preferredIngredients = useMemo(
    () => INGREDIENTS.filter((i) => !excludedSet.has(i)),
    [excludedSet]
  );

  const { years: ageYFromBirth, months: ageMFromBirth } = useMemo(
    () => diffYearsMonths(state.birthDate),
    [state.birthDate]
  );

  const ageDisplay = useMemo(() => {
    if (state.birthDate && ageYFromBirth != null) {
      return `${ageYFromBirth} jaar, ${ageMFromBirth ?? 0} maanden`;
    }
    return `${clamp(Number(state.ageYears), 0, 30)} jaar`;
  }, [state.birthDate, state.ageYears, ageYFromBirth, ageMFromBirth]);


  function handleStepJump(targetStep) {
    if (targetStep <= maxStep) {
      setStep(targetStep);
    }
  }

  function goNext(patch = {}) {
    setState((s) => ({ ...s, ...patch }));
    setStep((n) => Math.min(5, n + 1));
  }

  function goBack() {
    setStep((n) => Math.max(1, n - 1));
  }

  function resetAll() {
    setStep(1);
    setState({
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
    });
  }

  async function downloadPassportPdf() {
    const node = passportRef.current;
    if (!node) return;

    if (!jsPDF || !html2canvas) {
      window.print();
      return;
    }

    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
    } else {
      let remaining = imgH;
      let position = 0;

      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        remaining -= pageH;
        position -= pageH;
        if (remaining > 0) pdf.addPage();
      }
    }

    pdf.save(
      `OthonFriends_Voedingsplan_${(state.name || "huisdier").replaceAll(" ", "_")}.pdf`
    );
  }

  return (
    <div className="site-wrapper">
      <StyleTag />

      {/* NEW SITE HEADER */}
      <header className="site-header">
        <div className="header-left">
          <a href="https://othonandfriends.com" className="btn-secondary-outline">
            <span className="icon">←</span>
            <span className="text">Terug naar home</span>
          </a>
        </div>

        <div className="header-center">
          {/* Replace with your actual logo path */}
          <img src="../logo.png" alt="Othon & Friends" className="site-logo" />
        </div>

        <div className="header-right">
          <Header step={step} variant="lang-only" />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="content-container">
        <div className="calculator-wrapper">
          
          {/* Progress Steps (centered above the questions) */}
          <div className="progress-section">
            <Header 
              step={step} 
              maxStep={maxStep} 
              onStepClick={handleStepJump} 
              variant="steps-only" 
            />
          </div>

          <div className="step-card">
            {step === 1 && (
              <StepType
                onPick={(petType) => {
                  const defaultBreed = "Gemengd ras / Onbekend";
                  const defaultIdeal = petType === "cat" 
                    ? (CAT_BREEDS.find((b) => b.name === defaultBreed) || CAT_BREEDS[0]).male 
                    : (DOG_BREEDS.find((b) => b.name === defaultBreed) || DOG_BREEDS[0]).male;
                  setState((s) => ({ ...s, petType, breed: defaultBreed, idealWeight: defaultIdeal }));
                  setStep(2);
                }}
              />
            )}

            {/* Inside App.jsx render function */}
            {step === 2 && (
              <StepData 
                state={state} 
                breeds={breeds} 
                onChange={setState} 
                onBack={goBack} 
                onNext={goNext} 
                ageDisplay={ageDisplay} // Add this line
              />
            )}
            {step === 3 && <StepActivity state={state} onChange={setState} onBack={goBack} onNext={goNext} />}
            {step === 4 && <StepPrefs state={state} onChange={setState} onBack={goBack} onNext={goNext} />}
            {step === 5 && (
              <StepResult
                state={state} preferredIngredients={preferredIngredients} adjustedWeightKg={adjustedWeightKg}
                ageDisplay={ageDisplay} ofGramsPerDay={ofGramsPerDay} avgBrandGramsPerDay={avgBrandGramsPerDay}
                ofCostPerDay={ofCostPerDay} avgCostPerDay={avgCostPerDay} ofCostPerMonth={ofCostPerMonth}
                avgCostPerMonth={avgCostPerMonth} gramsLessPct={gramsLessPct} savingsPerMonth={savingsPerMonth}
                subscriptionKgRounded={subscriptionKgRounded} bagsNeeded={bagsNeeded}
                subscriptionDaysActual={subscriptionDaysActual} orderCostOF={orderCostOF}
                passportRef={passportRef} onReset={resetAll} onDownload={downloadPassportPdf}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
