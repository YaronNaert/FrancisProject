import { useNavigate } from "react-router-dom";

export function PetOverview({ pets }) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="overview-header">
        <h1 className="h1">Mijn Roedel</h1>
        <button className="primary-btn" onClick={() => navigate("/calculator")}>
          ✨ Nieuw Huisdier
        </button>
      </div>

      <div className="pet-grid">
        {pets.map(pet => (
          <div 
            key={pet.id} 
            className="pet-card" 
            onClick={() => navigate(`/calculator/${pet.id}`)}
          >
            {/* Card Content... */}
            <div className="pet-card-info">
              <h3>{pet.name}</h3>
              <p className="small-muted">{pet.breed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}