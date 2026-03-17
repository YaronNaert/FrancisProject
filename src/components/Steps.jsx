import React, { useState, useEffect, useMemo } from "react"; // Make sure these are here!
import { Header, SelectCard, SelectableBox, Pill, Toggle, InfoCard, NavRow, BreedPicker } from "./UIComponents";
import { DOG_NAMES, CAT_NAMES, ACTIVITY_LEVELS, BODY_CONDITION, TREATS, INGREDIENTS, SENSITIVE, SUBSCRIPTION_OPTIONS, BRAND } from "../data";
import { format, clamp } from "../utils";

export function StepType({ onPick }) {
  return (
    <div className="step-wrapper">
      {/* Main Content Group */}
      <div className="step-main-content">
        <h1 className="h1">Voedingscalculator</h1>
        <p className="lead">Ontdek hoeveel voeding je huisdier nodig heeft</p>

        <h2 className="h2">Welk huisdier heb je?</h2>
        <p className="muted">Kies het type huisdier waarvoor je de voeding wilt berekenen</p>

        <div className="grid-2">
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
      </div>

      {/* Vet Note Group (Pushed to bottom) */}
      <div className="brand-note">
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Othon & Friends</div>
        <div className="small">
          We werken nauw samen met dierenartsen, maar elk dier is uniek. 
          Het advies van jouw dierenarts heeft altijd voorrang.
        </div>
      </div>
    </div>
  );
}

