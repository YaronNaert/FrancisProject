import React from "react";

export default function OrderItem({ order, onClick }) {
  return (
    <div className="order-row" onClick={onClick}>
      <div className="order-main-info">
        <span className="order-number">{order.id}</span>
        <span className="order-date">{order.date}</span>
      </div>
      
      <div className="order-meta">
        <span className="order-count">{order.items} items</span>
        <span className="order-total">{order.total}</span>
      </div>

      <div className="order-status-badge">
        {order.status}
      </div>

      <div className="order-arrow">→</div>
    </div>
  );
}