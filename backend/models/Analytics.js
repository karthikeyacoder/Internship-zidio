import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'register',
      'upload_file',
      'create_chart',
      'download_chart',
      'delete_upload',
      'delete_chart',
      'profile_update'
    ]
  },
  resourceType: {
    type: String,
    enum: ['user', 'upload', 'chart', 'system'],
    default: 'system'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // Using custom timestamp field
})

// Indexes for performance
analyticsSchema.index({ userId: 1, timestamp: -1 })
analyticsSchema.index({ action: 1, timestamp: -1 })
analyticsSchema.index({ resourceType: 1, resourceId: 1 })

// Static method to log activity
analyticsSchema.statics.logActivity = async function(data) {
  try {
    return await this.create(data)
  } catch (error) {
    console.error('Failed to log analytics:', error)
  }
}

// Static method to get user activity summary
analyticsSchema.statics.getUserActivitySummary = async function(userId, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])
}

export default mongoose.model('Analytics', analyticsSchema)