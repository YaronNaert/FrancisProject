import React, { useEffect, useMemo, useRef, useState } from "react";

// PDF deps (in CodeSandbox: add dependencies "jspdf" + "html2canvas")
let jsPDF, html2canvas;
try {
  jsPDF = require("jspdf").jsPDF;
  html2canvas = require("html2canvas");
} catch (e) {
  // Fallback: if PDF deps aren't installed, we'll use print.
}

/** Brand */
const BRAND = {
  blue: "#90c0e8",
  orange: "#f1891a",
  light: "#f7fbff",
  dark: "#1f2937",
  muted: "#6b7280",
  border: "rgba(31,41,55,.12)",
};

const STEPS = [
  { key: "type", label: "Type huisdier" },
  { key: "data", label: "Gegevens" },
  { key: "activity", label: "Activiteit" },
  { key: "prefs", label: "Voorkeuren" },
  { key: "result", label: "Resultaat" },
];

const DOG_BREEDS = [
  { name: "Gemengd ras / Onbekend", male: 25, female: 22 },
  { name: "Labrador Retriever", male: 32, female: 28 },
  { name: "Golden Retriever", male: 34, female: 30 },
  { name: "Duitse Herder", male: 34, female: 28 },
  { name: "Mechelse Herder", male: 30, female: 25 },
  { name: "Border Collie", male: 20, female: 18 },
  { name: "Franse Bulldog", male: 12, female: 10 },
  { name: "Engelse Bulldog", male: 24, female: 20 },
  { name: "Beagle", male: 11, female: 10 },
  { name: "Jack Russell Terriër", male: 8, female: 7 },
  { name: "Cavalier King Charles", male: 8, female: 7 },
  { name: "Australian Shepherd", male: 29, female: 25 },
  { name: "Rottweiler", male: 50, female: 42 },
  { name: "Berner Sennenhond", male: 48, female: 40 },
  { name: "Dobermann", male: 40, female: 32 },
  { name: "Boxer", male: 32, female: 28 },
  { name: "Siberische Husky", male: 24, female: 21 },
  { name: "Shih Tzu", male: 7, female: 6 },
  { name: "Maltezer", male: 3.5, female: 3 },
  { name: "Chihuahua", male: 2.5, female: 2.2 },
];

const CAT_BREEDS = [
  { name: "Gemengd ras / Onbekend", male: 5.0, female: 4.5 },
  { name: "Maine Coon", male: 8.0, female: 6.0 },
  { name: "Britse Korthaar", male: 7.0, female: 5.0 },
  { name: "Ragdoll", male: 7.0, female: 5.0 },
  { name: "Noorse Boskat", male: 7.0, female: 5.0 },
  { name: "Siamese", male: 5.0, female: 4.0 },
  { name: "Bengaal", male: 6.0, female: 4.5 },
  { name: "Sphynx", male: 4.5, female: 4.0 },
];

const ACTIVITY_LEVELS = [
  {
    key: "rustig",
    title: "Rustig",
    desc: "Vooral binnen, rustige wandelingen",
    factorDog: 1.4,
    factorCat: 1.1,
  },
  {
    key: "normaal",
    title: "Normaal",
    desc: "Dagelijkse wandelingen, matig spel",
    factorDog: 1.6,
    factorCat: 1.2,
  },
  {
    key: "actief",
    title: "Actief",
    desc: "Lange wandelingen, veel beweging",
    factorDog: 1.9,
    factorCat: 1.3,
  },
  {
    key: "zeer_actief",
    title: "Zeer actief",
    desc: "Sport, werk- of herdersdier",
    factorDog: 2.3,
    factorCat: 1.4,
  },
];

const BODY_CONDITION = [
  { key: "ondergewicht", label: "Ondergewicht", factor: 1.1 },
  { key: "ideaal", label: "Ideaal", factor: 1.0 },
  { key: "overgewicht", label: "Overgewicht", factor: 0.85 },
];

const TREATS = [
  { key: "yes", label: "Ja, af en toe (oké, best vaak)", factor: 1.05 },
  { key: "no", label: "Nee, ik ben sterk genoeg", factor: 1.0 },
];

const INGREDIENTS = [
  "Kip",
  "Rund",
  "Lam",
  "Insecten",
  "Vis",
  "Rijst",
  "Granen",
  "Ei",
  "Zuivel",
  "Soja",
];

const SENSITIVE = new Set(["Soja", "Kip", "Rund", "Zuivel"]);

const DOG_NAMES = [
  "Max",
  "Luna",
  "Milo",
  "Bella",
  "Charlie",
  "Nala",
  "Rocky",
  "Nova",
  "Odin",
  "Jules",
  "Otis",
  "Bo",
  "Kiki",
  "Ziggy",
];

const CAT_NAMES = [
  "Mimi",
  "Simba",
  "Loki",
  "Coco",
  "Mia",
  "Leo",
  "Nina",
  "Pablo",
  "Poes",
  "Felix",
  "Moka",
  "Suki",
];

const SUBSCRIPTION_OPTIONS = [
  { key: 30, label: "Levering elke 30 dagen" },
  { key: 45, label: "Levering elke 45 dagen" },
];

function clamp(n, min, max) {
  const x = Number.isFinite(n) ? n : min;
  return Math.min(max, Math.max(min, x));
}

