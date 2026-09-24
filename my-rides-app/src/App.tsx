import { Routes, Route, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import RideList from "./pages/RideList";
import RideDetails from "./pages/RideDetails";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
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
    <>
      <nav className="navbar navbar-expand bg-body-tertiary border-bottom sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand fw-semibold">
            🎢 ThrillTrack
          </Link>

          <div className="d-flex align-items-center gap-2">
            <NavLink to="/" end className="btn btn-sm btn-outline-secondary d-none d-sm-inline-block">
              All Rides
            </NavLink>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
              <span className="d-none d-sm-inline ms-1">
                {darkMode ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container my-4 my-md-5">
        <Routes>
          <Route path="/" element={<RideList />} />
          <Route path="/:id" element={<RideDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-top py-4 mt-auto">
        <div className="container text-center text-body-secondary small">
          ThrillTrack · Built with React &amp; Bootstrap
        </div>
      </footer>
    </>
  );
}

function NotFound() {
  return (
    <div className="text-center py-5">
      <div className="display-1">🎢</div>
      <h2 className="mb-2">Ride not found</h2>
      <p className="text-body-secondary mb-4">
        That coaster isn't in the park.
      </p>
      <NavLink to="/" className="btn btn-primary">
        Back to all rides
      </NavLink>
    </div>
  );
}

export default App;