export function StepData({ state, breeds, onChange, onBack, onNext, ageDisplay }) {
  const [breedPickerOpen, setBreedPickerOpen] = useState(false);
  const isDog = state.petType === "dog";
  const titlePet = isDog ? "hond" : "kat";
  const genderLabelMale = isDog ? "Reutje" : "Kater";
  const genderLabelFemale = isDog ? "Teefje" : "Poes";
  const shownBreed = breeds.find((b) => b.name === state.breed) || breeds[0];

  const pickAIName = () => {
    // Note: Make sure DOG_NAMES and CAT_NAMES are imported in Steps.jsx!
    const pool = isDog ? DOG_NAMES : CAT_NAMES;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    onChange((s) => ({ ...s, name: choice }));
  };

  return (
    <div className="step-wrapper">
      <h1 className="h1">Vertel ons over je {titlePet}</h1>
      <p className="lead">Hoe meer we weten, hoe nauwkeuriger de berekening:</p>

      <div className="form-grid">
        {/* Name Input */}
        <div className="field-span-9">
          <label className="label">Naam</label>
          <input 
            className="input-field" 
            value={state.name} 
            placeholder="Bijv. Max" 
            onChange={(e) => onChange((s) => ({ ...s, name: e.target.value }))} 
          />
        </div>
        
        {/* Name Generator */}
        <div className="field-span-3">
          <label className="label">&nbsp;</label>
          <button type="button" className="ghost-btn" onClick={pickAIName}>
            ✨ Geen inspiratie?
          </button>
        </div>

        {/* Breed Selector */}
        <div className="field-span-8">
          <label className="label">RAS</label>
          <button type="button" className="select-btn" onClick={() => setBreedPickerOpen(true)}>
            <span className="breed-name">{state.breed}</span>
            <span className="right-hint">
              {state.gender === "male" ? shownBreed.male : shownBreed.female} kg
            </span>
          </button>
        </div>

        {/* Gender Toggle */}
        <div className="field-span-4">
          <label className="label">Geslacht</label>
          <div className="pill-row">
            <Pill active={state.gender === "male"} label={<span className="gender-label">{genderLabelMale}</span>} onClick={() => onChange((s) => ({ ...s, gender: "male" }))} />
            <Pill active={state.gender === "female"} label={<span className="gender-label">{genderLabelFemale}</span>} onClick={() => onChange((s) => ({ ...s, gender: "female" }))} />
          </div>
        </div>

        {/* Weight / Condition Slider Box */}
        <div className="field-span-12">
          <div className="weight-box">
            <div className="weight-top">
              <div className="weight-stat">
                <div className="small-muted">Standaard (ras)</div>
                <div className="big-number">{state.gender === "male" ? shownBreed.male : shownBreed.female} kg</div>
              </div>
              
              <div className="weight-stat align-right">
                <div className="small-muted">Huidig (typbaar)</div>
                <div className="weight-input-wrapper">
                  <input 
                    type="number"
                    step="0.1"
                    className="big-number-input"
                    value={(state.idealWeight * (state.conditionPct / 100)).toFixed(1)}
                    onChange={(e) => {
                      const newWeight = parseFloat(e.target.value) || 0;
                      // Reverse calculate the percentage for the slider
                      const newPct = (newWeight / state.idealWeight) * 100;
                      // Clamp it between our new 70-140 range
                      onChange((s) => ({ ...s, conditionPct: Math.min(Math.max(newPct, 70), 140) }));
                    }}
                  />
                  <span className="unit-label">kg</span>
                </div>
              </div>
            </div>
            
            <div className="slider-row">
              <span className="slider-label">SLANK</span>
              <input 
                type="range" 
                min="70"  /* 20% Wider range */
                max="140" /* 20% Wider range */
                value={state.conditionPct} 
                onChange={(e) => onChange((s) => ({ ...s, conditionPct: Number(e.target.value) }))} 
                className="of-range" 
              />
              <span className="slider-label">STEVIG</span>
            </div>

            {/* Age Selection Section */}
            <div className="field-span-12 age-section-outer">
              <div className="weight-box">
                <div className="weight-top age-top">
                  
                  {/* Left: Birth Date Input */}
                  <div className="weight-stat age-stat-left">
                    <label className="label-tiny">Geboortedatum</label>
                    <div className="weight-input-wrapper">
                      <input 
                        type="date" 
                        className="date-input-field"
                        value={state.birthDate}
                        onChange={(e) => onChange((s) => ({ ...s, birthDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Right: Calculated Age (Smaller) */}
                  <div className="weight-stat align-right">
                    <div className="label-tiny">Leeftijd</div>
                    <div className="age-display-text">
                      {ageDisplay}
                    </div>
                  </div>
                </div>

                <p className="age-note">
                  Honden jonger dan 1 jaar hebben een specifieke puppy-formule nodig voor een gezonde groei.
                </p>
              </div>
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
          onChange((s) => ({ ...s, breed: breedName, idealWeight: state.gender === "male" ? b.male : b.female }));
          setBreedPickerOpen(false);
        }} 
      />
      
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

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
    <div className="step-wrapper">
      <h1 className="h1">Hoe actief is je {titlePet}?</h1>
      <p className="lead">We hebben de conditie van {state.name} alvast berekend.</p>

      <div className="grid-2">
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

      <div className="options-container">
        {/* Lichaamsconditie Card */}
        <div className="option-item">
          <div className="section-title">Lichaamsconditie (Berekend)</div>
          <div className="status-card" style={{ borderLeftColor: current.color }}>
            <div className="status-header">
              <span className="status-dot" style={{ backgroundColor: current.color }} />
              <span className="status-label">{current.label}</span>
              <span className="status-badge">Automatisch</span>
            </div>
            <p className="small-muted">
              Berekend op basis van het huidige gewicht t.o.v. het rasgemiddelde.
            </p>
          </div>
        </div>

        <div className="option-item">
          <div className="section-title">Gecastreerd / Gesteriliseerd</div>
          <Toggle on={state.neutered} setOn={(v) => onChange((s) => ({ ...s, neutered: v }))} />
        </div>

        {/* NEW: Treats Section */}
        <div className="option-item">
          <div className="section-title">Tussendoortjes / Snacks</div>
          <div className="pill-row">
            <Pill 
              active={state.treats === "no"} 
              label="Geen / Weinig" 
              onClick={() => onChange((s) => ({ ...s, treats: "no" }))} 
            />
            <Pill 
              active={state.treats === "yes"} 
              label="Regelmatig / Veel" 
              onClick={() => onChange((s) => ({ ...s, treats: "yes" }))} 
            />
          </div>
          <p className="treat-note">
            Bij veel snacks passen we de hoofdmaaltijd aan om overgewicht te voorkomen.
          </p>
        </div>

        {/* Neutered Toggle */}
        
      </div>

      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

export function StepPrefs({ state, onChange, onBack, onNext }) {
  const excludedSet = new Set(state.excluded);
  const left = INGREDIENTS.filter((i) => !excludedSet.has(i));
  
  const toggleExclude = (ing) => {
    onChange((s) => {
      const set = new Set(s.excluded);
      if (set.has(ing)) set.delete(ing); else set.add(ing);
      return { ...s, excluded: Array.from(set) };
    });
  };

  return (
    <div className="step-wrapper">
      <h1 className="h1">Aanvullende voorkeuren</h1>
      <p className="lead">Geef aan of {state.name || "je huisdier"} allergieën heeft of bepaalde ingrediënten liever vermijdt.</p>

      <div className="pref-grid">
        {/* Left Column: What's included */}
        <div className="pref-col">
          <div className="pref-head">
            <div className="pref-title">Geselecteerde ingrediënten</div>
          </div>
          <div className="pref-list">
            {left.length > 0 ? (
              left.map((ing) => (
                <div key={ing} className="pref-item">
                  <span className="heart">♥</span>
                  <span className="pref-text">{ing}</span>
                </div>
              ))
            ) : (
              <div className="small-muted" style={{ padding: '20px' }}>Geen ingrediënten over...</div>
            )}
          </div>
        </div>

        {/* Right Column: Allergies Toggles */}
        <div className="pref-col">
          <div className="pref-head">
            <div className="pref-title">Tik om uit te sluiten</div>
          </div>
          <div className="pref-list grid-toggles">
            {INGREDIENTS.map((ing) => (
              <button 
                key={ing} 
                type="button" 
                onClick={() => toggleExclude(ing)} 
                className={`allergy-btn ${excludedSet.has(ing) ? "active" : ""}`}
              >
                <span className="dot"></span>
                <span className="btn-text">{ing}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Food Type Selection Section */}
      <div className="food-type-section">
        <div className="section-title">Wat voor voeding krijgt {state.name || "je huisdier"}?</div>
        <div className="pill-row">
          <Pill 
            active={state.foodType === "Droogvoer"} 
            label="Droge voeding" 
            onClick={() => onChange((s) => ({ ...s, foodType: "Droogvoer" }))} 
          />
          <Pill 
            active={state.foodType === "Natvoer"} 
            label="Natte voeding" 
            onClick={() => onChange((s) => ({ ...s, foodType: "Natvoer" }))} 
          />
          <Pill 
            active={state.foodType === "Beide"} 
            label="Beide" 
            onClick={() => onChange((s) => ({ ...s, foodType: "Beide" }))} 
          />
        </div>
        <p className="small-muted" style={{ marginTop: '12px', textAlign: 'center' }}>
          Dit helpt ons bij het bepalen van de ideale textuur en samenstelling.
        </p>
      </div>
      
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

export function StepResult({ state, ofGramsPerDay, subscriptionKgRounded, bagsNeeded, subscriptionDaysActual, orderCostOF, passportRef, onReset, onDownload, ageDisplay, adjustedWeightKg, preferredIngredients, avgBrandGramsPerDay, ofCostPerDay, avgCostPerDay, ofCostPerMonth, avgCostPerMonth, gramsLessPct, savingsPerMonth }) {
  
  // Logic for feeding frequency
  const feedingFreq = useMemo(() => {
    if (state.petType === 'dog') {
      if (state.ageYears < 0.5) return "3 - 4 keer"; // Puppies
      return "2 keer"; // Adult dogs
    }
    return "2 - 3 keer"; // Cats
  }, [state.petType, state.ageYears]);

  return (
    <div className="step-wrapper">
      <h1 className="h1">Voedingsplan voor {state.name || "je huisdier"}</h1>
      <p className="lead">Gecalculeerd op basis van ras, activiteit en conditie.</p>

      <div className="result-grid-layout">
        
        {/* LEFT COLUMN: THE UNIFIED PASSPORT */}
        <div className="unified-result-card" ref={passportRef}>
          <div className="result-hero-header">
            <div className="hero-top-row">
              <div className="hero-section">
                <div className="hero-label">Dagelijkse Portie</div>
                <div className="hero-value">{Math.round(ofGramsPerDay)}g</div>
                <div className="hero-sub">O&F Premium</div>
              </div>
              <div className="hero-divider"></div>
              <div className="hero-section">
                <div className="hero-label">Ideale Bestelling</div>
                <div className="hero-value">{subscriptionKgRounded}kg</div>
                <div className="hero-sub">Per {subscriptionDaysActual} dagen</div>
              </div>
            </div>

            <div className="hero-footer-details">
              <div className="footer-item">
                <span className="footer-label">Aantal zakken</span>
                <strong className="footer-value">{bagsNeeded} zakken</strong>
              </div>
              <div className="footer-item">
                <span className="footer-label">Kosten per dag</span>
                <strong className="footer-value">€{ofCostPerDay?.toFixed(2)}</strong>
              </div>
              <div className="footer-item">
                <span className="footer-label">Voedingsmomenten</span>
                <strong className="footer-value">{feedingFreq} per dag</strong>
              </div>
            </div>
          </div>

          <div className="passport-body-section">
            <div className="passport-header">
              <div className="passport-title-group">
                <span className="passport-emoji">{state.petType === 'dog' ? '🐶' : '🐱'}</span>
                <div>
                  <div className="passport-name">{state.name || "Huisdier"}</div>
                  <div className="passport-tag">O&F Gecertificeerd Paspoort</div>
                </div>
              </div>
              <div className="passport-date">{new Date().toLocaleDateString('nl-BE')}</div>
            </div>

            <div className="passport-grid">
              <div className="p-item"><label>Ras</label><strong>{state.breed}</strong></div>
              <div className="p-item"><label>Leeftijd</label><strong>{ageDisplay}</strong></div>
              <div className="p-item"><label>Gewicht</label><strong>{adjustedWeightKg?.toFixed(1)} kg</strong></div>
              <div className="p-item"><label>Status</label><strong>{state.bodyCond?.toUpperCase()}</strong></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE COMPARISON CARD */}
        <div className="comparison-card">
          <div className="comp-header">
            <h3>Slimmer & Voordeliger</h3>
            <div className="savings-badge">-{Math.round(gramsLessPct * 100)}% volume</div>
          </div>
          
          <div className="comp-body">
            <div className="comp-row">
              <div className="comp-label">Maandelijkse kosten</div>
              <div className="comp-bars">
                <div className="bar-label">Andere merken: <span>€{avgCostPerMonth.toFixed(0)}</span></div>
                <div className="bar-track"><div className="bar-fill other" style={{width: '100%'}}></div></div>
                
                <div className="bar-label">O&F Premium: <span>€{ofCostPerMonth.toFixed(0)}</span></div>
                <div className="bar-track"><div className="bar-fill othon" style={{width: `${(ofCostPerMonth/avgCostPerMonth)*100}%`}}></div></div>
              </div>
            </div>

            <div className="savings-hero">
              <div className="savings-title">Jouw besparing</div>
              <div className="savings-amount">€{savingsPerMonth?.toFixed(0)}</div>
              <div className="savings-sub">per maand</div>
            </div>

            <div className="benefits-grid">
              <div className="benefit-chip">
                <span className="chip-icon">✨</span>
                <span className="chip-text">Hoogwaardige ingrediënten</span>
              </div>
              <div className="benefit-chip">
                <span className="chip-icon">🌱</span>
                <span className="chip-text">Minder ontlasting</span>
              </div>
              <div className="benefit-chip">
                <span className="chip-icon">💎</span>
                <span className="chip-text">Glanzende vacht</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-row result-actions">
        <button className="primary-btn" onClick={onDownload}>📄 Download Voedingsplan</button>
        <button className="btn-secondary-outline" onClick={onReset} style={{ width: '100%' }}>🔄 Nieuwe berekening</button>
      </div>
    </div>
  );
}