import { Outlet, Link, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar - Stays fixed */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="O&F" />
        </div>
        <nav className="nav-menu">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>🏠 Overview</Link>
          <Link to="/calculator" className={location.pathname.includes("calculator") ? "active" : ""}>⚖️ Calculator</Link>
          <Link to="/shop" className={location.pathname === "/shop" ? "active" : ""}>🛒 Shop</Link>
          <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>📦 Bestellingen</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-search"> {/* Search pets... */} </div>
          <div className="user-profile">
            <span>Trusted Advisor</span>
            <div className="avatar" />
          </div>
        </header>

        <section className="page-content">
          <Outlet /> {/* This is where your pages will render */}
        </section>
      </main>
    </div>
  );
}   