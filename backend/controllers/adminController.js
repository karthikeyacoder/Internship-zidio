import User from '../models/User.js'
import Upload from '../models/Upload.js'
import Chart from '../models/Chart.js'
import Analytics from '../models/Analytics.js'
import { generateToken } from '../utils/jwt.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  console.log('🔐 Admin login attempt:', req.body)
  
  const { email, password } = req.body

  if (!email || !password) {
    console.log('❌ Missing email or password')
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    })
  }

  try {
    // Check if user exists and is admin
    console.log('🔍 Looking for admin user with email:', email)
    const user = await User.findOne({ email, role: 'admin' }).select('+password')
    
    if (!user) {
      console.log('❌ Admin user not found')
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      })
    }

    console.log('✅ Admin user found:', user.email)

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    console.log('🔑 Password validation result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password')
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)
    console.log('🎫 Generated token for admin:', user.email)

    // Log analytics
    try {
      await Analytics.logActivity({
        userId: user._id,
        action: 'admin_login',
        resourceType: 'user',
        resourceId: user._id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      })
    } catch (analyticsError) {
      console.log('⚠️ Analytics logging failed:', analyticsError.message)
    }

    console.log('✅ Admin login successful')
    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('🚨 Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id)

  res.json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }
  })
})

// @desc    Get all users with advanced filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search || ''
  const role = req.query.role || ''
  const status = req.query.status || ''
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
  const skip = (page - 1) * limit

  // Build query
  let query = {}
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }
  
  if (role) {
    query.role = role
  }
  
  if (status) {
    query.isActive = status === 'active'
  }

  // Get users with pagination and sorting
  const users = await User.find(query)
    .select('-password')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean()

  // Get additional stats for each user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const [uploadCount, chartCount, lastActivity] = await Promise.all([
        Upload.countDocuments({ userId: user._id, isActive: true }),
        Chart.countDocuments({ userId: user._id, isActive: true }),
        Analytics.findOne({ userId: user._id }).sort({ timestamp: -1 }).select('timestamp action')
      ])

      return {
        ...user,
        stats: {
          totalUploads: uploadCount,
          totalCharts: chartCount,
          lastActivity: lastActivity?.timestamp || null,
          lastAction: lastActivity?.action || null
        }
      }
    })
  )

  const total = await User.countDocuments(query)

  res.json({
    success: true,
    users: usersWithStats,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    filters: {
      search,
      role,
      status,
      sortBy,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    }
  })
})

// @desc    Get specific user with detailed information
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean()

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Get detailed user statistics
  const [uploadCount, chartCount, recentUploads, recentCharts, activityLog] = await Promise.all([
    Upload.countDocuments({ userId: user._id, isActive: true }),
    Chart.countDocuments({ userId: user._id, isActive: true }),
    Upload.find({ userId: user._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName fileSize createdAt processingStatus'),
    Chart.find({ userId: user._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title chartType createdAt downloadCount'),
    Analytics.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action timestamp metadata')
  ])

  res.json({
    success: true,
    user: {
      ...user,
      stats: {
        totalUploads: uploadCount,
        totalCharts: chartCount
      },
      recentActivity: {
        uploads: recentUploads,
        charts: recentCharts,
        activityLog
      }
    }
  })
})

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Check if email is already taken by another user
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      })
    }
  }

  // Update user fields
  if (name) user.name = name
  if (email) user.email = email
  if (role) user.role = role
  if (typeof isActive === 'boolean') user.isActive = isActive

  await user.save()

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'admin_update_user',
    resourceType: 'user',
    resourceId: user._id,
    metadata: { updatedFields: Object.keys(req.body) },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'User updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  })
})

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    })
  }

  // Soft delete user and associated data
  await Promise.all([
    User.findByIdAndUpdate(user._id, { isActive: false }),
    Upload.updateMany({ userId: user._id }, { isActive: false }),
    Chart.updateMany({ userId: user._id }, { isActive: false })
  ])

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'admin_delete_user',
    resourceType: 'user',
    resourceId: user._id,
    metadata: { deletedUser: { name: user.name, email: user.email } },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'User deleted successfully'
  })
})

// @desc    Get comprehensive system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = asyncHandler(async (req, res) => {
  const timeRange = req.query.timeRange || '30d'
  const startDate = new Date()
  
  // Calculate date range
  switch (timeRange) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    default:
      startDate.setDate(startDate.getDate() - 30)
  }

  // Get basic statistics
  const [
    totalUsers,
    activeUsers,
    totalUploads,
    totalCharts,
    recentUsers,
    storageUsed
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ 
      isActive: true,
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }),
    Upload.countDocuments({ isActive: true }),
    Chart.countDocuments({ isActive: true }),
    User.countDocuments({ 
      createdAt: { $gte: startDate },
      isActive: true 
    }),
    Upload.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ])
  ])

  // Get user growth data
  const userGrowthData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])

  // Get upload statistics
  const uploadStats = await Upload.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])

  // Get chart type distribution
  const chartTypeDistribution = await Chart.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$chartType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])

  // Get recent activity
  const recentActivity = await Analytics.find()
    .populate('userId', 'name email')
    .sort({ timestamp: -1 })
    .limit(20)
    .select('action timestamp metadata userId')

  // Get top users by activity
  const topUsers = await Analytics.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$userId',
        activityCount: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $match: {
        'user.isActive': true
      }
    },
    {
      $sort: { activityCount: -1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        name: '$user.name',
        email: '$user.email',
        activityCount: 1,
        lastActivity: 1
      }
    }
  ])

  // System performance metrics
  const systemMetrics = {
    cpuUsage: Math.round(Math.random() * 100), // In real app, use actual system metrics
    memoryUsage: Math.round(Math.random() * 100),
    storageUsage: storageUsed[0]?.total || 0,
    networkIO: Math.round(Math.random() * 100),
    uptime: process.uptime()
  }

  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      totalUploads,
      totalCharts,
      recentUsers,
      storageUsed: storageUsed[0]?.total || 0
    },
    charts: {
      userGrowth: userGrowthData,
      uploadStats,
      chartTypeDistribution
    },
    recentActivity,
    topUsers,
    systemMetrics,
    timeRange
  })
})

// @desc    Get all uploads with filtering
// @route   GET /api/admin/uploads
// @access  Private (Admin)
export const getUploads = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search || ''
  const status = req.query.status || ''
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
  const skip = (page - 1) * limit

  // Build query
  let query = { isActive: true }
  
  if (search) {
    query.originalName = { $regex: search, $options: 'i' }
  }
  
  if (status) {
    query.processingStatus = status
  }

  const uploads = await Upload.find(query)
    .populate('userId', 'name email')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)

  const total = await Upload.countDocuments(query)

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

// @desc    Get all charts with filtering
// @route   GET /api/admin/charts
// @access  Private (Admin)
export const getCharts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search || ''
  const chartType = req.query.chartType || ''
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
  const skip = (page - 1) * limit

  // Build query
  let query = { isActive: true }
  
  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }
  
  if (chartType) {
    query.chartType = chartType
  }

  const charts = await Chart.find(query)
    .populate('userId', 'name email')
    .populate('uploadId', 'originalName')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)

  const total = await Chart.countDocuments(query)

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

// @desc    Bulk delete operations
// @route   POST /api/admin/bulk-delete
// @access  Private (Admin)
export const bulkDelete = asyncHandler(async (req, res) => {
  const { type, ids } = req.body

  if (!type || !ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid bulk delete request'
    })
  }

  let result
  switch (type) {
    case 'users':
      // Prevent admin from deleting themselves
      const filteredIds = ids.filter(id => id !== req.user._id.toString())
      result = await User.updateMany(
        { _id: { $in: filteredIds } },
        { isActive: false }
      )
      // Also deactivate associated data
      await Promise.all([
        Upload.updateMany({ userId: { $in: filteredIds } }, { isActive: false }),
        Chart.updateMany({ userId: { $in: filteredIds } }, { isActive: false })
      ])
      break
    case 'uploads':
      result = await Upload.updateMany(
        { _id: { $in: ids } },
        { isActive: false }
      )
      break
    case 'charts':
      result = await Chart.updateMany(
        { _id: { $in: ids } },
        { isActive: false }
      )
      break
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk delete type'
      })
  }

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: `admin_bulk_delete_${type}`,
    resourceType: 'system',
    metadata: { deletedCount: result.modifiedCount, ids },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: `${result.modifiedCount} ${type} deleted successfully`,
    deletedCount: result.modifiedCount
  })
})

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
export const getSettings = asyncHandler(async (req, res) => {
  // In a real application, these would come from a settings collection
  const settings = {
    general: {
      appName: 'Excel Analytics Platform',
      maxFileSize: process.env.MAX_FILE_SIZE || 10485760,
      sessionTimeout: 60,
      defaultChartType: 'bar',
      maintenanceMode: false
    },
    security: {
      jwtExpiration: process.env.JWT_EXPIRE || '7d',
      rateLimit: 100,
      require2FA: false,
      logFailedAttempts: true,
      emailAlerts: true
    },
    email: {
      smtpHost: process.env.EMAIL_HOST || '',
      smtpPort: process.env.EMAIL_PORT || 587,
      fromEmail: process.env.EMAIL_USER || '',
      welcomeEmail: true,
      securityAlerts: true,
      systemAlerts: true
    }
  }

  res.json({
    success: true,
    settings
  })
})

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
export const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body

  // In a real application, you would save these to a settings collection
  // For now, we'll just return success

  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'admin_update_settings',
    resourceType: 'system',
    metadata: { updatedSettings: Object.keys(settings) },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Settings updated successfully',
    settings
  })
})