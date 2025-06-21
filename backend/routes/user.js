import express from 'express'
import { auth } from '../middleware/auth.js'
import { getProfile, updateProfile, getUserStats } from '../controllers/userController.js'

const router = express.Router()

// Get user profile
router.get('/profile', auth, getProfile)

// Update user profile
router.put('/profile', auth, updateProfile)

// Get user statistics
router.get('/stats', auth, getUserStats)

export default router