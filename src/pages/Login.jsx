import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Real API logic goes here later
    setIsLoggedIn(true);
    navigate("/"); 
  };

  const loginStyles = {
    card: {
      maxWidth: "420px",
      margin: "80px auto",
      textAlign: "center",
      background: "white",
      padding: "48px 40px",
      borderRadius: "32px",
      border: "1.5px solid var(--border-color)",
      boxShadow: "var(--shadow-soft)",
    },
    inputGroup: {
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "20px"
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      borderRadius: "16px",
      border: "1.5px solid var(--border-color)",
      fontSize: "16px",
      fontWeight: "500",
      backgroundColor: "#fcfcfc",
      transition: "all 0.2s ease",
      outline: "none",
    },
    footerLink: {
      marginTop: "24px",
      fontSize: "14px",
      color: "var(--text-muted)",
      fontWeight: "600"
    },
    registerBtn: {
      background: "none",
      border: "none",
      color: "var(--brand-orange)",
      fontWeight: "800",
      cursor: "pointer",
      padding: "0 4px",
      textDecoration: "underline"
    }
  };

  return (
    <div className="animate-fade-in" style={loginStyles.card}>
      <h1 style={{ fontWeight: "900", fontSize: "28px", color: "var(--text-dark)" }}>
        Welkom terug
      </h1>
      <p className="small-muted" style={{ marginBottom: "32px" }}>
        Log in om de gegevens van je roedel te bekijken.
      </p>

      <form onSubmit={handleLogin}>
        <div style={loginStyles.inputGroup}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "1px" }}>
            E-MAILADRES
          </label>
          <input 
            className="input-focus-orange"
            style={loginStyles.input} 
            type="email" 
            placeholder="naam@voorbeeld.be" 
            required 
          />
        </div>

        <div style={loginStyles.inputGroup}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "1px" }}>
            WACHTWOORD
          </label>
          <input 
            className="input-focus-orange"
            style={loginStyles.input} 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="primary-btn" 
          style={{ width: "100%", padding: "18px", marginTop: "10px" }}
        >
          Inloggen
        </button>
      </form>

      <div style={loginStyles.footerLink}>
        Nog geen account? 
        <button 
          onClick={() => navigate("/register")} 
          style={loginStyles.registerBtn}
        >
          Registreer hier
        </button>
      </div>
    </div>
  );
}