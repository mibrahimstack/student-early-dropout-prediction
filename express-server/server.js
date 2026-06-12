const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Define the Mongoose Schema 
const studentSchema = new mongoose.Schema({
  sem1Theory: Number,
  sem1Labs: Number,
  sem1GPA: Number,
  sem2Theory: Number,
  sem2Labs: Number,
  sem2GPA: Number,
  feeStatus: String,
  fatherIncome: Number,
  aiPrediction: String, 
  timestamp: { type: Date, default: Date.now }
});

const StudentRecord = mongoose.model('StudentRecord', studentSchema);

// API Route: Save a new student record
app.post('/api/records', async (req, res) => {
  try {
    const newRecord = new StudentRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json({ status: 'success', data: savedRecord });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// API Route: Fetch all records
app.get('/api/records', async (req, res) => {
  try {
    const records = await StudentRecord.find().sort({ timestamp: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Express Server running on http://localhost:${PORT}`);
});
module.exports = app;