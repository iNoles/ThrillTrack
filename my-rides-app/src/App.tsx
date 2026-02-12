import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import RideList from "./pages/RideList";
import RideDetails from "./pages/RideDetails";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5">🎢 Roller Coaster Rides</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(d => !d)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <Routes>
        <Route path="/ThrillTrack/" element={<RideList />} />
        <Route path="/ThrillTrack/:id" element={<RideDetails />} />
      </Routes>
    </div>
  );
}

export default App;
