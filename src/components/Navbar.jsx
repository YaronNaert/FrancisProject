import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  const navLinks = [
    { name: "Mijn Roedel", path: "/" },
    { name: "Voedingsplannen", path: "/plans" },
    { name: "Shop", path: "/shop" },
    { name: "Bestellingen", path: "/orders" },
  ];

  // Global Navbar Styles
  const styles = {
    navbar: {
      height: "80px",
      background: "white",
      borderBottom: "1px solid #eee",
      position: "sticky",
      top: 0,
      zindex: 1000,
      display: "flex",
      alignItems: "center",
      padding: "0 5%",
    },
    navInner: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      height: "40px",
    },
    navLinksList: {
      display: "flex",
      gap: "30px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    navLi: {
      display: "flex",
      alignItems: "center",
      height: "100%",
    },
    userBtn: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#f0f0f0",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navInner}>
        <div className="nav-logo-section">
          <img src="/logo.png" alt="O&F" style={styles.logo} />
        </div>
        
        <ul style={styles.navLinksList}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isHovered = hoveredPath === link.path;

            // Individual Link Style
            const linkStyle = {
              textDecoration: "none",
              color: (isActive || isHovered) ? "#F1891A" : "#666",
              fontWeight: isActive ? "800" : "600",
              fontSize: "15px",
              transition: "color 0.2s",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "20px",
              lineHeight: "1.2",
              position: "relative",
            };

            // This mimics the ::after trick to reserve space for bold text
            const ghostStyle = {
              display: "block",
              content: `"${link.name}"`,
              fontWeight: "800",
              height: 0,
              overflow: "hidden",
              visibility: "hidden",
            };

            return (
              <li key={link.path} style={styles.navLi}>
                <Link 
                  to={link.path} 
                  style={linkStyle}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  {link.name}
                  {/* The "Ghost" element to prevent jumping */}
                  <span style={ghostStyle} aria-hidden="true">
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          <button style={styles.userBtn}>YA</button>
        </div>
      </div>
    </nav>
  );
}