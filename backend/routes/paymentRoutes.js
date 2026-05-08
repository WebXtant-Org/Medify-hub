import express from 'express';
import { recordPayment, getPayments } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, recordPayment)
  .get(protect, getPayments);

export default router;
