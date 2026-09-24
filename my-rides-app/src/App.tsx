import { Routes, Route, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import RideList from "./pages/RideList";
import RideDetails from "./pages/RideDetails";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Respect saved preference, then OS preference
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="container my-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 mb-0">
          <Link to="/" className="text-decoration-none text-body">
            🎢 ThrillTrack
          </Link>
        </h1>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode((d) => !d)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<RideList />} />
          <Route path="/:id" element={<RideDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="text-center text-body-secondary mt-5 small">
        ThrillTrack · Built with React &amp; Bootstrap
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-5">
      <h2 className="display-6">🎢 Ride not found</h2>
      <p className="text-body-secondary">
        That coaster isn't in the park.
      </p>
      <NavLink to="/" className="btn btn-primary">
        Back to all rides
      </NavLink>
    </div>
  );
}

export default App;
