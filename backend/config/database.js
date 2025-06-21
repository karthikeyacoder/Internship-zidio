import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    // Default MongoDB URI if not provided
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel-analytics'
    
    console.log('Attempting to connect to MongoDB...')
    console.log('MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')) // Hide credentials in logs
    
    // Validate URI format
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://')
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    })
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    return conn
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running on your system')
      console.error('   - Install MongoDB: https://www.mongodb.com/try/download/community')
      console.error('   - Start MongoDB service')
      console.error('   - Or use MongoDB Atlas: https://www.mongodb.com/atlas')
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your MongoDB credentials in environment variables')
    }
    
    if (error.message.includes('Invalid scheme')) {
      console.error('💡 Check your MONGODB_URI format. It should start with mongodb:// or mongodb+srv://')
    }
    
    // Don't exit in development, allow for MongoDB to be started later
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Exiting due to database connection failure in production')
      process.exit(1)
    } else {
      console.log('🔄 Continuing without database connection (development mode)')
      console.log('   Start MongoDB and restart the server when ready')
    }
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB')
})

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('🚨 MongoDB error:', err.message)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    console.log('🛑 MongoDB connection closed through app termination')
    process.exit(0)
  } catch (error) {
    console.error('Error during graceful shutdown:', error)
    process.exit(1)
  }
})