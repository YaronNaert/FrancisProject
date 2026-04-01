import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PetCard({ pet, isPlaceholder }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(null); // 'edit' or 'plan'

  // Common Card Styles
  const baseCardStyle = {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "28px",
    border: isHovered ? "1.5px solid #F1891A" : "1.5px solid #edf2f7",
    boxShadow: isHovered 
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)" 
      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
  };

  if (isPlaceholder) {
    const placeholderStyle = {
      ...baseCardStyle,
      border: isHovered ? "2px dashed #F1891A" : "2px dashed #ccc",
      background: isHovered ? "#fffafa" : "#fdfdfd",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "280px",
      color: isHovered ? "#F1891A" : "#888",
    };

    return (
      <div 
        style={placeholderStyle} 
        onClick={() => navigate("/calculator")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ fontSize: "48px", marginBottom: "10px", fontWeight: "300" }}>+</div>
        <span style={{ fontWeight: "700", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Voeg huisdier toe
        </span>
      </div>
    );
  }

  // Real Pet Card Styles
  const headerStyle = { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" };
  const iconStyle = {
    fontSize: "24px",
    background: "#f8fafc",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
  };
  const infoItemStyle = { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#718096", marginBottom: "8px" };
  
  const btnEditStyle = {
    background: btnHovered === 'edit' ? "#e2e8f0" : "#f1f5f9",
    color: "#475569",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const btnPlanStyle = {
    background: "#F1891A",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 14px 0 rgba(241, 137, 26, 0.39)",
    filter: btnHovered === 'plan' ? "brightness(1.1)" : "none",
    transition: "all 0.2s",
  };

  return (
    <div 
      style={baseCardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <span style={iconStyle}>{pet.petType === "dog" ? "🐶" : "🐱"}</span>
        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#1a202c", margin: 0 }}>{pet.name}</h3>
      </div>
      
      <div style={{ marginBottom: "24px" }}>
        <div style={infoItemStyle}><span>Gewicht:</span> <strong style={{color: "#2d3748"}}>{pet.idealWeight}kg</strong></div>
        <div style={infoItemStyle}><span>Ras:</span> <strong style={{color: "#2d3748"}}>{pet.breed}</strong></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
        <button 
          style={btnEditStyle} 
          onMouseEnter={() => setBtnHovered('edit')}
          onMouseLeave={() => setBtnHovered(null)}
          onClick={(e) => { e.stopPropagation(); navigate(`/calculator/${pet.id}`); }}
        >
          Gegevens wijzigen
        </button>
        <button 
          style={btnPlanStyle} 
          onMouseEnter={() => setBtnHovered('plan')}
          onMouseLeave={() => setBtnHovered(null)}
          onClick={(e) => { e.stopPropagation(); navigate(`/calculator/${pet.id}`); }}
        >
          Voedingsplan →
        </button>
      </div>
    </div>
  );
}