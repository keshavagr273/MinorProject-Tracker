import express from 'express';
import {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    getDashboardStats
} from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getGroups)
    .post(protect, createGroup);

router.get('/stats/dashboard', protect, getDashboardStats);

router.route('/:id')
    .get(protect, getGroupById)
    .put(protect, updateGroup)
    .delete(protect, deleteGroup);

export default router;
