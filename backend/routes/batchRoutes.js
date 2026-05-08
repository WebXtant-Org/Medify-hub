import express from 'express';
import { createBatch, getBatches, updateBatch, deleteBatch } from '../controllers/batchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createBatch)
  .get(protect, getBatches);

router.route('/:id')
  .put(protect, admin, updateBatch)
  .delete(protect, admin, deleteBatch);

export default router;
