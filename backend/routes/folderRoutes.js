import express from 'express';
import { createFolder, getFolders, deleteFolder } from '../controllers/folderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createFolder)
  .get(protect, getFolders);

router.route('/:id')
  .delete(protect, admin, deleteFolder);

export default router;
