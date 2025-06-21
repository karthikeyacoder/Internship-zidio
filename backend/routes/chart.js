import express from 'express'
import { auth } from '../middleware/auth.js'
import { 
  generateChart, 
  getUserCharts, 
  getChart, 
  updateChart, 
  deleteChart, 
  downloadChart 
} from '../controllers/chartController.js'

const router = express.Router()

// Generate chart
router.post('/generate', auth, generateChart)

// Get user charts
router.get('/user', auth, getUserCharts)

// Get specific chart
router.get('/:id', auth, getChart)

// Update chart
router.put('/:id', auth, updateChart)

// Delete chart
router.delete('/:id', auth, deleteChart)

// Download chart
router.post('/:id/download', auth, downloadChart)

export default router