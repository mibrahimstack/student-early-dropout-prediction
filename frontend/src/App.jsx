import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminHistory from "./AdminHistory";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        {/* Top Navigation Bar */}
        {/* Top Navigation Bar - Now with z-50 to prevent overlap */}
        <nav className="relative z-50 bg-slate-900 shadow-lg border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="shrink-0 flex items-center">
                  <span className="text-white font-extrabold text-xl tracking-wider">
                    <i className="fa-solid fa-microchip mr-2"></i>
                    Student Early Dropout Prediction
                  </span>
                </div>
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to="/"
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    New Scan
                  </Link>
                  <Link
                    to="/history"
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Database
                  </Link>
                </div>
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
