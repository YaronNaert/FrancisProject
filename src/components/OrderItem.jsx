import React, { useState } from "react";

export default function OrderItem({ order, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    orderRow: {
      background: "white",
      padding: "20px 28px",
      borderRadius: "20px",
      border: isHovered ? "1px solid #F1891A" : "1px solid #e2e8f0",
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 40px",
      alignItems: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      transform: isHovered ? "scale(1.01)" : "scale(1)",
      boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.05)" : "none",
      gap: "20px",
    },
    orderMainInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    orderNumber: {
      display: "block",
      fontWeight: "800",
      color: "#2d3436",
    },
    orderDate: {
      fontSize: "14px",
      color: "#636e72",
    },
    orderMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    orderCount: {
      fontSize: "14px",
      color: "#636e72",
    },
    orderTotal: {
      fontWeight: "700",
      color: "#F1891A",
    },
    statusBadge: {
      backgroundColor: "#e6fcf5", // Light green background
      color: "#0ca678",           // Dark green text
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      textAlign: "center",
      width: "fit-content",
    },
    orderArrow: {
      color: "#F1891A",
      fontWeight: "bold",
      textAlign: "right",
    },
  };

  return (
    <div 
      style={styles.orderRow} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.orderMainInfo}>
        <span style={styles.orderNumber}>{order.id}</span>
        <span style={styles.orderDate}>{order.date}</span>
      </div>
      
      <div style={styles.orderMeta}>
        <span style={styles.orderCount}>{order.items} items</span>
        <span style={styles.orderTotal}>{order.total}</span>
      </div>

      <div style={styles.statusBadge}>
        {order.status}
      </div>

      <div style={styles.orderArrow}>→</div>
    </div>
  );
}