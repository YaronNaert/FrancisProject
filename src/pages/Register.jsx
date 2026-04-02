import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRow } from "../components/UIComponents";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // Retrieve the pet data we saved in Step 5
  const pendingPet = JSON.parse(localStorage.getItem("pending_pet_data"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Here you will call your lightspeedApi.createCustomerWithPet
    console.log("Registering User:", formData);
    console.log("Attaching Pet:", pendingPet);

    // 2. After success, we move to the checkout
    navigate("/checkout");
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "60px auto",
      padding: "40px",
      background: "white",
      borderRadius: "32px",
      border: "1px solid var(--border-color)",
      boxShadow: "var(--shadow-soft)",
      textAlign: "center"
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "20px"
    },
    input: {
      width: "100%",
      padding: "16px",
      borderRadius: "14px",
      border: "1.5px solid var(--border-color)",
      fontSize: "16px",
      marginTop: "8px",
      outline: "none"
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>👋</div>
      <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "8px" }}>
        Bijna klaar!
      </h1>
      <p className="small-muted" style={{ marginBottom: "32px" }}>
        Maak een account om het voedingsplan van <strong>{pendingPet?.name || "je huisdier"}</strong> op te slaan en je eerste bestelling te plaatsen.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={{ fontWeight: "800", fontSize: "12px", color: "var(--text-muted)" }}>VOORNAAM</label>
            <input 
              style={styles.input} name="firstname" placeholder="John" 
              required onChange={handleChange} 
            />
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={{ fontWeight: "800", fontSize: "12px", color: "var(--text-muted)" }}>ACHTERNAAM</label>
            <input 
              style={styles.input} name="lastname" placeholder="Doe" 
              required onChange={handleChange} 
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={{ fontWeight: "800", fontSize: "12px", color: "var(--text-muted)" }}>E-MAILADRES</label>
          <input 
            type="email" style={styles.input} name="email" placeholder="john@example.com" 
            required onChange={handleChange} 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={{ fontWeight: "800", fontSize: "12px", color: "var(--text-muted)" }}>WACHTWOORD</label>
          <input 
            type="password" style={styles.input} name="password" placeholder="••••••••" 
            required onChange={handleChange} 
          />
        </div>

        <button 
          type="submit" 
          className="primary-btn" 
          style={{ width: "100%", marginTop: "20px", padding: "20px" }}
        >
          Account aanmaken & Bestellen
        </button>
      </form>

      <button 
        onClick={() => navigate(-1)} 
        style={{ background: "none", border: "none", color: "var(--text-muted)", marginTop: "24px", cursor: "pointer", fontWeight: "700" }}
      >
        Terug naar resultaten
      </button>
    </div>
  );
}