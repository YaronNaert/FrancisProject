import React, { useState, useEffect, useMemo } from "react";
import { SelectCard, SelectableBox, Pill, Toggle, NavRow, BreedPicker } from "./UIComponents";
import { DOG_NAMES, CAT_NAMES, ACTIVITY_LEVELS, INGREDIENTS } from "../data";

// --- SHARED STYLES ---
const stepStyles = {
  wrapper: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px 0",
  },
  h1: { fontSize: "32px", fontWeight: "900", color: "#2d3436", marginBottom: "8px", textAlign: "center" },
  lead: { fontSize: "18px", color: "#636e72", marginBottom: "40px", textAlign: "center" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "20px" },
  label: { display: "block", fontSize: "12px", fontWeight: "800", color: "#b2bec3", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" },
  weightBox: { background: "white", padding: "30px", borderRadius: "24px", border: "1px solid #edf2f7", marginBottom: "20px" },
  brandNote: { marginTop: "60px", padding: "24px", borderRadius: "20px", backgroundColor: "#f1f5f9", textAlign: "center", color: "#475569" }
};

// --- STEP 1: TYPE ---
export function StepType({ onPick }) {
  return (
    <div style={stepStyles.wrapper}>
      <h1 style={stepStyles.h1}>Voedingscalculator</h1>
      <p style={stepStyles.lead}>Ontdek hoeveel voeding je huisdier nodig heeft</p>
      <div style={stepStyles.grid2}>
        <SelectCard title="Hond" subtitle="Je trouwste vriend" onClick={() => onPick("dog")} icon="🐶" />
        <SelectCard title="Kat" subtitle="De baas in huis" onClick={() => onPick("cat")} icon="🐱" />
      </div>
      <div style={stepStyles.brandNote}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Othon & Friends</div>
        <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
          We werken nauw samen met dierenartsen, maar elk dier is uniek.
        </div>
      </div>
    </div>
  );
}

// --- STEP 2: DATA ---
export function StepData({ state, breeds, onChange, onBack, onNext, ageDisplay }) {
  const [breedPickerOpen, setBreedPickerOpen] = useState(false);
  const isDog = state.petType === "dog";
  const shownBreed = breeds.find((b) => b.name === state.breed) || breeds[0];

  const pickAIName = () => {
    const pool = isDog ? DOG_NAMES : CAT_NAMES;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    onChange((s) => ({ ...s, name: choice }));
  };

  return (
    <div style={stepStyles.wrapper}>
      <h1 style={stepStyles.h1}>Vertel ons over je {isDog ? "hond" : "kat"}</h1>
      <div style={stepStyles.formGrid}>
        <div style={{ gridColumn: "span 9" }}>
          <label style={stepStyles.label}>Naam</label>
          <input 
            style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "16px" }}
            value={state.name} 
            onChange={(e) => onChange((s) => ({ ...s, name: e.target.value }))} 
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <label style={stepStyles.label}>&nbsp;</label>
          <button type="button" style={{ background: "none", border: "none", color: "#F1891A", cursor: "pointer", fontWeight: "bold", marginTop: '10px' }} onClick={pickAIName}>✨ Inspiratie?</button>
        </div>

        <div style={{ gridColumn: "span 12" }}>
          <div style={stepStyles.weightBox}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#636e72" }}>Huidig Gewicht</div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#F1891A" }}>
                  {(state.idealWeight * (state.conditionPct / 100)).toFixed(1)} <span style={{fontSize: '16px'}}>kg</span>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{ fontSize: "12px", color: "#636e72" }}>Geboortedatum</div>
                <input 
                   type="date" 
                   value={state.birthDate} 
                   style={{border: 'none', fontWeight: 'bold', textAlign: 'right', outline: 'none'}}
                   onChange={(e) => onChange((s) => ({ ...s, birthDate: e.target.value }))}
                />
              </div>
            </div>
            <input 
              type="range" min="70" max="140" value={state.conditionPct} 
              style={{ width: "100%", accentColor: "#F1891A", cursor: "pointer" }}
              onChange={(e) => onChange((s) => ({ ...s, conditionPct: Number(e.target.value) }))} 
            />
          </div>
        </div>
      </div>
      <BreedPicker 
        open={breedPickerOpen} breeds={breeds} gender={state.gender} 
        onClose={() => setBreedPickerOpen(false)} 
        onPick={(name) => {
          const b = breeds.find((x) => x.name === name) || breeds[0];
          onChange((s) => ({ ...s, breed: name, idealWeight: state.gender === "male" ? b.male : b.female }));
          setBreedPickerOpen(false);
        }} 
      />
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

