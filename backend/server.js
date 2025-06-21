import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import { connectDB } from './config/database.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import chartRoutes from './routes/chart.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

console.log('🚀 Starting Excel Analytics Platform Backend...')
console.log('📍 Environment:', process.env.NODE_ENV || 'development')

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_PATH || './uploads'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Created uploads directory:', uploadsDir)
}

// Connect to MongoDB
connectDB()

// Trust proxy for rate limiting
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable CSP for now to avoid issues
}))

// CORS configuration - Very permissive for debugging
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for debugging
    console.log('🌐 Request from origin:', origin)
    callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  console.log('🔄 Preflight request for:', req.path)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

// Rate limiting - Disabled for debugging
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // Very high limit for debugging
  skip: () => true, // Skip rate limiting for now
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
})

app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static files
app.use('/uploads', express.static(uploadsDir))

// Request logging middleware - Enhanced
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2))
  }
  next()
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/chart', chartRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)

// Health check endpoint - Enhanced for debugging
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    pid: process.pid,
    database: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    environment_variables: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGODB_URI_SET: !!process.env.MONGODB_URI,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      ADMIN_EMAIL_SET: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD
    }
  }
  
  res.status(200).json(healthCheck)
})

// Debug endpoint for testing
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent'),
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  })
})

// Test registration endpoint
app.post('/api/test-register', (req, res) => {
  console.log('🧪 Test registration endpoint hit')
  console.log('Body received:', req.body)
  
  res.json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  })
})

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Excel Analytics Platform API',
    version: '1.0.0',
    description: 'Backend API for Excel Analytics Platform',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      upload: '/api/upload', 
      chart: '/api/chart',
      user: '/api/user',
      admin: '/api/admin',
      health: '/api/health',
      debug: '/api/debug',
      testRegister: '/api/test-register'
    },
    documentation: '/api/docs'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Excel Analytics Platform API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      health: '/api/health',
      debug: '/api/debug'
    }
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware - Enhanced for debugging
app.use((err, req, res, next) => {
  console.error('🚨 Error occurred:', err)
  console.error('Stack trace:', err.stack)
  
  let error = { ...err }
  error.message = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = { message, statusCode: 401 }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = { message, statusCode: 401 }
  }

  const response = {
    success: false,
    message: error.message || 'Server Error',
    error: {
      name: err.name,
      message: err.message,
      statusCode: error.statusCode || 500
    }
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(error.statusCode || 500).json(response)
})

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Server started successfully!')
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 API URL: http://localhost:${PORT}/api`)
  console.log(`🌐 Frontend: http://localhost:3000`)
  console.log(`⚙️  Admin: http://localhost:3001`)
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`)
  console.log(`📁 Uploads: ${uploadsDir}`)
  console.log('✅ Ready to accept connections!')
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  
  server.close(() => {
    console.log('🛑 HTTP server closed.')
    process.exit(0)
  })
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('🚨 Unhandled Promise Rejection:', err.message)
  console.error('Stack:', err.stack)
  if (process.env.NODE_ENV === 'production') {
    server.close(() => {
      process.exit(1)
    })
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message)
  console.error('Stack:', err.stack)
  if (process.env.NODE_ENV === 'production') {
    process.exit(1)
  }
})

export default app