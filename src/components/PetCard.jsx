import { useNavigate } from "react-router-dom";

export default function PetCard({ pet, isPlaceholder }) {
  const navigate = useNavigate();

  if (isPlaceholder) {
    return (
      <div className="pet-card placeholder" onClick={() => navigate("/calculator")}>
        <div className="add-icon">+</div>
        <span>Voeg huisdier toe</span>
      </div>
    );
  }

  return (
    <div className="pet-card">
      <div className="pet-card-header">
        <span className="pet-type-icon">{pet.petType === "dog" ? "🐶" : "🐱"}</span>
        <h3>{pet.name}</h3>
      </div>
      
      <div className="pet-info-list">
        <div className="info-item"><span>Gewicht:</span> <strong>{pet.idealWeight}kg</strong></div>
        <div className="info-item"><span>Ras:</span> <strong>{pet.breed}</strong></div>
      </div>

      <div className="pet-card-actions">
        <button className="btn-edit" onClick={() => navigate(`/calculator/${pet.id}`)}>
          Gegevens wijzigen
        </button>
        <button className="btn-plan" onClick={() => navigate(`/calculator/${pet.id}`)}>
          Voedingsplan →
        </button>
      </div>
    </div>
  );
}