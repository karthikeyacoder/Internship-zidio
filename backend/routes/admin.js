import express from 'express'
import { adminAuth } from '../middleware/auth.js'
import { 
  adminLogin,
  getAdminProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAnalytics,
  getUploads,
  getCharts,
  bulkDelete
} from '../controllers/adminController.js'

const router = express.Router()

// Admin login
router.post('/login', adminLogin)

// Admin profile
router.get('/profile', adminAuth, getAdminProfile)

// User management
router.get('/users', adminAuth, getUsers)
router.get('/users/:id', adminAuth, getUser)
router.put('/users/:id', adminAuth, updateUser)
router.delete('/users/:id', adminAuth, deleteUser)

// Analytics
router.get('/analytics', adminAuth, getAnalytics)

// File management
router.get('/uploads', adminAuth, getUploads)
router.get('/charts', adminAuth, getCharts)

// Bulk operations
router.post('/bulk-delete', adminAuth, bulkDelete)

export default router