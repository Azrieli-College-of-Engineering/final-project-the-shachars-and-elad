import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { router as authRoutes } from './routes/auth.js';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/seclab')
  .then(() => console.log('✅ Database Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));