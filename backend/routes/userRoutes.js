import express from 'express';
import { registerUser, getUsers, updateUserStatus, deleteUser, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, registerUser)
  .get(protect, admin, getUsers);

router.route('/:id/status')
  .patch(protect, admin, updateUserStatus);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
