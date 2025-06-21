import React, { useState, useEffect } from 'react'
import { Users, FileSpreadsheet, BarChart3, TrendingUp, Activity, Server, Database, Zap, RefreshCw, Calendar } from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { adminAPI } from '../services/adminAPI.jsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('png')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await loadAnalytics()
      toast.success('Data refreshed successfully')
    } finally {
      setRefreshing(false)
    }
  }

  const downloadChart = async (chartId, chartTitle) => {
    try {
      const chartElement = document.getElementById(chartId)
      if (!chartElement) {
        toast.error('Chart not found')
        return
      }

      if (downloadFormat === 'png') {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false
        })
        
        const link = document.createElement('a')
        link.download = `${chartTitle.replace(/\s+/g, '_').toLowerCase()}.png`
        link.href = canvas.toDataURL()
        link.click()
        
        toast.success('Chart downloaded as PNG')
      } else if (downloadFormat === 'pdf') {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        })
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`${chartTitle.replace(/\s+/g, '_').toLowerCase()}.pdf`)
        
        toast.success('Chart downloaded as PDF')
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download chart')
    }
  }

  const StatCard = ({ icon: Icon, title, value, change, color = 'brown', trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className={`bg-${color}/10 p-2 sm:p-3 rounded-xl flex-shrink-0`}>
            <Icon className={`text-${color} w-5 h-5 sm:w-6 sm:h-6`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
          </div>
        </div>
        {change !== undefined && (
          <div className="text-right flex-shrink-0 ml-2">
            <p className={`text-xs sm:text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
            <p className="text-xs text-gray-500">vs last period</p>
          </div>
        )}
      </div>
    </div>
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#A0522D',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter'
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }

  const formatChartData = (data, label, color = '#A0522D') => {
    if (!data || data.length === 0) return { labels: [], datasets: [] }
    
    const labels = data.map(item => {
      if (item._id && typeof item._id === 'object') {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day || 1)
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: item._id.day ? 'numeric' : undefined,
          year: timeRange === '1y' ? 'numeric' : undefined
        })
      }
      return item._id || 'Unknown'
    })
    
    return {
      labels,
      datasets: [{
        label,
        data: data.map(item => item.count || 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    }
  }

  const formatBarData = (data, label, color = '#A0522D') => {
    if (!data || data.length === 0) return { labels: [], datasets: [] }
    
    const labels = data.map(item => {
      if (item._id && typeof item._id === 'object') {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day || 1)
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: item._id.day ? 'numeric' : undefined 
        })
      }
      return item._id || 'Unknown'
    })
    
    return {
      labels,
      datasets: [{
        label,
        data: data.map(item => item.count || 0),
        backgroundColor: color,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: `${color}dd`
      }]
    }
  }

  const formatDoughnutData = (data) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] }
    
    const colors = ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3', '#D2691E', '#BC8F8F']
    
    return {
      labels: data.map(item => item._id || 'Unknown'),
      datasets: [{
        data: data.map(item => item.count || 0),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverOffset: 8
      }]
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">System overview and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-brown text-white rounded-lg hover:bg-brown-dark transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={analytics?.stats?.totalUsers}
          change={12}
          color="brown"
        />
        <StatCard
          icon={FileSpreadsheet}
          title="Total Uploads"
          value={analytics?.stats?.totalUploads}
          change={8}
          color="blue-500"
        />
        <StatCard
          icon={BarChart3}
          title="Total Charts"
          value={analytics?.stats?.totalCharts}
          change={15}
          color="green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Users"
          value={analytics?.stats?.activeUsers}
          change={5}
          color="purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Growth</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">New user registrations over time</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                >
                  <option value="png">PNG</option>
                  <option value="pdf">PDF</option>
                </select>
                <button
                  onClick={() => downloadChart('user-growth-chart', 'User Growth')}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-brown text-white rounded-md hover:bg-brown-dark transition-colors"
                >
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div id="user-growth-chart" className="h-48 sm:h-64">
              <Line 
                data={formatChartData(analytics?.charts?.userGrowth, 'New Users')} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>

        {/* Upload Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upload Activity</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">File uploads per day</p>
              </div>
              <button
                onClick={() => downloadChart('upload-stats-chart', 'Upload Activity')}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-brown text-white rounded-md hover:bg-brown-dark transition-colors self-start sm:self-auto"
              >
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div id="upload-stats-chart" className="h-48 sm:h-64">
              <Bar 
                data={formatBarData(analytics?.charts?.uploadStats, 'Uploads')} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>

        {/* Chart Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Chart Types</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Distribution of chart types created</p>
              </div>
              <button
                onClick={() => downloadChart('chart-type-chart', 'Chart Types')}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-brown text-white rounded-md hover:bg-brown-dark transition-colors self-start sm:self-auto"
              >
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div id="chart-type-chart" className="h-48 sm:h-64">
              <Doughnut 
                data={formatDoughnutData(analytics?.charts?.chartTypeDistribution)} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                          size: 11,
                          family: 'Inter'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      borderColor: '#A0522D',
                      borderWidth: 1,
                      cornerRadius: 8,
                      padding: 12
                    }
                  },
                  animation: {
                    animateRotate: true,
                    duration: 1000
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Performance</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time system metrics</p>
              </div>
              <button
                onClick={() => downloadChart('system-performance-chart', 'System Performance')}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-brown text-white rounded-md hover:bg-brown-dark transition-colors self-start sm:self-auto"
              >
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div id="system-performance-chart" className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Server size={14} className="mr-2" />
                    CPU Usage
                  </span>
                  <span className="text-gray-900 font-medium">{analytics?.systemMetrics?.cpuUsage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-brown h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${analytics?.systemMetrics?.cpuUsage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Database size={14} className="mr-2" />
                    Memory Usage
                  </span>
                  <span className="text-gray-900 font-medium">{analytics?.systemMetrics?.memoryUsage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${analytics?.systemMetrics?.memoryUsage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Zap size={14} className="mr-2" />
                    Storage Used
                  </span>
                  <span className="text-gray-900 font-medium">{formatFileSize(analytics?.systemMetrics?.storageUsage || 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-gray-900">{formatUptime(analytics?.systemMetrics?.uptime || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Latest system events</p>
          </div>
          <div className="max-h-64 sm:max-h-96 overflow-y-auto">
            {analytics?.recentActivity?.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-brown/10 p-2 rounded-full flex-shrink-0">
                          <Activity size={12} className="text-brown" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {activity.userId?.name || 'System'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Most Active Users</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Users with highest activity</p>
          </div>
          <div className="max-h-64 sm:max-h-96 overflow-y-auto">
            {analytics?.topUsers?.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {analytics.topUsers.map((user, index) => (
                  <div key={user._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-brown/10 p-2 rounded-full flex-shrink-0">
                          <span className="text-brown font-medium text-xs">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {user.activityCount} actions
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <Users size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No user activity data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard