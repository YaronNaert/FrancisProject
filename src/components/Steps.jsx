import React, { useState, useEffect, useMemo } from "react";
import { SelectCard, SelectableBox, Pill, Toggle, NavRow, BreedPicker } from "./UIComponents";
import { DOG_NAMES, CAT_NAMES, ACTIVITY_LEVELS, INGREDIENTS } from "../data";

// --- SHARED STYLES ---
// --- SHARED STYLES ---
const stepStyles = {
  wrapper: {
    width: "100%", // Let the parent StepCard decide the width
    margin: "0",    // Remove the auto margin
    padding: "0",   // Remove extra padding
  },
  h1: { 
    fontSize: "32px", 
    fontWeight: "900", 
    color: "var(--text-dark)", 
    marginBottom: "8px", 
    textAlign: "center" 
  },
  lead: { 
    fontSize: "18px", 
    color: "var(--text-muted)", 
    marginBottom: "40px", 
    textAlign: "center" 
  },
  grid2: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "20px", 
    marginBottom: "30px" 
  },
  formGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(12, 1fr)", 
    gap: "20px" 
  },
  label: { 
    display: "block", 
    fontSize: "12px", 
    fontWeight: "800", 
    color: "#b2bec3", 
    textTransform: "uppercase", 
    marginBottom: "8px", 
    letterSpacing: "0.5px" 
  },
  weightBox: { 
    background: "var(--white)", 
    padding: "30px", 
    borderRadius: "24px", 
    border: "1px solid var(--border-color)", 
    marginBottom: "20px",
    boxShadow: "var(--shadow-soft)"
  },
  brandNote: { 
    marginTop: "60px", 
    padding: "24px", 
    borderRadius: "20px", 
    backgroundColor: "#f1f5f9", 
    textAlign: "center", 
    color: "#475569" 
  }
};