function format(n, digits = 0) {
  return new Intl.NumberFormat("nl-BE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

function nowDateNL() {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function diffYearsMonths(fromDate) {
  if (!fromDate) return { years: null, months: null };
  const d = new Date(fromDate);
  const now = new Date();

  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  const days = now.getDate() - d.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
  };
}

function rerKcal(kg) {
  return 70 * Math.pow(kg, 0.75);
}

function roundTo3kgBags(grams) {
  const kg = grams / 1000;
  return Math.ceil(kg / 3) * 3;
}

export default function App() {
  const [step, setStep] = useState(1);

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

  const breeds = useMemo(() => {
    return state.petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
  }, [state.petType]);

  useEffect(() => {
    if (!state.petType) return;
    const found = breeds.find((b) => b.name === state.breed) || breeds[0];
    const ideal = state.gender === "male" ? found.male : found.female;
    setState((s) => ({ ...s, idealWeight: ideal }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.petType]);

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
    <div style={styles.app}>
      <StyleTag />

      <div style={styles.shell}>
        <div style={styles.card}>
          <Header step={step} />

          {step === 1 && (
            <StepType
              onPick={(petType) => {
                const defaultBreed = "Gemengd ras / Onbekend";
                const defaultGender = "male";
                const defaultIdeal =
                  petType === "cat"
                    ? (CAT_BREEDS.find((b) => b.name === defaultBreed) || CAT_BREEDS[0]).male
                    : (DOG_BREEDS.find((b) => b.name === defaultBreed) || DOG_BREEDS[0]).male;

                setState((s) => ({
                  ...s,
                  petType,
                  breed: defaultBreed,
                  gender: defaultGender,
                  idealWeight: defaultIdeal,
                }));
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <StepData
              state={state}
              breeds={breeds}
              onChange={setState}
              onBack={goBack}
              onNext={goNext}
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
              state={state}
              preferredIngredients={preferredIngredients}
              adjustedWeightKg={adjustedWeightKg}
              ageDisplay={ageDisplay}
              ofGramsPerDay={ofGramsPerDay}
              avgBrandGramsPerDay={avgBrandGramsPerDay}
              ofCostPerDay={ofCostPerDay}
              avgCostPerDay={avgCostPerDay}
              ofCostPerMonth={ofCostPerMonth}
              avgCostPerMonth={avgCostPerMonth}
              gramsLessPct={gramsLessPct}
              savingsPerMonth={savingsPerMonth}
              subscriptionKgRounded={subscriptionKgRounded}
              bagsNeeded={bagsNeeded}
              subscriptionDaysActual={subscriptionDaysActual}
              orderCostOF={orderCostOF}
              passportRef={passportRef}
              onReset={resetAll}
              onDownload={downloadPassportPdf}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ step }) {
  const pct = (step / 5) * 100;

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={styles.langRow}>
        <div style={styles.langPill}>NL</div>
        <div style={styles.langPillMuted}>FR</div>
        <div style={styles.langPillMuted}>EN</div>
      </div>

      <div style={styles.progressWrap}>
        <div style={{ ...styles.progressFill, width: `${pct}%` }} />
      </div>

      <div style={styles.stepRow}>
        {STEPS.map((s, idx) => {
          const n = idx + 1;
          const active = n === step;
          const done = n < step;

          return (
            <div key={s.key} style={styles.stepChip(active, done)}>
              <span style={{ fontWeight: 800, marginRight: 8 }}>{n}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepType({ onPick }) {
  return (
    <div>
      <h1 style={styles.h1}>Voedingscalculator</h1>
      <p style={styles.lead}>Ontdek hoeveel voeding je huisdier nodig heeft</p>

      <h2 style={styles.h2}>Welk huisdier heb je?</h2>
      <p style={styles.muted}>
        Kies het type huisdier waarvoor je de voeding wilt berekenen
      </p>

      <div style={styles.grid2}>
        <SelectCard
          title="Hond"
          subtitle="Je trouwste vriend op vier poten"
          onClick={() => onPick("dog")}
          icon="🐶"
        />
        <SelectCard
          title="Kat"
          subtitle="De baas in huis, laten we eerlijk zijn"
          onClick={() => onPick("cat")}
          icon="🐱"
        />
      </div>

      <div style={styles.brandNote}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Othon & Friends</div>
        <div style={styles.small}>
          We werken nauw samen met dierenartsen, maar elk dier is uniek. Het
          advies van jouw dierenarts heeft altijd voorrang.
        </div>
      </div>
    </div>
  );
}

function StepData({ state, breeds, onChange, onBack, onNext }) {
  const [breedPickerOpen, setBreedPickerOpen] = useState(false);

  const isDog = state.petType === "dog";
  const titlePet = isDog ? "hond" : "kat";

  const genderLabelMale = isDog ? "Reutje" : "Kater";
  const genderLabelFemale = isDog ? "Teefje" : "Poes";

  const shownBreed = breeds.find((b) => b.name === state.breed) || breeds[0];

  const conditionLabel =
    Number(state.conditionPct) < 95
      ? "SLANK"
      : Number(state.conditionPct) > 105
      ? "STEVIG"
      : "IDEAAL";

  const pickAIName = () => {
    const pool = isDog ? DOG_NAMES : CAT_NAMES;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    onChange((s) => ({ ...s, name: choice }));
  };

  return (
    <div>
      <h1 style={styles.h1}>Vertel ons over je {titlePet}</h1>
      <p style={styles.lead}>
        Hoe meer we weten, hoe nauwkeuriger de berekening:
      </p>

      <div style={styles.formGrid}>
        <div style={styles.fieldSpan(7)}>
          <label style={styles.label}>Naam</label>
          <input
            style={styles.input}
            value={state.name}
            placeholder="MAX."
            onChange={(e) => onChange((s) => ({ ...s, name: e.target.value }))}
          />
        </div>

        <div style={styles.fieldSpan(5)}>
          <label style={styles.label}>&nbsp;</label>
          <button type="button" style={styles.ghostBtn} onClick={pickAIName}>
            ✨ Ik heb geen inspiratie
          </button>
        </div>

        <div style={styles.fieldSpan(8)}>
          <label style={styles.label}>RAS</label>
          <button
            type="button"
            style={styles.selectBtn}
            onClick={() => setBreedPickerOpen(true)}
          >
            <span style={{ fontWeight: 800 }}>{state.breed}</span>
            <span style={styles.rightHint}>
              {format(state.gender === "male" ? shownBreed.male : shownBreed.female, 1)} kg
            </span>
          </button>
          <div style={styles.smallMuted}>
            Klik om ras te zoeken (met gewicht rechts in de lijst)
          </div>
        </div>

        <div style={styles.fieldSpan(4)}>
          <label style={styles.label}>Geslacht</label>
          <div style={styles.pillRow}>
            <Pill
              active={state.gender === "male"}
              label={genderLabelMale}
              onClick={() => onChange((s) => ({ ...s, gender: "male" }))}
            />
            <Pill
              active={state.gender === "female"}
              label={genderLabelFemale}
              onClick={() => onChange((s) => ({ ...s, gender: "female" }))}
            />
          </div>
        </div>

        <div style={styles.fieldSpan(12)}>
          <div style={styles.weightBox}>
            <div style={styles.weightTop}>
              <div>
                <div style={styles.smallMuted}>Standaardgewicht (ras)</div>
                <div style={styles.bigNumber}>
                  {format(state.gender === "male" ? shownBreed.male : shownBreed.female, 1)} kg
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={styles.smallMuted}>Huidig gewicht (schatting)</div>
                <div style={styles.bigNumber}>
                  {format(state.idealWeight * (state.conditionPct / 100), 1)} kg
                </div>
              </div>
            </div>

            <div style={styles.sliderRow}>
              <span
                style={{
                  ...styles.sliderEdge,
                  opacity: Number(state.conditionPct) <= 95 ? 1 : 0.45,
                }}
              >
                SLANK
              </span>

              <input
                type="range"
                min="80"
                max="130"
                value={state.conditionPct}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    conditionPct: Number(e.target.value),
                  }))
                }
                className="of-range"
              />

              <span
                style={{
                  ...styles.sliderEdge,
                  opacity: Number(state.conditionPct) >= 105 ? 1 : 0.45,
                }}
              >
                STEVIG
              </span>
            </div>

            <div style={{ marginTop: 10, ...styles.smallMuted }}>
              Conditie: <b style={{ color: BRAND.dark }}>{conditionLabel}</b>
            </div>
          </div>
        </div>

        <div style={styles.fieldSpan(6)}>
          <label style={styles.label}>LEEFTIJD</label>
          <div style={styles.stepperRow}>
            <button
              type="button"
              style={styles.stepBtn}
              onClick={() =>
                onChange((s) => ({
                  ...s,
                  ageYears: clamp(Number(s.ageYears) - 1, 0, 30),
                  birthDate: "",
                }))
              }
            >
              −
            </button>

            <input
              type="number"
              min="0"
              max="30"
              value={state.ageYears}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  ageYears: clamp(Number(e.target.value), 0, 30),
                  birthDate: "",
                }))
              }
              style={{ ...styles.input, textAlign: "center", fontWeight: 800 }}
            />

            <button
              type="button"
              style={styles.stepBtn}
              onClick={() =>
                onChange((s) => ({
                  ...s,
                  ageYears: clamp(Number(s.ageYears) + 1, 0, 30),
                  birthDate: "",
                }))
              }
            >
              +
            </button>
          </div>
        </div>

        <div style={styles.fieldSpan(6)}>
          <label style={styles.label}>Geboortedatum</label>
          <input
            type="date"
            value={state.birthDate}
            onChange={(e) =>
              onChange((s) => ({ ...s, birthDate: e.target.value }))
            }
            style={styles.input}
          />
          <div style={styles.smallMuted}>
            Weergave dd-mm-jjjj (browser bepaalt format)
          </div>
        </div>

        <div style={styles.fieldSpan(12)}>
          <div style={styles.tipBox}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Wist je dat?</div>
            <div style={styles.small}>
              Bij Othon & Friends krijgt je huisdier een verrassingscadeau bij
              bestellingen in de verjaardagsmaand!
            </div>
          </div>
        </div>
      </div>

      <BreedPicker
        open={breedPickerOpen}
        breeds={breeds}
        gender={state.gender}
        onClose={() => setBreedPickerOpen(false)}
        onPick={(breedName) => {
          const b = breeds.find((x) => x.name === breedName) || breeds[0];
          const ideal = state.gender === "male" ? b.male : b.female;
          onChange((s) => ({ ...s, breed: breedName, idealWeight: ideal }));
          setBreedPickerOpen(false);
        }}
      />

      <NavRow onBack={onBack} onNext={() => onNext()} />
    </div>
  );
}

function StepActivity({ state, onChange, onBack, onNext }) {
  const titlePet = state.petType === "cat" ? "kat" : "hond";

  return (
    <div>
      <h1 style={styles.h1}>Hoe actief is je {titlePet}?</h1>
      <p style={styles.lead}>Dit helpt ons de juiste portie te berekenen.</p>

      <div style={styles.grid2}>
        {ACTIVITY_LEVELS.map((a) => (
          <SelectableBox
            key={a.key}
            title={a.title}
            subtitle={a.desc}
            active={state.activity === a.key}
            onClick={() => onChange((s) => ({ ...s, activity: a.key }))}
          />
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={styles.sectionTitle}>Gecastreerd / Gesteriliseerd</div>
        <Toggle
          on={state.neutered}
          setOn={(v) => onChange((s) => ({ ...s, neutered: v }))}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={styles.sectionTitle}>Lichaamsconditie</div>
        <div style={styles.pillRow}>
          {BODY_CONDITION.map((b) => (
            <Pill
              key={b.key}
              active={state.bodyCond === b.key}
              label={b.label}
              onClick={() => onChange((s) => ({ ...s, bodyCond: b.key }))}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={styles.sectionTitle}>Snoepjes</div>
        <div style={styles.smallMuted}>
          (Wees eerlijk... we weten dat ze zo lief kijken dat je niet kunt
          weigeren.)
        </div>

        <div style={{ ...styles.grid2, marginTop: 12 }}>
          {TREATS.map((t) => (
            <SelectableBox
              key={t.key}
              title={t.label}
              subtitle=""
              active={state.treats === t.key}
              onClick={() => onChange((s) => ({ ...s, treats: t.key }))}
            />
          ))}
        </div>
      </div>

      <NavRow onBack={onBack} onNext={() => onNext()} />
    </div>
  );
}

function StepPrefs({ state, onChange, onBack, onNext }) {
  const excludedSet = new Set(state.excluded);

  const left = INGREDIENTS.filter((i) => !excludedSet.has(i));
  const right = INGREDIENTS;

  function toggleExclude(ing) {
    onChange((s) => {
      const set = new Set(s.excluded);
      if (set.has(ing)) set.delete(ing);
      else set.add(ing);
      return { ...s, excluded: Array.from(set) };
    });
  }

  return (
    <div>
      <h1 style={styles.h1}>Aanvullende voorkeuren</h1>
      <p style={styles.lead}>
        Heeft je huisdier favoriete ingrediënten of allergieën?
      </p>

      <div style={styles.prefGrid}>
        <div style={styles.prefCol}>
          <div style={styles.prefHead}>
            <div style={{ fontWeight: 900 }}>Voorkeuren</div>
            <div style={styles.smallMuted}>
              Ingrediënten die zeker in de voeding mogen
            </div>
          </div>

          <div style={styles.prefList}>
            {left.map((ing) => (
              <div key={ing} style={styles.prefItem}>
                <span style={styles.heart}>♥</span>
                <span style={{ fontWeight: 800 }}>{ing}</span>
                {SENSITIVE.has(ing) && (
                  <span style={styles.warnTri} title="Gevoelig ingrediënt">
                    ▲
                  </span>
                )}
              </div>
            ))}
            {left.length === 0 && (
              <div style={styles.emptyBox}>
                Alles staat momenteel uitgesloten via allergieën/afkeer.
              </div>
            )}
          </div>
        </div>

        <div style={styles.prefCol}>
          <div style={styles.prefHead}>
            <div style={{ fontWeight: 900 }}>Allergieën & afkeer</div>
            <div style={styles.smallMuted}>
              Ingrediënten die we uitsluiten
            </div>
            <div style={styles.smallMuted}>
              SELECTEER HIER WAT ER NIET IN MOET
            </div>
          </div>

          <div style={styles.prefList}>
            {right.map((ing) => {
              const active = excludedSet.has(ing);

              return (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggleExclude(ing)}
                  style={styles.allergyBtn(active)}
                >
                  <span style={{ fontWeight: 800 }}>{ing}</span>
                  {SENSITIVE.has(ing) && (
                    <span style={styles.warnTri} title="Gevoelig ingrediënt">
                      ▲
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={styles.sectionTitle}>Type voeding</div>
        <div style={styles.pillRow}>
          {["Droogvoer", "Natvoer", "Gemengd"].map((t) => (
            <Pill
              key={t}
              active={state.foodType === t}
              label={t}
              onClick={() => onChange((s) => ({ ...s, foodType: t }))}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={styles.sectionTitle}>Abonnement levering</div>
        <div style={styles.pillRow}>
          {SUBSCRIPTION_OPTIONS.map((opt) => (
            <Pill
              key={opt.key}
              active={state.subscriptionDays === opt.key}
              label={opt.label}
              onClick={() =>
                onChange((s) => ({ ...s, subscriptionDays: opt.key }))
              }
            />
          ))}
        </div>
      </div>

      <NavRow onBack={onBack} onNext={() => onNext()} />
    </div>
  );
}

function StepResult({
  state,
  preferredIngredients,
  adjustedWeightKg,
  ageDisplay,
  ofGramsPerDay,
  avgBrandGramsPerDay,
  ofCostPerDay,
  avgCostPerDay,
  ofCostPerMonth,
  avgCostPerMonth,
  gramsLessPct,
  savingsPerMonth,
  subscriptionKgRounded,
  bagsNeeded,
  subscriptionDaysActual,
  orderCostOF,
  passportRef,
  onReset,
  onDownload,
}) {
  const petLabel = state.petType === "cat" ? "Kat" : "Hond";
  const created = nowDateNL();

  return (
    <div>
      <h1 style={styles.h1}>
        Voedingsplan voor {state.name || "je huisdier"}
      </h1>
      <p style={styles.lead}>
        Op basis van alles wat je ons hebt verteld, is dit onze aanbeveling voor{" "}
        {state.name || "je huisdier"}.
      </p>

      <div style={styles.hero}>
        <div style={styles.heroTop}>
          <div style={styles.smallMuted}>Dagelijkse portie · Aanbevolen</div>
          <div style={styles.heroNumber}>{format(ofGramsPerDay, 0)}g</div>
          <div style={styles.smallMuted}>Othon & Friends · per dag</div>
        </div>

        <div style={{ marginTop: 14, ...styles.infoCard }}>
          <div style={{ fontWeight: 900 }}>Aanbevolen bestelling</div>

          <div style={styles.smallMuted}>
            Voor {state.subscriptionDays} dagen voeding
          </div>

          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
            {subscriptionKgRounded} kg voeding
          </div>

          <div style={styles.smallMuted}>
            {bagsNeeded} zakken van 3 kg
          </div>

          <div style={styles.smallMuted}>
            Goed voor ongeveer {subscriptionDaysActual} dagen
          </div>

          <div style={{ marginTop: 8, fontWeight: 900 }}>
            Kost: €{format(orderCostOF, 2)}
          </div>
        </div>

        <div style={styles.compare}>
          <div style={styles.compareTitle}>Vergelijking</div>

          <div style={styles.compareGrid}>
            <div></div>
            <div style={styles.compareColHead}>Othon & Friends</div>
            <div style={styles.compareColHead}>Gemiddeld merk</div>

            <div style={styles.compareRowLabel}>Gram per dag</div>
            <div style={styles.compareVal}>{format(ofGramsPerDay, 0)}g</div>
            <div style={styles.compareValMuted}>
              {format(avgBrandGramsPerDay, 0)}g
            </div>

            <div style={styles.compareRowLabel}>Kosten per dag</div>
            <div style={styles.compareVal}>€{format(ofCostPerDay, 2)}</div>
            <div style={styles.compareValMuted}>
              €{format(avgCostPerDay, 2)}
            </div>

            <div style={styles.compareRowLabel}>Kosten per maand</div>
            <div style={styles.compareVal}>€{format(ofCostPerMonth, 2)}</div>
            <div style={styles.compareValMuted}>
              €{format(avgCostPerMonth, 2)}
            </div>
          </div>

          <div style={styles.savings}>
            <div style={styles.savingsPct}>
              {format(gramsLessPct * 100, 0)}% minder voeding nodig
            </div>
            <div style={styles.savingsMoney}>
              Je bespaart €{format(savingsPerMonth, 2)} per maand
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={styles.sectionTitle}>
          Waarom minder voeding juist beter is
        </div>
        <div style={styles.smallMuted}>
          Minder gram per dag betekent niet minder voedingswaarde, integendeel.
        </div>

        <div style={{ ...styles.grid2, marginTop: 12 }}>
          <InfoCard
            title="Betere vertering"
            text="Hoogwaardige ingrediënten worden efficiënter opgenomen, wat leidt tot minder belasting op het spijsverteringsstelsel."
          />
          <InfoCard
            title="Gezond gewicht"
            text="De juiste hoeveelheid voedingsstoffen zonder overbodig vulmateriaal helpt een gezond gewicht te behouden."
          />
          <InfoCard
            title="Glanzende vacht & sterke botten"
            text="Natuurlijke ingrediënten boordevol omega-3 en essentiële mineralen voor een stralende vacht en sterke botten."
          />
          <InfoCard
            title="Meer energie"
            text="Kwalitatief hoogstaande eiwitten en vetten geven langdurige energie in plaats van korte pieken."
          />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={styles.passportWrap} ref={passportRef}>
          <div style={styles.passportHeader}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>
              {state.name || petLabel}
            </div>
            <div style={styles.small}>Huisdierpaspoort</div>
          </div>

          <div style={styles.passportBody}>
            <div style={styles.passportCols}>
              <div style={styles.passportBlock}>
                <div style={styles.passportBlockTitle}>Aanbevolen porties</div>

                <div style={styles.portionRow}>
                  <div style={{ fontWeight: 900 }}>Othon & Friends</div>
                  <div style={{ fontWeight: 900 }}>
                    {format(ofGramsPerDay, 0)}g
                  </div>
                  <div style={styles.smallMuted}>Gram per dag</div>
                </div>

                <div style={styles.portionRowAlt}>
                  <div style={{ fontWeight: 900 }}>Gemiddeld merk</div>
                  <div style={{ fontWeight: 900 }}>
                    {format(avgBrandGramsPerDay, 0)}g
                  </div>
                  <div style={styles.smallMuted}>Gram per dag</div>
                </div>
              </div>

              <div style={styles.passportBlock}>
                <div style={styles.passportBlockTitle}>Gegevens</div>

                <div style={styles.kv}>
                  <span>Naam</span>
                  <b>{state.name || "-"}</b>
                </div>

                <div style={styles.kv}>
                  <span>Ras</span>
                  <b>{state.breed}</b>
                </div>

                <div style={styles.kv}>
                  <span>Leeftijd</span>
                  <b>{ageDisplay}</b>
                </div>

                <div style={styles.kv}>
                  <span>Gewicht</span>
                  <b>{format(adjustedWeightKg, 1)} kg</b>
                </div>

                <div style={styles.kv}>
                  <span>Activiteit</span>
                  <b>
                    {ACTIVITY_LEVELS.find((a) => a.key === state.activity)?.title ||
                      state.activity}
                  </b>
                </div>

                <div style={styles.kv}>
                  <span>Type voeding</span>
                  <b>{state.foodType}</b>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={styles.passportBlockTitle}>Houdt van</div>
              <div style={styles.tagRow}>
                {preferredIngredients.map((i) => (
                  <span key={i} style={styles.tag}>
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.footNote}>
              Weeg je huisdier elke 3–6 maanden en herbereken de portie. Zo
              groeit en leeft je huisdier op z’n best!
            </div>

            <div style={styles.createdRow}>
              <span>Aangemaakt op {created}</span>
              <span style={{ fontWeight: 900 }}>Othon & Friends</span>
            </div>
          </div>
        </div>

        <div style={styles.actionRow}>
          <button type="button" style={styles.primaryBtn} onClick={onDownload}>
            Download paspoort (PDF)
          </button>

          <button type="button" style={styles.secondaryBtn} onClick={onReset}>
            Bereken voor een ander huisdier
          </button>

          <button
            type="button"
            style={styles.ghostBtnSmall}
            onClick={() => {
              const txt = `Othon & Friends voedingsplan voor ${
                state.name || "je huisdier"
              }: ${format(ofGramsPerDay, 0)}g/dag, aanbevolen bestelling ${
                subscriptionKgRounded
              } kg`;
              if (navigator.share) {
                navigator.share({
                  title: `Voedingsplan ${state.name || ""}`.trim(),
                  text: txt,
                });
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(txt);
              }
            }}
          >
            Deel
          </button>
        </div>

        <div style={styles.smallMuted}>
          * Als PDF-libraries niet geïnstalleerd zijn in je compiler, gebruikt
          de knop “print” als fallback.
        </div>
      </div>
    </div>
  );
}

/* UI atoms */

function SelectCard({ title, subtitle, icon, onClick }) {
  return (
    <button type="button" onClick={onClick} style={styles.selectCard}>
      <div style={styles.selectIcon}>{icon}</div>
      <div style={{ textAlign: "left" }}>
        <div style={styles.selectTitle}>{title}</div>
        <div style={styles.selectSub}>{subtitle}</div>
      </div>
      <div style={styles.chev}>›</div>
    </button>
  );
}

function SelectableBox({ title, subtitle, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={styles.box(active)}>
      <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
      {!!subtitle && <div style={styles.smallMuted}>{subtitle}</div>}
    </button>
  );
}

function Pill({ active, label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={styles.pill(active)}>
      {label}
    </button>
  );
}

function Toggle({ on, setOn }) {
  return (
    <button type="button" onClick={() => setOn(!on)} style={styles.toggle(on)}>
      <span style={styles.toggleKnob(on)} />
      <span style={{ fontWeight: 800, marginLeft: 10 }}>
        {on ? "Aan" : "Uit"}
      </span>
    </button>
  );
}

function InfoCard({ title, text }) {
  return (
    <div style={styles.infoCard}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <div style={styles.smallMuted}>{text}</div>
    </div>
  );
}

function NavRow({ onBack, onNext }) {
  return (
    <div style={styles.navRow}>
      <button type="button" style={styles.backLink} onClick={onBack}>
        TERUG
      </button>
      <button type="button" style={styles.primaryBtn} onClick={onNext}>
        VOLGENDE
      </button>
    </div>
  );
}

function BreedPicker({ open, breeds, gender, onPick, onClose }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return breeds;
    return breeds.filter((b) => b.name.toLowerCase().includes(s));
  }, [q, breeds]);

  if (!open) return null;

  return (
    <div style={styles.modalOverlay} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={{ fontWeight: 900 }}>Kies ras</div>
          <button type="button" style={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          style={styles.input}
          placeholder="Zoek een ras"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        <div style={styles.modalList}>
          {filtered.map((b) => {
            const w = gender === "male" ? b.male : b.female;
            return (
              <button
                key={b.name}
                type="button"
                style={styles.modalItem}
                onClick={() => onPick(b.name)}
              >
                <span style={{ fontWeight: 800 }}>{b.name}</span>
                <span style={styles.modalWeight}>{format(w, 1)} kg</span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div style={styles.emptyBox}>Geen rassen gevonden.</div>
          )}
        </div>

        <div style={styles.smallMuted}>
          Tip: voeg later extra rassen toe in de arrays bovenaan.
        </div>
      </div>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      .of-range{
        -webkit-appearance:none;
        width:100%;
        height:8px;
        border-radius:999px;
        background: rgba(144,192,232,.35);
        outline:none;
      }
      .of-range::-webkit-slider-thumb{
        -webkit-appearance:none;
        appearance:none;
        width:22px;
        height:22px;
        border-radius:50%;
        background:${BRAND.orange};
        box-shadow: 0 8px 18px rgba(241,137,26,.35);
        cursor:pointer;
        border: 3px solid white;
      }
      .of-range::-moz-range-thumb{
        width:22px;
        height:22px;
        border-radius:50%;
        background:${BRAND.orange};
        box-shadow: 0 8px 18px rgba(241,137,26,.35);
        cursor:pointer;
        border: 3px solid white;
      }
    `}</style>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: `radial-gradient(1200px 600px at 20% 10%, rgba(144,192,232,.35), transparent 60%),
                 radial-gradient(1200px 600px at 80% 0%, rgba(241,137,26,.18), transparent 60%),
                 ${BRAND.light}`,
    padding: "34px 16px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    color: BRAND.dark,
  },
  shell: {
    maxWidth: 980,
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,.94)",
    border: `1px solid ${BRAND.border}`,
    borderRadius: 24,
    boxShadow: "0 30px 80px rgba(31,41,55,.08)",
    padding: 28,
    backdropFilter: "blur(8px)",
  },

  langRow: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  langPill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(144,192,232,.28)",
    border: `1px solid rgba(144,192,232,.6)`,
  },
  langPillMuted: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(31,41,55,.04)",
    border: `1px solid rgba(31,41,55,.08)`,
    color: BRAND.muted,
  },

  progressWrap: {
    height: 7,
    background: "rgba(31,41,55,.06)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.orange})`,
    borderRadius: 999,
    transition: "width .35s ease",
  },

  stepRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  },
  stepChip: (active, done) => ({
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 999,
    border: `1px solid ${
      active ? "rgba(241,137,26,.45)" : "rgba(31,41,55,.10)"
    }`,
    background: done
      ? "rgba(45,187,127,.10)"
      : active
      ? "rgba(241,137,26,.10)"
      : "rgba(255,255,255,.8)",
    color: done ? "#0f5132" : BRAND.dark,
    fontWeight: active ? 900 : 700,
  }),

  h1: {
    fontSize: 28,
    lineHeight: 1.15,
    margin: "10px 0 6px",
    fontWeight: 950,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 18,
    margin: "16px 0 6px",
    fontWeight: 900,
  },
  lead: {
    margin: "0 0 14px",
    color: "rgba(31,41,55,.72)",
    fontSize: 14,
  },

  muted: {
    color: "rgba(31,41,55,.65)",
    fontSize: 14,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  },

  selectCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    borderRadius: 20,
    border: `1px solid rgba(31,41,55,.10)`,
    background: "white",
    padding: 18,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(31,41,55,.05)",
    transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
  },
  selectIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    background: `linear-gradient(135deg, rgba(144,192,232,.35), rgba(241,137,26,.18))`,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    border: `1px solid rgba(31,41,55,.08)`,
  },
  selectTitle: {
    fontWeight: 950,
    fontSize: 16,
  },
  selectSub: {
    color: "rgba(31,41,55,.68)",
    fontSize: 13,
    marginTop: 2,
  },
  chev: {
    marginLeft: "auto",
    fontSize: 26,
    color: "rgba(31,41,55,.35)",
    fontWeight: 900,
  },

  brandNote: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    border: `1px dashed rgba(31,41,55,.18)`,
    background: "rgba(255,255,255,.75)",
  },
  small: {
    fontSize: 13,
    color: "rgba(31,41,55,.70)",
  },
  smallMuted: {
    fontSize: 12,
    color: "rgba(31,41,55,.58)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  fieldSpan: (n) => ({
    gridColumn: `span ${n}`,
  }),

  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.4,
    marginBottom: 6,
    color: "rgba(31,41,55,.72)",
  },
  input: {
    width: "100%",
    borderRadius: 14,
    border: `1px solid rgba(31,41,55,.14)`,
    padding: "12px 12px",
    fontSize: 14,
    outline: "none",
    background: "white",
    boxSizing: "border-box",
  },

  ghostBtn: {
    width: "100%",
    borderRadius: 14,
    border: `1px solid rgba(144,192,232,.55)`,
    background: "rgba(144,192,232,.14)",
    padding: "12px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  ghostBtnSmall: {
    borderRadius: 14,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "rgba(31,41,55,.04)",
    padding: "12px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  selectBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 14,
    border: `1px solid rgba(31,41,55,.14)`,
    padding: "12px 12px",
    background: "white",
    cursor: "pointer",
  },
  rightHint: {
    color: "rgba(31,41,55,.55)",
    fontWeight: 900,
  },

  pillRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  pill: (active) => ({
    borderRadius: 999,
    border: `1px solid ${
      active ? "rgba(241,137,26,.55)" : "rgba(31,41,55,.12)"
    }`,
    background: active ? "rgba(241,137,26,.12)" : "rgba(255,255,255,.9)",
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
  }),

  weightBox: {
    borderRadius: 20,
    border: `1px solid rgba(31,41,55,.10)`,
    background:
      "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.70))",
    padding: 16,
    boxShadow: "0 14px 34px rgba(31,41,55,.05)",
  },
  weightTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-end",
  },
  bigNumber: {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  sliderRow: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "72px 1fr 72px",
    gap: 12,
    alignItems: "center",
  },
  sliderEdge: {
    fontSize: 12,
    fontWeight: 950,
    color: "rgba(31,41,55,.65)",
  },

  stepperRow: {
    display: "grid",
    gridTemplateColumns: "44px 1fr 44px",
    gap: 10,
    alignItems: "center",
  },
  stepBtn: {
    borderRadius: 14,
    border: `1px solid rgba(31,41,55,.14)`,
    background: "white",
    height: 44,
    fontSize: 18,
    fontWeight: 950,
    cursor: "pointer",
  },

  tipBox: {
    borderRadius: 18,
    border: `1px solid rgba(144,192,232,.45)`,
    background: "rgba(144,192,232,.12)",
    padding: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 950,
    marginBottom: 8,
  },

  box: (active) => ({
    width: "100%",
    textAlign: "left",
    borderRadius: 20,
    border: `1px solid ${
      active ? "rgba(241,137,26,.55)" : "rgba(31,41,55,.12)"
    }`,
    background: active ? "rgba(241,137,26,.10)" : "white",
    padding: 16,
    cursor: "pointer",
    boxShadow: active
      ? "0 16px 36px rgba(241,137,26,.12)"
      : "0 14px 34px rgba(31,41,55,.05)",
  }),

  toggle: (on) => ({
    borderRadius: 999,
    border: `1px solid ${
      on ? "rgba(241,137,26,.55)" : "rgba(31,41,55,.12)"
    }`,
    background: on ? "rgba(241,137,26,.12)" : "rgba(31,41,55,.04)",
    padding: "10px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    fontWeight: 900,
  }),
  toggleKnob: (on) => ({
    width: 38,
    height: 22,
    borderRadius: 999,
    background: on ? BRAND.orange : "rgba(31,41,55,.25)",
    position: "relative",
    display: "inline-block",
    transition: "background .2s ease",
    boxShadow: on ? "0 10px 20px rgba(241,137,26,.22)" : "none",
    overflow: "hidden",
  }),

  prefGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 14,
  },
  prefCol: {
    borderRadius: 20,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "white",
    padding: 14,
    boxShadow: "0 14px 34px rgba(31,41,55,.05)",
  },
  prefHead: {
    marginBottom: 10,
  },
  prefList: {
    display: "grid",
    gap: 10,
  },
  prefItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    border: `1px solid rgba(31,41,55,.10)`,
    padding: "10px 12px",
    background: "rgba(144,192,232,.08)",
  },
  heart: {
    color: BRAND.orange,
    fontWeight: 950,
  },
  warnTri: {
    marginLeft: "auto",
    color: "#d64045",
    fontWeight: 950,
    fontSize: 12,
  },

  allergyBtn: (active) => ({
    width: "100%",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    borderRadius: 14,
    border: `1px solid ${
      active ? "rgba(214,64,69,.45)" : "rgba(31,41,55,.10)"
    }`,
    padding: "10px 12px",
    background: active ? "rgba(214,64,69,.10)" : "white",
    cursor: "pointer",
  }),

  emptyBox: {
    padding: 12,
    borderRadius: 14,
    border: `1px dashed rgba(31,41,55,.20)`,
    color: "rgba(31,41,55,.65)",
    fontSize: 13,
  },

  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },
  backLink: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 950,
    color: "rgba(31,41,55,.75)",
  },
  primaryBtn: {
    borderRadius: 16,
    border: `1px solid rgba(241,137,26,.55)`,
    background: BRAND.orange,
    color: "white",
    padding: "12px 18px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(241,137,26,.22)",
  },
  secondaryBtn: {
    borderRadius: 16,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "white",
    padding: "12px 18px",
    fontWeight: 950,
    cursor: "pointer",
  },

  hero: {
    borderRadius: 22,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "white",
    padding: 16,
    boxShadow: "0 18px 44px rgba(31,41,55,.06)",
  },
  heroTop: {
    borderRadius: 18,
    background: `linear-gradient(135deg, rgba(144,192,232,.22), rgba(241,137,26,.10))`,
    border: `1px solid rgba(31,41,55,.08)`,
    padding: 16,
    textAlign: "center",
  },
  heroNumber: {
    fontSize: 44,
    fontWeight: 980,
    letterSpacing: -0.8,
    margin: "6px 0",
  },

  compare: {
    marginTop: 14,
    borderRadius: 18,
    border: `1px solid rgba(31,41,55,.10)`,
    padding: 14,
    background: "rgba(31,41,55,.02)",
  },
  compareTitle: {
    fontWeight: 950,
    marginBottom: 10,
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 10,
    alignItems: "center",
  },
  compareColHead: {
    fontWeight: 950,
    color: "rgba(31,41,55,.75)",
  },
  compareRowLabel: {
    color: "rgba(31,41,55,.65)",
    fontWeight: 800,
  },
  compareVal: {
    fontWeight: 950,
  },
  compareValMuted: {
    fontWeight: 950,
    color: "rgba(31,41,55,.55)",
  },

  savings: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px solid rgba(31,41,55,.10)`,
  },
  savingsPct: {
    fontWeight: 950,
    color: "#0f5132",
    background: "rgba(45,187,127,.10)",
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(45,187,127,.22)",
  },
  savingsMoney: {
    marginTop: 8,
    fontWeight: 950,
    color: BRAND.dark,
  },

  infoCard: {
    borderRadius: 18,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "white",
    padding: 14,
    boxShadow: "0 14px 34px rgba(31,41,55,.05)",
  },

  passportWrap: {
    borderRadius: 22,
    overflow: "hidden",
    border: `1px solid rgba(31,41,55,.12)`,
    background: "white",
  },
  passportHeader: {
    background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.orange})`,
    padding: 14,
    color: BRAND.dark,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  passportBody: {
    padding: 14,
  },
  passportCols: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  passportBlock: {
    borderRadius: 18,
    border: `1px solid rgba(31,41,55,.10)`,
    padding: 12,
    background: "rgba(31,41,55,.02)",
  },
  passportBlockTitle: {
    fontWeight: 950,
    marginBottom: 10,
  },
  portionRow: {
    borderRadius: 16,
    border: `1px solid rgba(241,137,26,.25)`,
    padding: 12,
    background: "rgba(241,137,26,.08)",
    marginBottom: 10,
  },
  portionRowAlt: {
    borderRadius: 16,
    border: `1px solid rgba(31,41,55,.10)`,
    padding: 12,
    background: "white",
  },
  kv: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: "6px 0",
    borderBottom: "1px dashed rgba(31,41,55,.12)",
  },

  tagRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(144,192,232,.45)",
    background: "rgba(144,192,232,.12)",
  },

  footNote: {
    marginTop: 12,
    fontSize: 12,
    color: "rgba(31,41,55,.65)",
  },
  createdRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 12,
    color: "rgba(31,41,55,.65)",
  },

  actionRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 12,
    alignItems: "center",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(31,41,55,.35)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    width: "min(760px, 100%)",
    background: "white",
    borderRadius: 22,
    border: `1px solid rgba(31,41,55,.12)`,
    boxShadow: "0 40px 120px rgba(0,0,0,.25)",
    padding: 16,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalClose: {
    borderRadius: 12,
    border: `1px solid rgba(31,41,55,.12)`,
    background: "rgba(31,41,55,.04)",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 900,
  },
  modalList: {
    marginTop: 10,
    maxHeight: 420,
    overflow: "auto",
    borderRadius: 16,
    border: `1px solid rgba(31,41,55,.10)`,
  },
  modalItem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 12px",
    border: "none",
    background: "white",
    cursor: "pointer",
    borderBottom: "1px solid rgba(31,41,55,.08)",
  },
  modalWeight: {
    fontWeight: 950,
    color: "rgba(31,41,55,.55)",
  },
};