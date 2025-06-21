import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, LineChart, PieChart, ScatterChart, Download, Settings } from 'lucide-react'
import Chart from 'chart.js/auto'
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2'
import { chartService } from '../services/chartService.jsx'
import { uploadService } from '../services/uploadService.jsx'
import toast from 'react-hot-toast'

const Analytics = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [uploadData, setUploadData] = useState(null)
  const [selectedUpload, setSelectedUpload] = useState('')
  const [availableUploads, setAvailableUploads] = useState([])
  const [chartType, setChartType] = useState('bar')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [chartData, setChartData] = useState(null)
  const [chartTitle, setChartTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAvailableUploads()
    
    // If coming from upload page
    if (location.state?.uploadData) {
      setUploadData(location.state.uploadData)
      setSelectedUpload(location.state.uploadData._id)
      
      // Auto-select first two columns if available
      if (location.state.uploadData.columns?.length >= 2) {
        setXAxis(location.state.uploadData.columns[0])
        setYAxis(location.state.uploadData.columns[1])
      }
    }
  }, [location.state])

  useEffect(() => {
    if (uploadData && xAxis && yAxis) {
      generateChart()
    }
  }, [uploadData, xAxis, yAxis, chartType])

  const loadAvailableUploads = async () => {
    try {
      const result = await uploadService.getHistory(1, 50)
      setAvailableUploads(result.uploads || [])
    } catch (error) {
      console.error('Failed to load uploads:', error)
    }
  }

  const handleUploadChange = async (uploadId) => {
    if (!uploadId) return
    
    try {
      setLoading(true)
      const result = await uploadService.getUpload(uploadId)
      setUploadData(result)
      setSelectedUpload(uploadId)
      
      // Reset axis selections
      setXAxis('')
      setYAxis('')
      setChartData(null)
    } catch (error) {
      toast.error('Failed to load upload data')
    } finally {
      setLoading(false)
    }
  }

  const generateChart = () => {
    if (!uploadData || !xAxis || !yAxis) return

    const data = uploadData.data || []
    const xData = data.map(row => row[xAxis])
    const yData = data.map(row => {
      const value = parseFloat(row[yAxis])
      return isNaN(value) ? 0 : value
    })

    const colors = [
      '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3',
      '#D2691E', '#BC8F8F', '#F4A460', '#DAA520', '#B8860B'
    ]

    let chartConfig = {
      labels: xData.slice(0, 20), // Limit to first 20 data points for performance
      datasets: [{
        label: yAxis,
        data: yData.slice(0, 20),
        backgroundColor: chartType === 'pie' ? colors : colors[0],
        borderColor: colors[0],
        borderWidth: 2,
        tension: 0.4
      }]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: !!chartTitle,
          text: chartTitle
        }
      },
      scales: chartType !== 'pie' ? {
        x: {
          title: {
            display: true,
            text: xAxis
          }
        },
        y: {
          title: {
            display: true,
            text: yAxis
          }
        }
      } : {}
    }

    setChartData({ data: chartConfig, options })
  }

  const saveChart = async () => {
    if (!chartData || !uploadData) return

    try {
      setSaving(true)
      await chartService.generateChart({
        uploadId: uploadData._id,
        chartType,
        xAxis,
        yAxis,
        title: chartTitle || `${yAxis} by ${xAxis}`,
        config: chartData
      })
      toast.success('Chart saved successfully!')
    } catch (error) {
      toast.error('Failed to save chart')
    } finally {
      setSaving(false)
    }
  }

  const downloadChart = () => {
    if (!chartData) return

    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.download = `${chartTitle || 'chart'}.png`
      a.href = url
      a.click()
    }
  }

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart }
  ]

  const renderChart = () => {
    if (!chartData) return null

    const commonProps = {
      data: chartData.data,
      options: chartData.options,
      height: 400
    }

    switch (chartType) {
      case 'line':
        return <Line {...commonProps} />
      case 'pie':
        return <Pie {...commonProps} />
      case 'scatter':
        return <Scatter {...commonProps} />
      default:
        return <Bar {...commonProps} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Create interactive charts from your Excel data</p>
        </div>
        {chartData && (
          <div className="flex space-x-2">
            <button
              onClick={downloadChart}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={saveChart}
              disabled={saving}
              className="flex items-center space-x-2 btn-primary disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Settings size={16} />
              )}
              <span>{saving ? 'Saving...' : 'Save Chart'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Selection */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Select Data Source</h3>
            <select
              value={selectedUpload}
              onChange={(e) => handleUploadChange(e.target.value)}
              className="w-full input-field"
            >
              <option value="">Choose an upload...</option>
              {availableUploads.map((upload) => (
                <option key={upload._id} value={upload._id}>
                  {upload.originalName}
                </option>
              ))}
            </select>
            {selectedUpload && (
              <p className="text-xs text-gray-500 mt-2">
                {uploadData?.rowCount} rows • {uploadData?.columns?.length} columns
              </p>
            )}
          </div>

          {/* Chart Type Selection */}
          {uploadData && (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Chart Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setChartType(type.value)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                      chartType === type.value
                        ? 'border-brown bg-brown/10 text-brown'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon size={20} />
                    <span className="text-xs mt-1">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Axis Selection */}
          {uploadData && (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Axis Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X-Axis
                  </label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Select column...</option>
                    {uploadData.columns?.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y-Axis
                  </label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Select column...</option>
                    {uploadData.columns?.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Chart Title */}
          {uploadData && (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Chart Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Enter chart title..."
                  className="w-full input-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* Chart Display */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin"></div>
              </div>
            ) : !uploadData ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <BarChart3 size={64} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium">Select a data source to get started</p>
                <p className="text-sm">Choose an uploaded Excel file from the panel on the left</p>
              </div>
            ) : !xAxis || !yAxis ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Settings size={64} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium">Configure your chart</p>
                <p className="text-sm">Select X and Y axis columns to generate your chart</p>
              </div>
            ) : (
              <div className="h-96">
                {renderChart()}
              </div>
            )}
          </div>

          {/* Data Preview */}
          {uploadData && (
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {uploadData.columns?.slice(0, 10).map((column) => (
                        <th
                          key={column}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadData.data?.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {uploadData.columns?.slice(0, 10).map((column) => (
                          <td
                            key={column}
                            className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                          >
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Showing first 5 rows of {uploadData.rowCount} total rows
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics