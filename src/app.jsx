import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import PetOverview from "./pages/PetOverview";
import NutritionCalculator from "./pages/NutritionCalculator";
import Navbar from "./components/Navbar";
import { Header, StyleTag } from "./components/UIComponents";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import FeedingPlans from "./pages/FeedingPlans";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";

// --- 1. STYLES DEFINED OUTSIDE (Global Scope) ---
const styles = {
  siteWrapper: {
    minHeight: "100vh",
    backgroundColor: "var(--brand-bg)",
    display: "flex",
    flexDirection: "column",
  },
  siteHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "white",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  },
  headerLeft: { display: "flex", justifyContent: "flex-start" },
  headerCenter: { display: "flex", justifyContent: "center" },
  headerRight: { display: "flex", justifyContent: "flex-end" },
  logo: { height: "40px", cursor: "pointer" },
  btnSecondaryOutline: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "1.5px solid var(--border-color)",
    backgroundColor: "white",
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    cursor: "pointer"
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  }
};

// --- 2. APP CONTENT COMPONENT ---
function AppContent({ pets, setPets }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isCalculatorPage = location.pathname.startsWith("/calculator");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={styles.siteWrapper}>
      <header style={styles.siteHeader}>
        <div style={styles.headerLeft}>
          {isLoggedIn ? (
             isCalculatorPage && (
               <button onClick={() => navigate(-1)} style={styles.btnSecondaryOutline}>
                 <span>←</span> <span>Terug</span>
               </button>
             )
          ) : (
            <a href="https://othonandfriends.com" style={styles.btnSecondaryOutline}>
              <span>←</span> <span>Terug naar home</span>
            </a>
          )}
        </div>

        <div style={styles.headerCenter}>
          <img 
            src="/logo.png" 
            alt="O&F" 
            onClick={() => navigate("/")} 
            style={styles.logo} 
          />
        </div>

        <div style={styles.headerRight}>
          {isLoggedIn ? (
            <Header variant="lang-only" />
          ) : (
            !isAuthPage && (
              <button 
                className="primary-btn" 
                style={{ padding: '8px 20px', fontSize: '14px' }}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )
          )}
        </div>
      </header>

      {isLoggedIn && !isCalculatorPage && <Navbar />}

      <main style={styles.contentContainer}>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          
          {!isLoggedIn ? (
            <Route path="*" element={
              <div className="animate-fade-in" style={{ marginTop: '40px' }}>
                <NutritionCalculator pets={pets} setPets={setPets} />
              </div>
            } />
          ) : (
            <>
              <Route path="/" element={<PetOverview pets={pets} />} />
              <Route path="/calculator/:petId?" element={<NutritionCalculator pets={pets} setPets={setPets} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/plans" element={<FeedingPlans pets={pets} />} />
              <Route path="/shop" element={<div className="text-center" style={{padding: "40px"}}>Shop komt binnenkort!</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

// --- 3. MAIN APP WRAPPER ---
export default function App() {
  const [pets, setPets] = useState([
    { id: "1", name: "Bowie", petType: "dog", breed: "Beagle", birthDate: "2020-01-01", idealWeight: 12 },
  ]);

  return (
    <BrowserRouter>
      <StyleTag />
      <AppContent pets={pets} setPets={setPets} />
    </BrowserRouter>
  );
}