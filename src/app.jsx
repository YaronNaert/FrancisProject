import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PetOverview from "./pages/PetOverview";
import NutritionCalculator from "./pages/NutritionCalculator";
import Navbar from "./components/Navbar";
import { Header, StyleTag } from "./components/UIComponents";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import FeedingPlans from "./pages/FeedingPlans";
import "./index.css";

function AppContent({ pets, setPets }) {
  const location = useLocation();
  const isCalculatorPage = location.pathname.startsWith("/calculator");

  // Inline Styles extracted from your index.css
  const styles = {
    siteWrapper: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc", // var(--brand-bg)
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
    headerLeft: {
      display: "flex",
      justifyContent: "flex-start",
    },
    headerCenter: {
      display: "flex",
      justifyContent: "center",
    },
    headerRight: {
      display: "flex",
      justifyContent: "flex-end",
    },
    logo: {
      height: "40px",
    },
    btnSecondaryOutline: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1.5px solid #e2e8f0",
      backgroundColor: "white",
      color: "#636e72",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    contentContainer: {
      flex: 1,
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    }
  };

  return (
    <div style={styles.siteWrapper}>
      {isCalculatorPage ? (
        <header style={styles.siteHeader}>
          <div style={styles.headerLeft}>
            <a 
              href="https://othonandfriends.com" 
              style={styles.btnSecondaryOutline}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#F1891A";
                e.currentTarget.style.color = "#F1891A";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#636e72";
              }}
            >
              <span>←</span>
              <span>Terug naar home</span>
            </a>
          </div>
          <div style={styles.headerCenter}>
            <img src="/logo.png" alt="O&F" style={styles.logo} />
          </div>
          <div style={styles.headerRight}>
            <Header variant="lang-only" />
          </div>
        </header>
      ) : (
        <Navbar />
      )}

      <main style={styles.contentContainer}>
        <Routes>
          <Route path="/" element={<PetOverview pets={pets} />} />
          <Route 
            path="/calculator/:petId?" 
            element={<NutritionCalculator pets={pets} setPets={setPets} />} 
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/plans" element={<FeedingPlans pets={pets} />} />
          <Route path="/shop" element={<div style={{padding: "40px", textAlign: "center"}}>Shop komt binnenkort!</div>} />
        </Routes>
      </main>
    </div>
  );
}

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