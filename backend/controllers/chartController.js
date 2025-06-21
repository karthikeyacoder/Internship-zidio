import Chart from '../models/Chart.js'
import Upload from '../models/Upload.js'
import Analytics from '../models/Analytics.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Generate chart
// @route   POST /api/chart/generate
// @access  Private
export const generateChart = asyncHandler(async (req, res) => {
  const { uploadId, chartType, xAxis, yAxis, title, config } = req.body

  // Verify upload exists and belongs to user
  const upload = await Upload.findOne({
    _id: uploadId,
    userId: req.user._id,
    isActive: true
  })

  if (!upload) {
    return res.status(404).json({
      success: false,
      message: 'Upload not found'
    })
  }

  // Create chart
  const chart = await Chart.create({
    uploadId,
    userId: req.user._id,
    title: title || `${yAxis} by ${xAxis}`,
    chartType,
    xAxis,
    yAxis,
    config,
    chartData: config.data
  })

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'create_chart',
    resourceType: 'chart',
    resourceId: chart._id,
    metadata: {
      chartType,
      uploadId,
      title
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.status(201).json({
    success: true,
    message: 'Chart generated successfully',
    chart
  })
})

// @desc    Get user charts
// @route   GET /api/chart/user
// @access  Private
export const getUserCharts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const charts = await Chart.find({ 
    userId: req.user._id,
    isActive: true 
  })
    .populate('uploadId', 'originalName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Chart.countDocuments({ 
    userId: req.user._id,
    isActive: true 
  })

  res.json({
    success: true,
    charts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})

// @desc    Get specific chart
// @route   GET /api/chart/:id
// @access  Private
export const getChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  }).populate('uploadId')

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: 'Chart not found'
    })
  }

  res.json({
    success: true,
    chart
  })
})

// @desc    Update chart
// @route   PUT /api/chart/:id
// @access  Private
export const updateChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: 'Chart not found'
    })
  }

  // Update chart
  Object.assign(chart, req.body)
  await chart.save()

  res.json({
    success: true,
    message: 'Chart updated successfully',
    chart
  })
})

// @desc    Delete chart
// @route   DELETE /api/chart/:id
// @access  Private
export const deleteChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: 'Chart not found'
    })
  }

  // Soft delete
  chart.isActive = false
  await chart.save()

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'delete_chart',
    resourceType: 'chart',
    resourceId: chart._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Chart deleted successfully'
  })
})

// @desc    Download chart
// @route   POST /api/chart/:id/download
// @access  Private
export const downloadChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  })

  if (!chart) {
    return res.status(404).json({
      success: false,
      message: 'Chart not found'
    })
  }

  // Increment download count
  await chart.incrementDownloadCount()

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'download_chart',
    resourceType: 'chart',
    resourceId: chart._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Chart download initiated',
    chart
  })
})