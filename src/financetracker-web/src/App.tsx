import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import TransactionsPage from "./pages/TransactionsPage";

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

      </nav>

      {/* Route-definitions */}
      <Routes>
        <Route path="/" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
