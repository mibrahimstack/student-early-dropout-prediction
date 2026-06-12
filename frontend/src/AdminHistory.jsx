import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/records");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
      setLoading(false);
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-slate-600 font-bold">
        Loading Database Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Historical Risk Assessments
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A permanent record of all student scans processed by the AI
            microservice.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                    Financials
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-slate-200 uppercase tracking-wider">
                    Sem 1 (Passed / GPA)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-slate-200 uppercase tracking-wider">
                    Sem 2 (Passed / GPA)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-200 uppercase tracking-wider">
                    AI Prediction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {records.map((record) => {
                  const s1Passed = record.sem1Theory + record.sem1Labs;
                  const s2Passed = record.sem2Theory + record.sem2Labs;
                  const date = new Date(record.timestamp).toLocaleString();

                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {record.feeStatus}
                        </div>
                        <div className="text-sm text-slate-500">
                          PKR {record.fatherIncome.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-700">
                        {s1Passed} Units /{" "}
                        <span className="text-blue-600">{record.sem1GPA}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-700">
                        {s2Passed} Units /{" "}
                        <span className="text-blue-600">{record.sem2GPA}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`px-4 py-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                            record.aiPrediction.includes("High Risk")
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {record.aiPrediction}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-500 font-medium"
                    >
                      No records found in MongoDB. Go scan a student!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;
