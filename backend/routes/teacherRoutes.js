import express from 'express';
import { getTeachers, getTeacherById } from '../controllers/teacherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTeachers);
router.get('/:id', protect, getTeacherById);

export default router;
