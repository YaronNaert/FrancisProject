import React, { useState, useEffect, useMemo } from "react";
import { STEPS, BRAND } from "../data";
import { format } from "../utils";

export function Header({ step, maxStep, onStepClick, variant }) {
  const [selectedLang, setSelectedLang] = useState("NL");
  const pct = (step / 5) * 100;
  const langs = ["NL", "FR", "EN"];

  // VARIANT 1: Site Header (Language only)
  if (variant === "lang-only") {
    return (
      <div className="lang-row">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            className={selectedLang === l ? "lang-pill" : "lang-pill-muted"}
            onClick={() => setSelectedLang(l)}
          >
            {l}
          </button>
        ))}
      </div>
    );
  }

  // VARIANT 2: Content Area (Progress & Steps)
  return (
    <div className="progress-container">
      {/* Progress Bar Track */}
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Step Navigation Row */}
      <div className="step-row">
        {STEPS.map((s, idx) => {
          const n = idx + 1;
          const isActive = n === step;
          const isDone = n < step;
          const isReachable = n <= maxStep;

          return (
            <button
              key={s.key}
              type="button"
              disabled={!isReachable}
              onClick={() => isReachable && onStepClick(n)}
              className={`step-chip 
                ${isActive ? "active" : ""} 
                ${isDone ? "done" : ""} 
                ${isReachable ? "clickable" : ""}`
              }
            >
              <span className="step-number">{n}</span>
              <span className="step-label">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SelectCard({ title, subtitle, icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="select-card">
      <div className="select-icon">{icon}</div>
      <div className="select-content"> 
        {/* We put the chevron right here inside the title span */}
        <div className="select-title">
          {title} 
        </div>
        <div className="select-sub">{subtitle}</div>
      </div>
    </button>
  );
}

export function SelectableBox({ title, subtitle, active, onClick }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className={`selectable-box ${active ? "active" : ""}`}
    >
      <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
      {!!subtitle && <div className="small-muted">{subtitle}</div>}
    </button>
  );
}

export function Pill({ active, label, onClick }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className={`pill ${active ? "active" : ""}`}
    >
      {label}
    </button>
  );
}

export function Toggle({ on, setOn }) {
  return (
    <button 
      type="button" 
      onClick={() => setOn(!on)} 
      className={`toggle ${on ? "on" : ""}`}
    >
      <span className={`toggle-knob ${on ? "on" : ""}`} />
      <span style={{ fontWeight: 800, marginLeft: 10 }}>
        {on ? "Ja" : "Nee"}
      </span>
    </button>
  );
}

export function InfoCard({ title, text }) {
  return (
    <div className="info-card">
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <div className="small-muted">{text}</div>
    </div>
  );
}

export function NavRow({ onBack, onNext }) {
  return (
    <div className="nav-row">
      <button type="button" className="back-link" onClick={onBack}>
        TERUG
      </button>
      <button type="button" className="primary-btn" onClick={onNext}>
        VOLGENDE
      </button>
    </div>
  );
}
export function BreedPicker({ open, breeds, gender, onPick, onClose }) {
  const [q, setQ] = useState("");

  if (!open) return null;

  const filtered = breeds.filter(b => 
    b.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: '20px' }}>Kies een ras</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <input 
          className="input-field" 
          placeholder="Zoek ras..." 
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        <div className="modal-list">
          {filtered.map((b) => (
            <button 
              key={b.name} 
              className="modal-item" 
              onClick={() => { onPick(b.name); setQ(""); }}
            >
              <span style={{ fontWeight: 700 }}>{b.name}</span>
              <span className="modal-weight">
                {gender === "male" ? b.male : b.female} kg
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StyleTag() {
  return (
    <style>{`
      .of-range{
        -webkit-appearance:none;
        width:100%;
        height:12px;
        border-radius:999px;
        background: rgba(144,192,232,.35);
        outline:none;
      }
      .of-range::-webkit-slider-thumb{
        -webkit-appearance:none;
        appearance:none;
        width:28px;
        height:28px;
        border-radius:50%;
        background:${BRAND.orange};
        box-shadow: 0 8px 18px rgba(241,137,26,.35);
        cursor:pointer;
        border: 3px solid white;
      }
      .of-range::-moz-range-thumb{
        width:28px;
        height:28px;
        border-radius:50%;
        background:${BRAND.orange};
        box-shadow: 0 8px 18px rgba(241,137,26,.35);
        cursor:pointer;
        border: 3px solid white;
      }
    `}</style>
  );
}