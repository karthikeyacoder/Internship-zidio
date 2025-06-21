import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileSpreadsheet, BarChart3, TrendingUp, Users, Calendar, Activity, Download, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { uploadService } from '../services/uploadService.jsx'
import { chartService } from '../services/chartService.jsx'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalCharts: 0,
    recentUploads: [],
    recentCharts: [],
    storageUsed: 0,
    thisMonthUploads: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [uploadsData, chartsData, userStats] = await Promise.all([
        uploadService.getHistory(1, 5),
        chartService.getUserCharts(1, 5),
        getUserStats()
      ])

      // Calculate this month's uploads
      const thisMonth = new Date()
      const thisMonthUploads = uploadsData.uploads?.filter(upload => {
        const uploadDate = new Date(upload.createdAt)
        return uploadDate.getMonth() === thisMonth.getMonth() && 
               uploadDate.getFullYear() === thisMonth.getFullYear()
      }).length || 0

      // Calculate storage used
      const storageUsed = uploadsData.uploads?.reduce((total, upload) => {
        return total + (upload.fileSize || 0)
      }, 0) || 0

      setStats({
        totalUploads: uploadsData.pagination?.total || 0,
        totalCharts: chartsData.pagination?.total || 0,
        recentUploads: uploadsData.uploads || [],
        recentCharts: chartsData.charts || [],
        storageUsed,
        thisMonthUploads,
        ...userStats
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getUserStats = async () => {
    try {
      // This would be an API call to get user-specific stats
      return {
        weeklyActivity: Math.floor(Math.random() * 50) + 10,
        completionRate: Math.floor(Math.random() * 30) + 70
      }
    } catch (error) {
      return { weeklyActivity: 0, completionRate: 0 }
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await loadDashboardData()
      toast.success('Dashboard refreshed')
    } finally {
      setRefreshing(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'brown', trend, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className={`bg-${color}/10 p-2 sm:p-3 rounded-xl flex-shrink-0`}>
            <Icon className={`text-${color} w-5 h-5 sm:w-6 sm:h-6`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className="text-right flex-shrink-0 ml-2">
            <p className={`text-xs sm:text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </p>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brown-light via-brown to-brown-dark text-white rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 lg:mb-0">
              Ready to analyze your data? Upload a new Excel file or continue with existing charts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-white text-brown font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              <Plus size={18} className="mr-2" />
              Upload New File
            </Link>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-brown transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <Activity size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={FileSpreadsheet}
          title="Total Uploads"
          value={stats.totalUploads}
          subtitle={`${stats.thisMonthUploads} this month`}
          trend={{ positive: true, value: 12 }}
          onClick={() => window.location.href = '/upload'}
        />
        <StatCard
          icon={BarChart3}
          title="Total Charts"
          value={stats.totalCharts}
          subtitle="Visualizations created"
          color="blue-500"
          trend={{ positive: true, value: 8 }}
          onClick={() => window.location.href = '/analytics'}
        />
        <StatCard
          icon={TrendingUp}
          title="Storage Used"
          value={formatFileSize(stats.storageUsed)}
          subtitle="Across all files"
          color="green-500"
        />
        <StatCard
          icon={Activity}
          title="Weekly Activity"
          value={stats.weeklyActivity || 0}
          subtitle="Actions this week"
          color="purple-500"
          trend={{ positive: true, value: 5 }}
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Uploads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Uploads</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Your latest Excel files</p>
              </div>
              <Link
                to="/upload"
                className="text-brown hover:text-brown-dark text-xs sm:text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="max-h-64 sm:max-h-80 overflow-y-auto">
            {stats.recentUploads.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {stats.recentUploads.map((upload) => (
                  <div key={upload._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-brown/10 p-2 rounded-lg flex-shrink-0">
                        <FileSpreadsheet className="text-brown w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {upload.originalName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDate(upload.createdAt)}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-xs text-gray-500">
                            {upload.rowCount?.toLocaleString()} rows
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          upload.processingStatus === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : upload.processingStatus === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {upload.processingStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <FileSpreadsheet className="mx-auto text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-gray-500 text-sm sm:text-base mb-2">No uploads yet</p>
                <Link
                  to="/upload"
                  className="text-brown hover:text-brown-dark text-xs sm:text-sm font-medium"
                >
                  Upload your first file
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Charts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Charts</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Your latest visualizations</p>
              </div>
              <Link
                to="/analytics"
                className="text-brown hover:text-brown-dark text-xs sm:text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="max-h-64 sm:max-h-80 overflow-y-auto">
            {stats.recentCharts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {stats.recentCharts.map((chart) => (
                  <div key={chart._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-brown/10 p-2 rounded-lg flex-shrink-0">
                        <BarChart3 className="text-brown w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {chart.title || 'Untitled Chart'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {chart.chartType}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-xs text-gray-500">
                            {formatDate(chart.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button className="p-1 text-gray-400 hover:text-brown transition-colors">
                          <Eye size={14} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-brown transition-colors">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <BarChart3 className="mx-auto text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-gray-500 text-sm sm:text-base mb-2">No charts yet</p>
                <Link
                  to="/analytics"
                  className="text-brown hover:text-brown-dark text-xs sm:text-sm font-medium"
                >
                  Create your first chart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/upload"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brown hover:bg-brown/5 transition-all duration-200 group"
          >
            <div className="bg-brown/10 p-3 rounded-lg mr-4 group-hover:bg-brown/20 transition-colors">
              <Plus className="text-brown w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Upload File</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Add new Excel data</p>
            </div>
          </Link>
          
          <Link
            to="/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brown hover:bg-brown/5 transition-all duration-200 group"
          >
            <div className="bg-brown/10 p-3 rounded-lg mr-4 group-hover:bg-brown/20 transition-colors">
              <BarChart3 className="text-brown w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Create Chart</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Visualize your data</p>
            </div>
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brown hover:bg-brown/5 transition-all duration-200 group"
          >
            <div className="bg-brown/10 p-3 rounded-lg mr-4 group-hover:bg-brown/20 transition-colors">
              <Users className="text-brown w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Manage Profile</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your settings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brown mb-2">{stats.totalUploads}</div>
            <div className="text-xs sm:text-sm text-gray-600">Files Uploaded</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2">{stats.totalCharts}</div>
            <div className="text-xs sm:text-sm text-gray-600">Charts Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">{stats.completionRate || 85}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard