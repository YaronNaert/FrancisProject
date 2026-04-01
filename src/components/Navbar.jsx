import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Mijn Roedel", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Bestellingen", path: "/orders" },
    { name: "Voedingsplannen", path: "/plans" },
  ];

  return (
    <nav className="main-navbar">
      <div className="nav-inner">
        <div className="nav-logo-section">
          <img src="/logo.png" alt="O&F" className="nav-logo" />
        </div>
        
        <ul className="nav-links">
            {navLinks.map((link) => (
                <li key={link.path}>
                <Link 
                    to={link.path} 
                    className={location.pathname === link.path ? "active" : ""}
                    data-text={link.name} /* This is the key part! */
                >
                    {link.name}
                </Link>
                </li>
            ))}
        </ul>

        <div className="nav-actions">
          <button className="user-profile-btn">YA</button>
        </div>
      </div>
    </nav>
  );
}