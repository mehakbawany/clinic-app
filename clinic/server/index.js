require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => (!origin || allowed.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Clinic API is running' }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error('DB connection error:', e.message);
    res.status(500).json({ message: 'Database connection failed. Check MONGO_URI and Atlas network access.' });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

module.exports = app;