// --- STEP 1: TYPE ---
export function StepType({ onPick }) {
  return (
    <div style={stepStyles.wrapper} className="animate-fade-in">
      {/* Title and Lead use global typography classes + specific alignment inline */}
      <h1 className="h1" style={stepStyles.h1}>Voedingscalculator</h1>
      <p className="lead" style={stepStyles.lead}>Ontdek hoeveel voeding je huisdier nodig heeft</p>
      
      <div style={stepStyles.grid2}>
        <SelectCard 
          title="Hond" 
          subtitle="Je trouwste vriend" 
          onClick={() => onPick("dog")} 
          icon="🐶" 
        />
        <SelectCard 
          title="Kat" 
          subtitle="De baas in huis" 
          onClick={() => onPick("cat")} 
          icon="🐱" 
        />
      </div>

      <div style={stepStyles.brandNote}>
        <div style={{ fontWeight: 900, marginBottom: 6, color: 'var(--text-dark)' }}>
          Othon & Friends
        </div>
        <div className="small-muted" style={{ fontSize: "13px", lineHeight: "1.5" }}>
          We werken nauw samen met dierenartsen, maar elk dier is uniek. 
          Het advies van jouw dierenarts heeft altijd voorrang.
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

  const localStyles = {
    centeredRow: {
      maxWidth: "520px",
      margin: "0 auto 24px auto",
      width: "100%"
    },
    splitRow: {
      display: "flex",
      gap: "12px", 
      alignItems: "flex-end",
      width: "100%"
    },
    selectBtn: {
      width: "100%",
      padding: "16px 20px",
      background: "var(--white)",
      border: "1.5px solid var(--border-color)",
      borderRadius: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      height: "58px" 
    },
    genderWrapper: {
      display: "flex",
      gap: "8px",
      height: "58px",
      alignItems: "center",
      width: "100%"
    }
  };

  return (
    <div style={stepStyles.wrapper} className="animate-fade-in">
      <h1 style={stepStyles.h1}>Vertel ons over je {isDog ? "hond" : "kat"}</h1>
      <p style={stepStyles.lead}>Hoe meer we weten, hoe nauwkeuriger de berekening</p>

      {/* --- 1. NAME ROW (Restored!) --- */}
      <div style={localStyles.centeredRow}>
        <label style={{ ...stepStyles.label, textAlign: 'left' }}>Naam</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center", marginTop: "8px" }}>
          <input 
            style={{ 
              width: "100%", 
              padding: "18px 120px 18px 20px", 
              borderRadius: "16px", 
              border: "1.5px solid var(--border-color)", 
              fontSize: "18px", 
              fontWeight: "600", 
              outline: "none" 
            }}
            value={state.name} 
            placeholder="Bijv. Max" 
            onChange={(e) => onChange((s) => ({ ...s, name: e.target.value }))} 
          />
          <button 
            type="button" 
            style={{ 
              position: "absolute", 
              right: "10px", 
              background: "var(--brand-orange-soft)", 
              color: "var(--brand-orange)", 
              border: "none", 
              padding: "8px 12px", 
              borderRadius: "10px", 
              fontWeight: "800", 
              fontSize: "12px", 
              cursor: "pointer" 
            }} 
            onClick={pickAIName}
          >
            ✨ Inspiratie?
          </button>
        </div>
      </div>

      {/* --- 2. BREED & GENDER ROW --- */}
      <div style={localStyles.centeredRow}>
        <div style={localStyles.splitRow}>
          <div style={{ flex: 1.6, textAlign: 'left' }}>
            <label style={stepStyles.label}>Ras</label>
            <button 
              type="button" 
              style={localStyles.selectBtn}
              onClick={() => setBreedPickerOpen(true)}
            >
              <span style={{ color: "var(--text-dark)", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {state.breed}
              </span>
              <span style={{ color: "var(--brand-orange)", fontSize: "11px", fontWeight: "800" }}>WIJZIG</span>
            </button>
          </div>

          <div style={{ flex: 1, textAlign: 'left' }}>
            <label style={stepStyles.label}>Geslacht</label>
            <div style={localStyles.genderWrapper}>
              <Pill 
                active={state.gender === "male"} 
                label={isDog ? "Reu" : "Kater"} 
                onClick={() => onChange((s) => ({ ...s, gender: "male" }))} 
                fullWidth 
              />
              <Pill 
                active={state.gender === "female"} 
                label={isDog ? "Teef" : "Poes"} 
                onClick={() => onChange((s) => ({ ...s, gender: "female" }))} 
                fullWidth 
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. WEIGHT BOX --- */}
      <div style={localStyles.centeredRow}>
        <div style={stepStyles.weightBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            
            {/* Left: Weight Stat */}
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", letterSpacing: '0.5px' }}>HUIDIG GEWICHT</div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "var(--brand-orange)" }}>
                {(state.idealWeight * (state.conditionPct / 100)).toFixed(1)} <span style={{fontSize: '18px'}}>kg</span>
              </div>
            </div>

            {/* Right: Birth Date Stat */}
            <div style={{ textAlign: 'right', flex: 1 }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", letterSpacing: '0.5px' }}>GEBOORTEDATUM</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <input 
                  type="date" 
                  value={state.birthDate} 
                  style={{
                    border: 'none', 
                    fontWeight: '800', 
                    fontSize: '17px', 
                    textAlign: 'right', 
                    outline: 'none', 
                    cursor: 'pointer', 
                    background: 'transparent', 
                    color: 'var(--text-dark)',
                    padding: 0,           // Remove default padding
                    margin: 0,            // Remove default margin
                    appearance: 'none',   // Try to remove browser styling
                    minWidth: '150px'     // Ensure enough room for the date string
                  }}
                  onChange={(e) => onChange((s) => ({ ...s, birthDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <input 
            type="range" min="70" max="140" value={state.conditionPct} 
            className="of-range"
            onChange={(e) => onChange((s) => ({ ...s, conditionPct: Number(e.target.value) }))} 
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            <span style={stepStyles.label}>Slank</span>
            <span style={stepStyles.label}>Stevig</span>
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
  // 1. Logic: Split ingredients into two groups based on the state.excluded array
  const excludedSet = new Set(state.excluded);
  const includedIngredients = INGREDIENTS.filter((i) => !excludedSet.has(i));
  const excludedIngredients = INGREDIENTS.filter((i) => excludedSet.has(i));
  
  const toggleIngredient = (ing) => {
    onChange((s) => {
      const set = new Set(s.excluded);
      if (set.has(ing)) {
        set.delete(ing); // Move back to "In de voeding"
      } else {
        set.add(ing);    // Move to "Niet in de voeding"
      }
      return { ...s, excluded: Array.from(set) };
    });
  };

  const localStyles = {
    prefGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      maxWidth: "700px", // A bit wider to fit the columns nicely
      margin: "0 auto 40px auto",
    },
    columnTitle: {
      fontSize: "13px",
      fontWeight: "800",
      color: "var(--text-dark)",
      marginBottom: "16px",
      textAlign: "center",
      lineHeight: "1.4",
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    listCard: {
      background: "var(--white)",
      borderRadius: "20px",
      border: "1.5px solid var(--border-color)",
      padding: "12px",
      minHeight: "350px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxShadow: "var(--shadow-soft)"
    },
    ingBtn: (isExcluded) => ({
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1.5px solid",
      borderColor: isExcluded ? "#fee2e2" : "#f0fdf4",
      background: isExcluded ? "#fff1f1" : "#f7fee7",
      color: isExcluded ? "#b91c1c" : "#166534",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.2s ease",
    })
  };

  return (
    <div style={stepStyles.wrapper} className="animate-fade-in">
      <h1 style={stepStyles.h1}>Voorkeuren & Allergieën</h1>
      <p style={stepStyles.lead}>Klik op een ingrediënt om het uit te sluiten of toe te voegen.</p>

      <div style={localStyles.prefGrid}>
        
        {/* --- LEFT COLUMN: INCLUDED --- */}
        <div>
          <div style={localStyles.columnTitle}>
            Deze producten zullen in de voeding zitten
          </div>
          <div style={localStyles.listCard}>
            {includedIngredients.map((ing) => (
              <button 
                key={ing} 
                type="button" 
                style={localStyles.ingBtn(false)}
                onClick={() => toggleIngredient(ing)}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
              >
                <span>{ing}</span>
                <span style={{ opacity: 0.5 }}>✕</span>
              </button>
            ))}
            {includedIngredients.length === 0 && (
              <div className="small-muted" style={{ textAlign: 'center', marginTop: '40px' }}>
                Geen ingrediënten geselecteerd.
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: EXCLUDED --- */}
        <div>
          <div style={localStyles.columnTitle}>
            Deze producten zitten niet in de voeding
          </div>
          <div style={{ ...localStyles.listCard, background: '#f8fafc' }}>
            {excludedIngredients.map((ing) => (
              <button 
                key={ing} 
                type="button" 
                style={localStyles.ingBtn(true)}
                onClick={() => toggleIngredient(ing)}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
              >
                <span style={{ opacity: 0.5 }}>+</span>
                <span>{ing}</span>
              </button>
            ))}
            {excludedIngredients.length === 0 && (
              <div className="small-muted" style={{ textAlign: 'center', marginTop: '40px', fontStyle: 'italic' }}>
                Klik links om iets uit te sluiten.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- FOOD TYPE PILLS --- */}
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <label style={stepStyles.label}>Voorkeur textuur</label>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          {["Droogvoer", "Natvoer", "Beide"].map(type => (
            <Pill 
              key={type}
              active={state.foodType === type} 
              label={type} 
              onClick={() => onChange((s) => ({ ...s, foodType: type }))} 
            />
          ))}
        </div>
      </div>
      
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

// --- STEP 5: RESULT ---
export function StepResult({ 
  state, 
  ofGramsPerDay, 
  subscriptionKgRounded, 
  subscriptionDaysActual, 
  ofCostPerDay, 
  ofCostPerMonth,
  avgCostPerMonth,
  savingsPerMonth,
  gramsLessPct,
  passportRef, 
  onReset, 
  onDownload,
  ageDisplay,
  adjustedWeightKg
}) {

  const localStyles = {
    // The main container that fills the step-card without extra borders
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1px 1fr", // The middle '1px' is our vertical divider
      gap: "40px",
      width: "100%",
      marginTop: "20px",
      alignItems: "start"
    },
    divider: {
      width: "1px",
      backgroundColor: "var(--border-color)",
      height: "100%",
      minHeight: "400px"
    },
    calculationHeader: {
      marginBottom: "32px",
      paddingBottom: "24px",
      borderBottom: "1px solid var(--border-color)"
    },
    dataRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px solid #f8fafc"
    },
    benefitBadge: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      background: "var(--brand-bg)",
      borderRadius: "12px",
      fontSize: "14px",
      color: "var(--text-dark)",
      marginBottom: "8px"
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: "100%" }} ref={passportRef}>
      <h1 style={{ ...stepStyles.h1, textAlign: 'left', marginBottom: '8px' }}>
        Voedingsplan voor {state.name}
      </h1>
      <p className="lead" style={{ textAlign: 'left', marginBottom: '40px' }}>
        Gecalculeerd op basis van ras, activiteit en conditie.
      </p>

      <div style={localStyles.mainGrid}>
        
        {/* --- LEFT SIDE: THE DATA --- */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Section: Feeding Amount */}
          <div style={localStyles.calculationHeader}>
            <div style={stepStyles.label}>Aanbevolen Dagelijkse Portie</div>
            <div style={{ fontSize: "48px", fontWeight: "900", color: "var(--brand-orange)", marginTop: "8px" }}>
              {Math.round(ofGramsPerDay)}g
            </div>
            <div style={{ fontWeight: "700", marginTop: "4px" }}>Othon & Friends Premium Brok</div>
          </div>

          {/* Middle Section: Financials */}
          <div style={{ marginBottom: "32px" }}>
            <div style={localStyles.dataRow}>
              <span className="small-muted">Order per {subscriptionDaysActual} dagen</span>
              <span style={{ fontWeight: "700" }}>{subscriptionKgRounded}kg zak</span>
            </div>
            <div style={localStyles.dataRow}>
              <span className="small-muted">Kosten per dag</span>
              <span style={{ fontWeight: "700" }}>€{ofCostPerDay?.toFixed(2)}</span>
            </div>
            <div style={{ ...localStyles.dataRow, borderBottom: 'none' }}>
              <span className="small-muted">Kosten per maand</span>
              <span style={{ fontWeight: "700", color: "var(--brand-orange)" }}>€{ofCostPerMonth?.toFixed(2)}</span>
            </div>
          </div>

          {/* Bottom Section: Pet Info (Simple list, no box) */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ ...stepStyles.label, marginBottom: '16px' }}>Profiel Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div><div style={stepStyles.label}>Ras</div><div style={{ fontWeight: '700' }}>{state.breed}</div></div>
              <div><div style={stepStyles.label}>Gewicht</div><div style={{ fontWeight: '700' }}>{adjustedWeightKg?.toFixed(1)} kg</div></div>
              <div><div style={stepStyles.label}>Leeftijd</div><div style={{ fontWeight: '700' }}>{ageDisplay}</div></div>
              <div><div style={stepStyles.label}>Conditie</div><div style={{ fontWeight: '700', color: '#2ecc71' }}>{state.bodyCond?.toUpperCase()}</div></div>
            </div>
          </div>
        </div>

        {/* --- THE VERTICAL LINE --- */}
        <div style={localStyles.divider}></div>

        {/* --- RIGHT SIDE: THE COMPARISON --- */}
        <div>
          <div style={{ ...stepStyles.label, color: 'var(--brand-orange)', marginBottom: '16px' }}>
            Besparingscheck
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <div className="small-muted" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              Ander merk <span>€{avgCostPerMonth?.toFixed(0)}</span>
            </div>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', width: '100%', marginBottom: '20px' }}>
              <div style={{ height: '100%', background: '#cbd5e1', borderRadius: '10px', width: '100%' }}></div>
            </div>

            <div className="small-muted" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', color: 'var(--brand-orange)', fontWeight: '800' }}>
              O&F Premium <span>€{ofCostPerMonth?.toFixed(0)}</span>
            </div>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', width: '100%' }}>
              <div style={{ height: '100%', background: 'var(--brand-orange)', borderRadius: '10px', width: `${(ofCostPerMonth/avgCostPerMonth)*100}%` }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800' }}>JOUW BESPARING</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#2ecc71' }}>€{savingsPerMonth?.toFixed(0)} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ maand</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={localStyles.benefitBadge}><span>✨</span> <strong>-{Math.round(gramsLessPct * 100)}%</strong> volume</div>
            <div style={localStyles.benefitBadge}><span>🌱</span> Betere vertering</div>
            <div style={localStyles.benefitBadge}><span>💎</span> Glanzende vacht</div>
          </div>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '60px', borderTop: '1.5px solid var(--border-color)', paddingTop: '32px' }}>
        <button 
          className="primary-btn" 
          style={{ flex: 1, background: 'var(--text-dark)' }} // Different color for distinction
          onClick={onDownload}
        >
          📄 Plan Downloaden
        </button>
        
        <button 
          className="primary-btn" 
          style={{ flex: 1.5 }} 
          onClick={() => onOrder(state)} // Trigger the order flow
        >
          🛍️ Bestel voor {state.name}
        </button>
      </div>
    </div>
  );
}