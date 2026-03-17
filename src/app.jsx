import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import PetOverview from "./pages/PetOverview";
import NutritionCalculator from "./pages/NutritionCalculator";
import { Header, StyleTag } from "./components/UIComponents";
import "./index.css";

export default function App() {
  // Global pet state
  const [pets, setPets] = useState([
    { id: "1", name: "Bowie", petType: "dog", breed: "Beagle", birthDate: "2020-01-01", conditionPct: 100, idealWeight: 12 },
  ]);

  return (
    <BrowserRouter>
      <StyleTag />
      <div className="site-wrapper">
        <header className="site-header">
          <div className="header-left">
            <a href="https://othonandfriends.com" className="btn-secondary-outline">
              <span className="icon">←</span>
              <span className="text">Terug naar home</span>
            </a>
          </div>

          <div className="header-center">
            <img src="../logo.png" alt="Othon & Friends" className="site-logo" />
          </div>

          <div className="header-right">
            <Header variant="lang-only" />
          </div>
        </header>

        <main className="content-container">
          <Routes>
            <Route path="/" element={<PetOverview pets={pets} />} />
            <Route 
              path="/calculator/:petId?" 
              element={<NutritionCalculator pets={pets} setPets={setPets} />} 
            />
            {/* Future routes for Shop and Orders go here */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}