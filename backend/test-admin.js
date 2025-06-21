import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

// Load environment variables
dotenv.config()

const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing admin login...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin user exists
    const adminUser = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@excelanalytics.com',
      role: 'admin' 
    }).select('+password')

    if (!adminUser) {
      console.log('❌ Admin user not found!')
      console.log('Creating admin user...')
      
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
      const newAdmin = new User({
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@excelanalytics.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        emailVerified: true
      })
      
      await newAdmin.save()
      console.log('✅ Admin user created successfully!')
    } else {
      console.log('✅ Admin user found:', adminUser.email)
      
      // Test password
      const testPassword = process.env.ADMIN_PASSWORD || 'admin123'
      const isPasswordValid = await adminUser.comparePassword(testPassword)
      console.log('🔑 Password test result:', isPasswordValid)
      
      if (!isPasswordValid) {
        console.log('🔧 Updating admin password...')
        const hashedPassword = await bcrypt.hash(testPassword, 12)
        adminUser.password = hashedPassword
        await adminUser.save()
        console.log('✅ Admin password updated!')
      }
    }

    console.log('\n📋 Admin Login Details:')
    console.log('Email:', process.env.ADMIN_EMAIL || 'admin@excelanalytics.com')
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123')
    console.log('Admin Panel URL: http://localhost:3001')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  }
}

testAdminLogin()