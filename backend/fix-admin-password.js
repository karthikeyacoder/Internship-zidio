import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

// Load environment variables
dotenv.config()

const fixAdminPassword = async () => {
  try {
    console.log('🔧 Fixing admin password...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find admin user
    const adminUser = await User.findOne({ 
      email: 'admin@excelanalytics.com',
      role: 'admin' 
    })

    if (!adminUser) {
      console.log('❌ Admin user not found! Creating new admin...')
      
      // Create new admin user with proper password hashing
      const newAdmin = new User({
        name: 'System Administrator',
        email: 'admin@excelanalytics.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin',
        isActive: true,
        emailVerified: true
      })
      
      await newAdmin.save()
      console.log('✅ New admin user created!')
    } else {
      console.log('✅ Admin user found, updating password...')
      
      // Update password - this will trigger the pre-save middleware to hash it
      adminUser.password = 'admin123'
      await adminUser.save()
      console.log('✅ Admin password updated!')
    }

    // Test the password
    const testUser = await User.findOne({ 
      email: 'admin@excelanalytics.com',
      role: 'admin' 
    }).select('+password')
    
    const isValid = await testUser.comparePassword('admin123')
    console.log('🔑 Password test result:', isValid)

    if (isValid) {
      console.log('🎉 Admin login should work now!')
    } else {
      console.log('❌ Password still not working')
    }

    console.log('\n📋 Admin Login Details:')
    console.log('Email: admin@excelanalytics.com')
    console.log('Password: admin123')
    console.log('Admin Panel URL: http://localhost:3001')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  }
}

fixAdminPassword()