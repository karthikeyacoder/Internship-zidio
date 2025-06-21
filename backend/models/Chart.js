import mongoose from 'mongoose'

const chartSchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  chartType: {
    type: String,
    required: true,
    enum: ['bar', 'line', 'pie', 'scatter', '3d-bar', '3d-scatter']
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  customization: {
    colors: [String],
    fontSize: Number,
    showLegend: { type: Boolean, default: true },
    showGrid: { type: Boolean, default: true },
    animation: { type: Boolean, default: true }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for performance
chartSchema.index({ userId: 1, createdAt: -1 })
chartSchema.index({ uploadId: 1 })
chartSchema.index({ chartType: 1 })
chartSchema.index({ isPublic: 1, isActive: 1 })

// Method to increment download count
chartSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1
  return this.save()
}

// Method to generate chart summary
chartSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    chartType: this.chartType,
    createdAt: this.createdAt,
    downloadCount: this.downloadCount,
    thumbnail: this.thumbnail
  }
}

export default mongoose.model('Chart', chartSchema)