import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, File, X, Check } from 'lucide-react'
import { uploadService } from '../services/uploadService.jsx'
import toast from 'react-hot-toast'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a valid Excel file (.xls or .xlsx)')
      return
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
  }

  const uploadFile = async () => {
    if (!file) return

    try {
      setUploading(true)
      const result = await uploadService.uploadExcel(file, (progress) => {
        setUploadProgress(progress)
      })
      
      toast.success('File uploaded successfully!')
      
      // Navigate to analytics page with the upload data
      navigate('/analytics', { 
        state: { 
          uploadId: result.upload._id,
          uploadData: result.upload 
        }
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Excel File</h1>
        <p className="text-gray-600">
          Upload your Excel file to start analyzing and creating beautiful charts
        </p>
      </div>

      <div className="card p-8">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-brown bg-brown/5'
                : 'border-gray-300 hover:border-brown hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop your Excel file here
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse and select a file
            </p>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-primary cursor-pointer"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-400 mt-4">
              Supported formats: .xls, .xlsx (Max size: 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Preview */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-brown/10 p-2 rounded">
                  <File className="text-brown" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • Excel File
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brown h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={removeFile}
                disabled={uploading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={uploadFile}
                disabled={uploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Supported Formats</h4>
            <ul className="space-y-1">
              <li>• Excel 2007+ (.xlsx)</li>
              <li>• Excel 97-2003 (.xls)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">File Requirements</h4>
            <ul className="space-y-1">
              <li>• Maximum file size: 10MB</li>
              <li>• Data should be in tabular format</li>
              <li>• First row should contain column headers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload