import User from '../models/User.js'
import Upload from '../models/Upload.js'
import Chart from '../models/Chart.js'
import Analytics from '../models/Analytics.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  })
})

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body

  const user = await User.findById(req.user._id)

  if (email && email !== user.email) {
    // Check if email is already taken
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      })
    }
  }

  // Update user
  user.name = name || user.name
  user.email = email || user.email

  await user.save()

  // Log analytics
  await Analytics.logActivity({
    userId: user._id,
    action: 'profile_update',
    resourceType: 'user',
    resourceId: user._id,
    metadata: { updatedFields: Object.keys(req.body) },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  })
})

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const [uploadCount, chartCount, recentActivity] = await Promise.all([
    Upload.countDocuments({ userId, isActive: true }),
    Chart.countDocuments({ userId, isActive: true }),
    Analytics.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action timestamp metadata')
  ])

  res.json({
    success: true,
    stats: {
      totalUploads: uploadCount,
      totalCharts: chartCount,
      recentActivity
    }
  })
})