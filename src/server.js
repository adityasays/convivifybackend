// src/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Only auth routes for now
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require("./routes/assessmentroutes");
const app = express();
const chatbotRoutes = require("./routes/chatbotroute");

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000' ,'http://localhost:5173' ,'https://convivify-1kqq.onrender.com'], // Add your frontend URL
  credentials: true
}));
app.use(express.json());
app.use("/api/assessment", assessmentRoutes);
app.use("/api/chatbot", chatbotRoutes); 
app.get('/', (req, res) => {
  res.json({ 
    msg: "Convi Backend Running",
    info: "Your identity is encrypted & anonymous. Test /api/auth/register & /login"
  });
});

app.use('/api/auth', authRoutes);

// 404 for any other route (helpful during testing)
app.use((req, res) => {
  res.status(404).json({ 
    msg: 'Route not found — only auth is active right now' 
  });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test Register → POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Test Login    → POST http://localhost:${PORT}/api/auth/login`);
  console.log(`Test Me       → GET  http://localhost:${PORT}/api/auth/me (with token)`);
});