import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/error.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otherRoutes from './routes/otherRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import logRoutes from './routes/logRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/logs', logRoutes);
app.use('/api', settingRoutes);
app.use('/api/', otherRoutes); // for tests, attendance, notifications

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
