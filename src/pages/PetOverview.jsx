import React from "react";
import { useNavigate } from "react-router-dom";
import PetCard from "../components/PetCard"; // Make sure the path is correct!

export default function PetOverview({ pets }) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="overview-header">
        {/* Invisible div to balance the grid columns for centering */}
        <div className="header-spacer"></div>
        
        <h1 className="h1">Mijn Roedel</h1>
        
        {/* We keep the button just in case, but the card is the main star now */}
        <button className="primary-btn" onClick={() => navigate("/calculator")}>
          ✨ Nieuw Huisdier
        </button>
      </div>

      <div className="pet-grid">
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