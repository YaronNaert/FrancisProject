import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import PetOverview from "./pages/PetOverview";
import NutritionCalculator from "./pages/NutritionCalculator";
import { StyleTag } from "./components/UIComponents";
import "./index.css";

export default function App() {
  // This is our "database" for now
  const [pets, setPets] = useState([
    { id: "1", name: "Bowie", petType: "dog", breed: "Beagle", birthDate: "2020-01-01", conditionPct: 100 },
    { id: "2", name: "Luna", petType: "cat", breed: "Persian", birthDate: "2022-05-12", conditionPct: 110 }
  ]);

  return (
    <BrowserRouter>
      <StyleTag />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<PetOverview pets={pets} />} />
          {/* Notice the :petId? - this makes the ID optional */}
          <Route path="calculator/:petId?" element={<NutritionCalculator pets={pets} setPets={setPets} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}