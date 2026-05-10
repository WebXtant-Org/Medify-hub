import express from 'express';
import { createMaterial, getMaterials } from '../controllers/materialController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, upload.single('file'), createMaterial)
  .get(protect, getMaterials);

export default router;
