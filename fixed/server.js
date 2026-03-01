import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import mongoSanitize from 'mongo-sanitize';
import { router as authRoutes } from './routes/auth.js';

const app = express();

app.use(cors()); 

app.use(express.json());

app.use((req, res, next) => {
    req.body = mongoSanitize(req.body);
    next();
});

mongoose.connect('mongodb://localhost:27017/seclab')
  .then(() => console.log('Fixed DB Connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);

app.listen(5001, () => console.log('Fixed Server: http://localhost:5001'));