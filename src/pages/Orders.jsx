import React from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";

export default function Orders() {
  const navigate = useNavigate();

  // Mock data for now - we'll connect this to a database later
  const pastOrders = [
    { id: "ORD-7721", date: "24 Feb 2024", status: "Bezorgd", total: "€42,50", items: 3 },
    { id: "ORD-6540", date: "12 Jan 2024", status: "Bezorgd", total: "€89,00", items: 6 },
    { id: "ORD-5112", date: "05 Dec 2023", status: "Bezorgd", total: "€12,20", items: 1 },
  ];

  return (
    <div className="page-wrapper">
      <div className="orders-header">
        <h1 className="h1">Mijn Bestellingen</h1>
        <p className="lead">Bekijk en herhaal je eerdere bestellingen.</p>
      </div>

      <div className="orders-list">
        {pastOrders.length > 0 ? (
          pastOrders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onClick={() => navigate(`/orders/${order.id}`)} 
            />
          ))
        ) : (
          <div className="empty-state">
            <p>Je hebt nog geen bestellingen geplaatst.</p>
            <button className="primary-btn" onClick={() => navigate("/shop")}>
              Ga naar de Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}