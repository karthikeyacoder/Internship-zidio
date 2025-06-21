import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

// Load environment variables
dotenv.config()

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin seeding process...')
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/excel-analytics'
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    // Admin credentials from environment or defaults
    const adminData = {
      name: process.env.ADMIN_NAME || 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@excelanalytics.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email })
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminData.email)
      
      // Update existing admin
      existingAdmin.name = adminData.name
      existingAdmin.role = 'admin'
      existingAdmin.isActive = true
      existingAdmin.emailVerified = true
      
      // Only update password if it's provided and different
      if (adminData.password && adminData.password !== 'admin123') {
        const salt = await bcrypt.genSalt(12)
        existingAdmin.password = await bcrypt.hash(adminData.password, salt)
        console.log('🔐 Updated admin password')
      }
      
      await existingAdmin.save()
      console.log('✅ Updated existing admin user')
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(12)
      adminData.password = await bcrypt.hash(adminData.password, salt)
      
      const admin = new User(adminData)
      await admin.save()
      console.log('✅ Created new admin user')
    }

    console.log('\n🎉 Admin seeding completed successfully!')
    console.log('📧 Admin Email:', adminData.email)
    console.log('🔑 Admin Password:', process.env.ADMIN_PASSWORD || 'admin123')
    console.log('🌐 Admin Panel URL: http://localhost:3001')
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!')
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running:')
      console.error('   - Start MongoDB service')
      console.error('   - Or check your MONGODB_URI in .env file')
    }
    
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin()
}

export default seedAdmin