import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminHistory from "./AdminHistory";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        {/* Top Navigation Bar - Now fully mobile responsive */}
        <nav className="relative z-50 bg-slate-900 shadow-lg border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Switched to a flex-col on mobile, and flex-row on screens larger than 'sm' */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:h-16">
              {/* Brand Title */}
              <div className="shrink-0 flex items-center mb-4 sm:mb-0">
                <span className="text-white font-extrabold text-lg sm:text-xl tracking-wider text-center">
                  <i className="fa-solid fa-microchip mr-2"></i>
                  Student Early Dropout Prediction
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  to="/"
                  className="bg-slate-800 sm:bg-transparent text-slate-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-700 sm:border-none"
                >
                  New Scan
                </Link>
                <Link
                  to="/history"
                  className="bg-slate-800 sm:bg-transparent text-slate-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-700 sm:border-none"
                >
                  Admin Database
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Router */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<AdminHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