// --- STEP 3: ACTIVITY ---
export function StepActivity({ state, onChange, onBack, onNext }) {
  const titlePet = state.petType === "cat" ? "kat" : "hond";
  const autoCondition = useMemo(() => {
    const pct = Number(state.conditionPct);
    if (pct < 95) return "ondergewicht";
    if (pct > 105) return "overgewicht";
    return "ideaal";
  }, [state.conditionPct]);

  useEffect(() => {
    onChange((s) => ({ ...s, bodyCond: autoCondition }));
  }, [autoCondition, onChange]);

  const conditionLabels = {
    ondergewicht: { label: "Slank / Ondergewicht", color: "#3498db" },
    ideaal: { label: "Ideaal gewicht", color: "#2ecc71" },
    overgewicht: { label: "Stevig / Overgewicht", color: "#e74c3c" }
  };
  const current = conditionLabels[autoCondition];

  return (
    <div style={stepStyles.wrapper}>
      <h1 style={stepStyles.h1}>Hoe actief is je {titlePet}?</h1>
      <div style={stepStyles.grid2}>
        {ACTIVITY_LEVELS.map((a) => (
          <SelectableBox key={a.key} title={a.title} subtitle={a.desc} active={state.activity === a.key} onClick={() => onChange((s) => ({ ...s, activity: a.key }))} />
        ))}
      </div>
      <div style={{ background: "white", padding: "20px", borderRadius: "16px", borderLeft: `6px solid ${current.color}`, marginTop: "20px" }}>
        <div style={{ fontWeight: '800' }}>{current.label}</div>
        <p style={{ fontSize: '13px', color: '#636e72' }}>Berekend op basis van gewicht t.o.v. rasgemiddelde.</p>
      </div>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

// --- STEP 4: PREFS ---
export function StepPrefs({ state, onChange, onBack, onNext }) {
  const excludedSet = new Set(state.excluded);
  const toggleExclude = (ing) => {
    onChange((s) => {
      const set = new Set(s.excluded);
      if (set.has(ing)) set.delete(ing); else set.add(ing);
      return { ...s, excluded: Array.from(set) };
    });
  };

  return (
    <div style={stepStyles.wrapper}>
      <h1 style={stepStyles.h1}>Allergieën</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {INGREDIENTS.map((ing) => (
          <button 
            key={ing} 
            type="button"
            onClick={() => toggleExclude(ing)}
            style={{ 
              padding: '15px', 
              borderRadius: '12px', 
              border: excludedSet.has(ing) ? '2px solid #F1891A' : '1px solid #e2e8f0',
              background: excludedSet.has(ing) ? '#fff5eb' : 'white',
              cursor: 'pointer',
              fontWeight: excludedSet.has(ing) ? '800' : '500'
            }}
          >
            {ing}
          </button>
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

// --- STEP 5: RESULT ---
export function StepResult({ state, ofGramsPerDay, subscriptionKgRounded, subscriptionDaysActual, ofCostPerDay, passportRef, onReset, onDownload }) {
  const cardStyle = {
    background: "linear-gradient(135deg, #2d3436 0%, #000000 100%)",
    borderRadius: "32px",
    padding: "40px",
    color: "white",
    marginBottom: "30px"
  };

  return (
    <div style={stepStyles.wrapper}>
      <h1 style={stepStyles.h1}>Jouw Voedingsplan</h1>
      <div ref={passportRef} style={cardStyle}>
        <div style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase" }}>Dagelijkse Portie</div>
        <div style={{ fontSize: "42px", fontWeight: "900", color: "#F1891A" }}>{Math.round(ofGramsPerDay)}g</div>
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{state.name}</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>{state.breed}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        <button style={{ flex: 2, padding: "18px", background: "#F1891A", color: "white", border: "none", borderRadius: "16px", fontWeight: "900", cursor: "pointer" }} onClick={onDownload}>📄 Download Plan</button>
        <button style={{ flex: 1, padding: "18px", background: "white", border: "2px solid #e2e8f0", borderRadius: "16px", fontWeight: "700", cursor: "pointer" }} onClick={onReset}>🔄 Klaar</button>
      </div>
    </div>
  );
}