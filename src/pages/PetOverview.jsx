import React from "react";
import { useNavigate } from "react-router-dom";
import PetCard from "../components/PetCard";

export default function PetOverview({ pets }) {
  const navigate = useNavigate();

  const styles = {
    pageWrapper: {
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "0 20px",
    },
    overviewHeader: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      marginBottom: "40px",
      gap: "20px",
    },
    h1: {
      fontSize: "34px",
      fontWeight: "900",
      margin: 0,
      gridColumn: "2",
      textAlign: "center",
      color: "#2d3436",
    },
    headerSpacer: {
      width: "160px", // Balances the "New Pet" button width if there was one
      visibility: "hidden",
    },
    petGrid: {
      display: "grid",
      // This creates the responsive grid: 
      // It will fit as many cards as possible (min 300px wide)
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "24px",
      padding: "20px 0",
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overviewHeader}>
        {/* Invisible div to balance the grid columns for centering */}
        <div style={styles.headerSpacer}></div>
        
        <h1 style={styles.h1}>Mijn Roedel</h1>

        {/* Keeping a spacer on the right so the title stays centered */}
        <div style={styles.headerSpacer}></div>
      </div>

      <div style={styles.petGrid}>
        {/* 1. Map through existing pets */}
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}

        {/* 2. The dedicated "Add New" placeholder card */}
        <PetCard isPlaceholder={true} />
      </div>
    </div>
  );
}