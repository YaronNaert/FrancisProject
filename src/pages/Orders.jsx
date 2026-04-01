import React from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";

export default function Orders() {
  const navigate = useNavigate();

  // Mock data for now
  const pastOrders = [
    { id: "ORD-7721", date: "24 Feb 2024", status: "Bezorgd", total: "€42,50", items: 3 },
    { id: "ORD-6540", date: "12 Jan 2024", status: "Bezorgd", total: "€89,00", items: 6 },
    { id: "ORD-5112", date: "05 Dec 2023", status: "Bezorgd", total: "€12,20", items: 1 },
  ];

  // Inline Style Objects extracted from your index.css
  const styles = {
    pageWrapper: {
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "0 20px"
    },
    header: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      marginBottom: "40px"
    },
    h1: {
      fontSize: "34px",
      fontWeight: "900",
      marginBottom: "12px",
      color: "#2d3436",
      gridColumn: "2",
      textAlign: "center",
      margin: "0"
    },
    lead: {
      fontSize: "18px",
      color: "#636e72",
      marginBottom: "40px",
      textAlign: "center",
      gridColumn: "2"
    },
    ordersList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "20px"
    },
    emptyState: {
      textAlign: "center",
      padding: "60px",
      background: "white",
      borderRadius: "28px",
      border: "1px dashed #e2e8f0"
    },
    primaryBtn: {
      background: "#F1891A",
      color: "white",
      border: "none",
      padding: "18px 32px",
      borderRadius: "16px",
      fontWeight: "800",
      fontSize: "16px",
      cursor: "pointer",
      width: "auto", // Overriding the 100% width for the 'center' look
      marginTop: "20px"
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.header}>
        {/* Empty div to balance the grid columns */}
        <div></div>
        
        <div style={{ textAlign: "center" }}>
          <h1 style={styles.h1}>Mijn Bestellingen</h1>
          <p style={styles.lead}>Bekijk en herhaal je eerdere bestellingen.</p>
        </div>

        <div></div>
      </div>

      <div style={styles.ordersList}>
        {pastOrders.length > 0 ? (
          pastOrders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onClick={() => navigate(`/orders/${order.id}`)} 
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{ color: "#636e72" }}>Je hebt nog geen bestellingen geplaatst.</p>
            <button 
              style={styles.primaryBtn} 
              onClick={() => navigate("/shop")}
              onMouseOver={(e) => (e.target.style.opacity = "0.9")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Ga naar de Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}