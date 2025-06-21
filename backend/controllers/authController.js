import User from '../models/User.js'
import Analytics from '../models/Analytics.js'
import { generateToken } from '../utils/jwt.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Check if user exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    })
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  })

  // Log analytics
  await Analytics.logActivity({
    userId: user._id,
    action: 'register',
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Generate token
  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check if user exists
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    })
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Update last login
  user.lastLogin = new Date()
  await user.save()

  // Log analytics
  await Analytics.logActivity({
    userId: user._id,
    action: 'login',
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Generate token
  const token = generateToken(user._id)

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    }
  })
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // Log analytics
  await Analytics.logActivity({
    userId: req.user._id,
    action: 'logout',
    resourceType: 'user',
    resourceId: req.user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.json({
    success: true,
    message: 'Logout successful'
  })
})

// @desc    Get user profile
// @route   GET /api/auth/profile
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
// @route   PUT /api/auth/profile
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this email'
    })
  }

  // In a real application, you would:
  // 1. Generate a reset token
  // 2. Save it to the user record with expiration
  // 3. Send email with reset link
  
  res.json({
    success: true,
    message: 'Password reset instructions sent to your email'
  })
})

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body

  // In a real application, you would:
  // 1. Verify the reset token
  // 2. Check if it's not expired
  // 3. Update the user's password
  
  res.json({
    success: true,
    message: 'Password reset successful'
  })
})