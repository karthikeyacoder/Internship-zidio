import express from 'express'
import { upload, handleMulterError } from '../config/multer.js'
import { auth } from '../middleware/auth.js'
import { uploadExcel, getHistory, getUpload, deleteUpload, downloadFile } from '../controllers/uploadController.js'

const router = express.Router()

// Upload Excel file
router.post('/excel', auth, upload.single('excel'), handleMulterError, uploadExcel)

// Get upload history
router.get('/history', auth, getHistory)

// Get specific upload
router.get('/:id', auth, getUpload)

// Delete upload
router.delete('/:id', auth, deleteUpload)

// Download file
router.get('/:id/download', auth, downloadFile)

export default router