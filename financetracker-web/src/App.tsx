import { NavLink, Routes, Route } from "react-router-dom";
import './App.css'

function DashboardPage() {
  return <h1>Dashboard</h1>;
}

function CategoriesPage() {
  return <h1>Categories (CRUD)</h1>;
}

function TransactionsPage() {
  return <h1>Transactions (CRUD)</h1>;
}

/**
 * App-Component – central entry point of frontend
 * Configure routing with react-router-dom.
 *
 * - "/categories"   -> CategoriesPage
 * - "/transactions" -> TransactionsPage
 */
export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      {/* Navigation for main page */}
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
      </nav>

      {/* Route-definitions */}
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
    </div>
  );
}
