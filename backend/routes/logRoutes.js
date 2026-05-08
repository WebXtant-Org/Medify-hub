import express from 'express';
import { getActivityLogs, getAuditLogs } from '../controllers/logController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/activity', protect, admin, getActivityLogs);
router.get('/audit', protect, admin, getAuditLogs);

export default router;
