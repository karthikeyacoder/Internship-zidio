import React, { useState, useEffect } from 'react'
import { Search, Download, Trash2, FileSpreadsheet, Eye } from 'lucide-react'
import { adminAPI } from '../services/adminAPI.jsx'
import toast from 'react-hot-toast'

const FileManagement = () => {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFiles, setSelectedFiles] = useState([])

  useEffect(() => {
    loadUploads()
  }, [currentPage])

  const loadUploads = async () => {
    try {
      setLoading(true)
      const result = await adminAPI.getUploads(currentPage, 10)
      setUploads(result.uploads || [])
      setTotalPages(Math.ceil((result.total || 0) / 10))
    } catch (error) {
      console.error('Failed to load uploads:', error)
      toast.error('Failed to load file data')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === uploads.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploads.map(upload => upload._id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) return

    try {
      await adminAPI.bulkDelete('uploads', selectedFiles)
      toast.success(`${selectedFiles.length} files deleted successfully`)
      setSelectedFiles([])
      loadUploads()
    } catch (error) {
      toast.error('Failed to delete files')
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
          <p className="text-gray-600">Monitor and manage uploaded Excel files</p>
        </div>
        {selectedFiles.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="btn-danger flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedFiles.length})</span>
          </button>
        )}
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="bg-brown/10 p-3 rounded-full">
              <FileSpreadsheet className="text-brown" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Download className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Files</p>
              <p className="text-2xl font-bold text-gray-900">{uploads.filter(u => u.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="input-field pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === uploads.length && uploads.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rows
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploads.map((upload) => (
                <tr key={upload._id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(upload._id)}
                      onChange={() => handleSelectFile(upload._id)}
                      className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-brown/10 p-2 rounded mr-3">
                        <FileSpreadsheet className="text-brown" size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {upload.originalName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {upload.columns?.length} columns
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.userId?.email || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(upload.fileSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.rowCount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      upload.processingStatus === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : upload.processingStatus === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : upload.processingStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {upload.processingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(upload.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-brown hover:text-brown-dark">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileManagement