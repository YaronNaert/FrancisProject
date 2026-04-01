import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PetOverview from "./pages/PetOverview";
import NutritionCalculator from "./pages/NutritionCalculator";
import Navbar from "./components/Navbar"; // Import the new Navbar
import { Header, StyleTag } from "./components/UIComponents";
import Orders from "./pages/Orders"; // Import the Orders page
import OrderDetails from "./pages/OrderDetails"; // Import the OrderDetails page
import FeedingPlans from "./pages/FeedingPlans";
import "./index.css";

function AppContent({ pets, setPets }) {
  const location = useLocation();
  
  // Logic: Is the user currently using the calculator?
  const isCalculatorPage = location.pathname.startsWith("/calculator");

  return (
    <div className="site-wrapper">
      {isCalculatorPage ? (
        /* 1. SIMPLE HEADER (For Guest/Calculator users) */
        <header className="site-header">
          <div className="header-left">
            <a href="https://othonandfriends.com" className="btn-secondary-outline">
              <span className="icon">←</span>
              <span className="text">Terug naar home</span>
            </a>
          </div>
          <div className="header-center">
            <img src="/logo.png" alt="O&F" className="site-logo" />
          </div>
          <div className="header-right">
            <Header variant="lang-only" />
          </div>
        </header>
      ) : (
        /* 2. FULL NAVBAR (For Logged-in/Dashboard users) */
        <Navbar />
      )}

      <main className="content-container">
        <Routes>
          <Route path="/" element={<PetOverview pets={pets} />} />
          <Route 
            path="/calculator/:petId?" 
            element={<NutritionCalculator pets={pets} setPets={setPets} />} 
          />
          <Route path="/orders" element={<Orders />} />

          <Route path="/orders/:orderId" element={<OrderDetails />} />

          <Route path="/plans" element={<FeedingPlans pets={pets} />} />
  
          {/* If you haven't made the Shop page yet, you can use a placeholder */}
          <Route path="/shop" element={<div>Shop komt binnenkort!</div>} />
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