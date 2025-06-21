import Upload from '../models/Upload.js'
import Analytics from '../models/Analytics.js'
import { processExcelFile, cleanupFile } from '../utils/fileProcessor.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import fs from 'fs'
import path from 'path'

// @desc    Upload and process Excel file
// @route   POST /api/upload/excel
// @access  Private
export const uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    })
  }

  try {
    // Process the Excel file
    const processedData = await processExcelFile(req.file.path)
    
    // Create upload record
    const upload = await Upload.create({
      userId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadPath: req.file.path,
      columns: processedData.columns,
      rowCount: processedData.rowCount,
      data: processedData.data,
      metadata: {
        sheetNames: processedData.sheetNames,
        selectedSheet: processedData.selectedSheet,
        dataTypes: processedData.dataTypes
      },
      processingStatus: 'completed'
    })

    // Log analytics
    await Analytics.logActivity({
      userId: req.user._id,
      action: 'upload_file',
      resourceType: 'upload',
      resourceId: upload._id,
      metadata: {
        filename: req.file.originalname,
        fileSize: req.file.size,
        rowCount: processedData.rowCount
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      upload: {
        _id: upload._id,
        originalName: upload.originalName,
        columns: upload.columns,
        rowCount: upload.rowCount,
        data: upload.data.slice(0, 10), // Return first 10 rows for preview
        metadata: upload.metadata,
        createdAt: upload.createdAt
      }
    })
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await cleanupFile(req.file.path)
    }
    
    throw error
  }
})

// @desc    Get upload history
// @route   GET /api/upload/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const uploads = await Upload.find({ 
    userId: req.user._id,
    isActive: true 
  })
    .select('-data') // Exclude large data field
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Upload.countDocuments({ 
    userId: req.user._id,
    isActive: true 
  })

  res.json({
    success: true,
    uploads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})

// @desc    Get specific upload
// @route   GET /api/upload/:id
// @access  Private
export const getUpload = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!upload) {
    return res.status(404).json({
      success: false,
      message: 'Upload not found'
    })
  }

  res.json({
    success: true,
    upload
  })
})

// @desc    Delete upload
// @route   DELETE /api/upload/:id
// @access  Private
export const deleteUpload = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!upload) {
    return res.status(404).json({
      success: false,
      message: 'Upload not found'
    })
  }

  // Soft delete
  upload.isActive = false
  await upload.save()

  // Clean up file
  await cleanupFile(upload.uploadPath)

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'delete_upload',
    resourceType: 'upload',
    resourceId: upload._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Upload deleted successfully'
  })
})

// @desc    Download file
// @route   GET /api/upload/:id/download
// @access  Private
export const downloadFile = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!upload) {
    return res.status(404).json({
      success: false,
      message: 'Upload not found'
    })
  }

  const filePath = upload.uploadPath
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found on server'
    })
  }

  res.download(filePath, upload.originalName)
})