import express from 'express';
import { createMaterial, getMaterials } from '../controllers/materialController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createMaterial)
  .get(protect, getMaterials);

export default router;
