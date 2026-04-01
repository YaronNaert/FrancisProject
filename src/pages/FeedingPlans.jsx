import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedingPlans({ pets }) {
  const [activePetId, setActivePetId] = useState(pets[0]?.id);
  const [hoveredPetId, setHoveredPetId] = useState(null);
  const navigate = useNavigate();

  const selectedPet = pets.find((p) => p.id === activePetId);

  // Inject animation keyframes for the fade-in effect
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const styles = {
    pageWrapper: {
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "0 20px",
    },
    carouselContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      marginBottom: "50px",
      overflowX: "auto",
      padding: "10px 0",
    },
    planCardLarge: {
      background: "white",
      borderRadius: "32px",
      padding: "40px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      animation: "fadeIn 0.4s ease-out",
    },
    planDetailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      margin: "30px 0",
      backgroundColor: "#f8fafc",
      padding: "25px",
      borderRadius: "24px",
    },
    statLabel: {
      display: "block",
      fontSize: "12px",
      color: "#636e72",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "5px",
    },
    statValue: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#F1891A",
    },
    btnEdit: {
      background: "#f1f5f9",
      color: "#475569",
      border: "none",
      padding: "10px 20px",
      borderRadius: "12px",
      fontWeight: "700",
      cursor: "pointer",
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={{ fontSize: "34px", fontWeight: "900", textAlign: 'center', marginBottom: '30px', color: '#2d3436' }}>
        Voedingsplannen
      </h1>

      {/* --- CAROUSEL SECTION --- */}
      <div style={styles.carouselContainer}>
        {pets.map((pet) => {
          const isActive = activePetId === pet.id;
          const isHovered = hoveredPetId === pet.id;

          const itemStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            opacity: isActive || isHovered ? 1 : 0.6,
            transform: isActive ? "scale(1.1)" : "scale(1)",
          };

          const avatarStyle = {
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            background: "white",
            border: isActive ? "3px solid #F1891A" : "3px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "900",
            color: "#F1891A",
            marginBottom: "12px",
            transition: "all 0.3s ease",
            boxShadow: isActive ? "0 0 20px rgba(241, 137, 26, 0.2)" : "0 10px 30px rgba(0, 0, 0, 0.05)",
          };

          return (
            <div 
              key={pet.id} 
              style={itemStyle}
              onClick={() => setActivePetId(pet.id)}
              onMouseEnter={() => setHoveredPetId(pet.id)}
              onMouseLeave={() => setHoveredPetId(null)}
            >
              <div style={avatarStyle}>
                <span>{pet.name.charAt(0)}</span>
              </div>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>{pet.name}</span>
            </div>
          );
        })}
      </div>

      {/* --- DYNAMIC CONTENT SECTION --- */}
      {selectedPet ? (
        <div style={styles.planCardLarge}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Voedingsplan voor {selectedPet.name}</h2>
            <button 
              style={styles.btnEdit} 
              onClick={() => navigate(`/calculator/${selectedPet.id}`)}
              onMouseOver={(e) => e.target.style.background = "#e2e8f0"}
              onMouseOut={(e) => e.target.style.background = "#f1f5f9"}
            >
              Plan Wijzigen
            </button>
          </div>

          <div style={styles.planDetailsGrid}>
            <div className="plan-stat">
              <label style={styles.statLabel}>Dagelijkse Hoeveelheid</label>
              <div style={styles.statValue}>{Math.round(selectedPet.idealWeight * 25)}g</div>
            </div>
            <div className="plan-stat">
              <label style={styles.statLabel}>Huidig Gewicht</label>
              <div style={styles.statValue}>{selectedPet.idealWeight} kg</div>
            </div>
            <div className="plan-stat">
              <label style={styles.statLabel}>Type Voeding</label>
              <div style={styles.statValue}>Kibble + Vers</div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Voedingsadvies</h3>
            <p style={{ color: '#636e72', lineHeight: '1.6' }}>
              Verdeel de {Math.round(selectedPet.idealWeight * 25)}g over twee maaltijden per dag (ochtend en avond). 
              Zorg altijd voor vers drinkwater.
            </p>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#636e72' }}>Selecteer een huisdier om het plan te zien.</p>
      )}
    </div>
  );
}