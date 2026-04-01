import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { orderId } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <button className="btn-secondary-outline" onClick={() => navigate("/orders")}>
        ← Terug naar overzicht
      </button>

      <div className="order-details-card" style={{ marginTop: '20px' }}>
        <h1 className="h1">Bestelling {orderId}</h1>
        <p className="lead">Hieronder vind je de details van je bestelling.</p>
        
        <div className="details-placeholder" style={{ 
          padding: '40px', 
          border: '2px dashed #ccc', 
          borderRadius: '20px',
          textAlign: 'center' 
        }}>
          {/* Later we will map the actual products here */}
          <p>Producten voor {orderId} laden...</p>
        </div>
      </div>
    </div>
  );
}