import express from 'express';
import { getStats, getChartData } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/charts', protect, admin, getChartData);

export default router;
