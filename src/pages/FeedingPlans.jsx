import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedingPlans({ pets }) {
  // 1. Default to the first pet in your list
  const [activePetId, setActivePetId] = useState(pets[0]?.id);
  const navigate = useNavigate();

  // 2. Find the full data for the selected pet
  const selectedPet = pets.find(p => p.id === activePetId);

  return (
    <div className="page-wrapper">
      <h1 className="h1" style={{ textAlign: 'center', marginBottom: '30px' }}>
        Voedingsplannen
      </h1>

      {/* --- CAROUSEL SECTION --- */}
      <div className="pet-carousel">
        {pets.map((pet) => (
          <div 
            key={pet.id} 
            className={`carousel-item ${activePetId === pet.id ? "active" : ""}`}
            onClick={() => setActivePetId(pet.id)}
          >
            <div className="avatar-circle">
              {/* Replace with <img src={pet.image} /> when you have real photos */}
              <span>{pet.name.charAt(0)}</span>
            </div>
            <span className="carousel-name">{pet.name}</span>
          </div>
        ))}
      </div>

      {/* --- DYNAMIC CONTENT SECTION --- */}
      {selectedPet ? (
        <div className="active-plan-container">
          <div className="plan-card-large">
            <div className="plan-card-header">
              <h2>Voedingsplan voor {selectedPet.name}</h2>
              <button className="btn-edit" onClick={() => navigate(`/calculator/${selectedPet.id}`)}>
                Plan Wijzigen
              </button>
            </div>

            <div className="plan-details-grid">
              <div className="plan-stat">
                <label>Dagelijkse Hoeveelheid</label>
                <div className="value">{Math.round(selectedPet.idealWeight * 25)}g</div>
              </div>
              <div className="plan-stat">
                <label>Huidig Gewicht</label>
                <div className="value">{selectedPet.idealWeight} kg</div>
              </div>
              <div className="plan-stat">
                <label>Type Voeding</label>
                <div className="value">Kibble + Vers</div>
              </div>
            </div>
            
            <div className="feeding-instructions">
              <h3>Voedingsadvies</h3>
              <p>Verdeel de {Math.round(selectedPet.idealWeight * 25)}g over twee maaltijden per dag (ochtend en avond).</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Selecteer een huisdier om het plan te zien.</p>
      )}
    </div>
  );
}