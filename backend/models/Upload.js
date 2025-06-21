import mongoose from 'mongoose'

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadPath: {
    type: String,
    required: true
  },
  columns: [{
    type: String,
    required: true
  }],
  rowCount: {
    type: Number,
    required: true,
    min: 0
  },
  data: [{
    type: mongoose.Schema.Types.Mixed
  }],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  metadata: {
    sheetNames: [String],
    selectedSheet: String,
    dataTypes: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for performance
uploadSchema.index({ userId: 1, createdAt: -1 })
uploadSchema.index({ processingStatus: 1 })
uploadSchema.index({ isActive: 1 })

// Virtual for file URL
uploadSchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.filename}`
})

// Method to get data preview
uploadSchema.methods.getDataPreview = function(limit = 10) {
  return {
    columns: this.columns,
    rowCount: this.rowCount,
    sampleData: this.data.slice(0, limit),
    metadata: this.metadata
  }
}

export default mongoose.model('Upload', uploadSchema)