import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
// Ensure your background image is still at this path!
import backgroundImage from "./assets/background.jpg";

const Dashboard = () => {
  const [formData, setFormData] = useState({
    sem1Theory: "",
    sem1Labs: "",
    sem1GPA: "",
    sem2Theory: "",
    sem2Labs: "",
    sem2GPA: "",
    feeStatus: "Paid",
    fatherIncome: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [explanationData, setExplanationData] = useState([]); // New state for XAI
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setExplanationData([]);
    setLoading(true);

    const aiPayload = {
      "Curricular units 1st sem (approved)":
        Number(formData.sem1Theory) + Number(formData.sem1Labs),
      "Curricular units 1st sem (grade)": Number(formData.sem1GPA) * 5,
      "Curricular units 2nd sem (approved)":
        Number(formData.sem2Theory) + Number(formData.sem2Labs),
      "Curricular units 2nd sem (grade)": Number(formData.sem2GPA) * 5,
      "Tuition fees up to date": formData.feeStatus === "Paid" ? 1 : 0,
      Debtor: formData.feeStatus === "Unpaid" ? 1 : 0,
    };

    try {
      // Step 1: Get AI Prediction from Python Flask
      const response = await axios.post(
        "https://student-early-dropout-prediction-ek.vercel.app/predict",
        aiPayload,
      );

      const resultText = response.data.prediction;
      setPrediction(resultText);
      setExplanationData(response.data.explanation);

      // Step 2: Save everything to Express/MongoDB Atlas
      const dbPayload = {
        ...formData,
        aiPrediction: resultText,
      };

      await axios.post(
        "https://student-early-dropout-prediction.vercel.app/api/records",
        dbPayload,
      );
      console.log("Record permanently saved to MongoDB!");
    } catch (error) {
      console.error("Connection failed:", error.message);
      setPrediction("System Unavailable");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-slate-100/80 z-0"></div>

      <div className="max-w-4xl w-full z-10 relative space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100/50 backdrop-blur-sm">
        <div className="border-b border-slate-200 pb-6 mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">
            Student Academic Radar
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
            Input localized performance metrics to calculate predictive dropout
            risk.
          </p>
        </div>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          {/* Section 1: Financial */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
            <h3 className="text-lg font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
              Financial Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tuition Fee Status
                </label>
                <select
                  name="feeStatus"
                  value={formData.feeStatus}
                  onChange={handleChange}
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md shadow-sm"
                >
                  <option value="Paid">Fully Paid</option>
                  <option value="Unpaid">Unpaid / Defaulter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Father's Monthly Income (PKR)
                </label>
                <input
                  type="number"
                  name="fatherIncome"
                  value={formData.fatherIncome}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Semesters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-100 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3">
                Semester 1 Performance
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Theory Subjects Passed (Max 5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  name="sem1Theory"
                  value={formData.sem1Theory}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Lab Subjects Passed (Max 2)
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  name="sem1Labs"
                  value={formData.sem1Labs}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  GPA (Out of 4.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  name="sem1GPA"
                  value={formData.sem1GPA}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-100 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3">
                Semester 2 Performance
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Theory Subjects Passed (Max 5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  name="sem2Theory"
                  value={formData.sem2Theory}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Lab Subjects Passed (Max 2)
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  name="sem2Labs"
                  value={formData.sem2Labs}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  GPA (Out of 4.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  name="sem2GPA"
                  value={formData.sem2GPA}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-transform hover:scale-[1.01]"
          >
            {loading ? "Analyzing Profile..." : "Run Neural Risk Analysis"}
          </button>
        </form>

        {/* The XAI Results Section */}
        {prediction && (
          <div className="mt-10 animate-fade-in-up">
            <div
              className={`p-6 rounded-t-2xl text-center shadow-lg border-2 ${prediction.includes("High Risk") ? "bg-red-50 text-red-700 border-red-200 border-b-0" : "bg-emerald-50 text-emerald-700 border-emerald-200 border-b-0"}`}
            >
              <span className="block text-sm font-medium uppercase tracking-widest mb-1 opacity-80">
                AI System Prediction
              </span>
              <span className="text-3xl font-extrabold tracking-tight">
                {prediction}
              </span>
            </div>

            {/* The Explanation Chart */}
            <div className="bg-white p-8 rounded-b-2xl border-2 border-t-0 shadow-lg border-slate-200">
              <h4 className="text-center font-semibold text-slate-700 mb-6 uppercase tracking-wider text-sm">
                Model Decision Breakdown
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={explanationData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="factor"
                      type="category"
                      width={100}
                      tick={{ fontSize: 12, fill: "#475569" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f1f5f9" }}
                      formatter={(value) => [value, "Impact Score"]}
                    />
                    <ReferenceLine x={0} stroke="#94a3b8" />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {explanationData.map((entry, index) => (
                        // Green if pushing towards graduate, Red if pushing towards dropout
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.impact > 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-400 mt-4">
                * Bars stretching to the right (
                <span className="text-emerald-500 font-bold">Green</span>)
                reduce dropout risk. Bars stretching left (
                <span className="text-red-500 font-bold">Red</span>) increase
                dropout risk.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
