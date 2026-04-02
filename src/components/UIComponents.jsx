import React, { useState } from "react";
import { STEPS, BRAND } from "../data";

// --- 1. HEADER & PROGRESS ---
export function Header({ step, maxStep, onStepClick, variant }) {
  const [selectedLang, setSelectedLang] = useState("NL");
  const langs = ["NL", "FR", "EN"];
  const pct = (step / 5) * 100;

  // These labels match the 5 steps in your NutritionCalculator
  const stepLabels = ["Type", "Info", "Activiteit", "Voorkeuren", "Resultaat"];

  const styles = {
    progressWrapper: {
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    track: {
      width: "100%",
      height: "6px",
      backgroundColor: "#e2e8f0",
      borderRadius: "10px",
      overflow: "hidden",
    },
    bar: {
      width: `${pct}%`,
      height: "100%",
      backgroundColor: "var(--brand-orange)",
      transition: "width 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
      borderRadius: "10px"
    },
    stepRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      padding: "0 10px"
    },
    stepChip: (isActive, isReachable) => ({
      background: "none",
      border: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      cursor: isReachable ? "pointer" : "default",
      opacity: isReachable ? 1 : 0.3,
      transition: "all 0.3s ease",
      flex: 1
    }),
    stepNumber: (isActive) => ({
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: isActive ? "var(--brand-orange)" : "#e2e8f0",
      color: isActive ? "white" : "var(--text-muted)",
      fontSize: "12px",
      fontWeight: "800",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease"
    }),
    stepLabel: (isActive) => ({
      fontSize: "11px",
      fontWeight: "700",
      color: isActive ? "var(--brand-orange)" : "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    })
  };

  if (variant === "lang-only") {
    return (
      <div style={{ display: "flex", gap: "8px", background: "#f1f5f9", padding: "4px", borderRadius: "12px" }}>
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setSelectedLang(l)}
            style={{
              padding: "6px 12px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
              border: "none",
              backgroundColor: selectedLang === l ? "white" : "transparent",
              color: selectedLang === l ? "var(--brand-orange)" : "var(--text-muted)",
              boxShadow: selectedLang === l ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.progressWrapper} className="animate-fade-in">
      {/* 1. The Visual Progress Bar */}
      <div style={styles.track}>
        <div style={styles.bar} />
      </div>

      {/* 2. The Interactive Step Labels */}
      <div style={styles.stepRow}>
        {stepLabels.map((label, idx) => {
          const n = idx + 1;
          const isActive = n === step;
          const isReachable = n <= maxStep;

          return (
            <button
              key={label}
              type="button"
              disabled={!isReachable}
              onClick={() => isReachable && onStepClick(n)}
              style={styles.stepChip(isActive, isReachable)}
            >
              <div style={styles.stepNumber(isActive)}>{n}</div>
              <span style={styles.stepLabel(isActive)}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- 2. CARDS & SELECTION ---
export function SelectCard({ title, subtitle, icon, onClick, active }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: "var(--white)",
    padding: "32px 24px",
    borderRadius: "24px",
    border: isHovered || active ? "2px solid var(--brand-orange)" : "2px solid var(--border-color)",
    boxShadow: isHovered ? "0 12px 20px rgba(0,0,0,0.08)" : "var(--shadow-soft)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "12px",
    width: "100%",
  };

  return (
    <div 
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontSize: "48px", transition: "transform 0.3s ease", transform: isHovered ? "scale(1.1)" : "scale(1)" }}>{icon}</span>
      <div>
        <h3 className="h3" style={{ margin: "0 0 4px 0", color: "var(--text-dark)" }}>{title}</h3>
        <p className="small-muted" style={{ margin: 0, lineHeight: "1.4" }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function SelectableBox({ title, subtitle, active, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const boxStyle = {
    width: "100%",
    padding: "24px",
    textAlign: "left",
    borderRadius: "20px",
    border: active || isHovered ? "2px solid var(--brand-orange)" : "2px solid var(--border-color)",
    background: active ? "var(--brand-orange-soft)" : "var(--white)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  };

  return (
    <button 
      type="button" 
      onClick={onClick} 
      style={boxStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontWeight: 900, fontSize: "16px", color: "var(--text-dark)" }}>{title}</div>
      {!!subtitle && <div className="small-muted">{subtitle}</div>}
    </button>
  );
}

// --- 3. INPUTS & NAVIGATION ---
export function Toggle({ on, setOn }) {
  return (
    <button 
      type="button" 
      onClick={() => setOn(!on)} 
      style={{
        display: "flex",
        alignItems: "center",
        background: on ? "var(--brand-orange)" : "#e2e8f0",
        border: "none",
        padding: "8px 16px",
        borderRadius: "999px",
        cursor: "pointer",
        transition: "background 0.3s ease"
      }}
    >
      <div style={{
        width: "20px",
        height: "20px",
        background: "white",
        borderRadius: "50%",
        transform: on ? "translateX(0)" : "translateX(-4px)",
        transition: "transform 0.2s ease"
      }} />
      <span style={{ fontWeight: 800, marginLeft: 10, color: on ? "white" : "var(--text-muted)" }}>
        {on ? "Ja" : "Nee"}
      </span>
    </button>
  );
}

export function NavRow({ onBack, onNext }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
      <button 
        type="button" 
        style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: "800", letterSpacing: "1px", cursor: "pointer" }} 
        onClick={onBack}
      >
        TERUG
      </button>
      <button type="button" className="primary-btn" onClick={onNext}>
        VOLGENDE
      </button>
    </div>
  );
}

// Inside UIComponents.jsx
export function Pill({ active, label, onClick, fullWidth }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      style={{
        flex: fullWidth ? 1 : "initial", // This is the secret sauce
        padding: "10px 12px",
        borderRadius: "12px",
        border: active ? "2px solid var(--brand-orange)" : "1.5px solid var(--border-color)",
        background: active ? "white" : "transparent",
        color: active ? "var(--brand-orange)" : "var(--text-muted)",
        fontWeight: "800",
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        textAlign: "center"
      }}
    >
      {label}
    </button>
  );
}

// --- 4. MODALS & TOOLS ---
export function BreedPicker({ open, breeds, gender, onPick, onClose }) {
  const [q, setQ] = useState("");
  if (!open) return null;

  const filtered = breeds.filter(b => b.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="h3">Kies een ras</h2>
          <button style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px' }}>
          <input className="input-field" placeholder="Zoek ras..." value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
            {filtered.map((b) => (
              <button 
                key={b.name} 
                style={{ width: '100%', padding: '15px', border: 'none', background: 'none', textAlign: 'left', borderBottom: '1px solid #f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} 
                onClick={() => { onPick(b.name); setQ(""); }}
              >
                <span style={{ fontWeight: 700 }}>{b.name}</span>
                <span className="small-muted">{gender === "male" ? b.male : b.female} kg</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StyleTag() {
  return (
    <style>{`
      .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .of-range { -webkit-appearance:none; width:100%; height:8px; border-radius:999px; background: #e2e8f0; outline:none; }
      .of-range::-webkit-slider-thumb { -webkit-appearance:none; width:24px; height:24px; border-radius:50%; background: var(--brand-orange); cursor:pointer; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    `}</style>
  );
}