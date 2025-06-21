import api from './api.jsx'

export const uploadService = {
  uploadExcel: async (file, onProgress) => {
    const formData = new FormData()
    formData.append('excel', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress?.(percentCompleted)
      }
    }

    const response = await api.post('/upload/excel', formData, config)
    return response.data
  },

  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/upload/history?page=${page}&limit=${limit}`)
    return response.data
  },

  getUpload: async (id) => {
    const response = await api.get(`/upload/${id}`)
    return response.data.upload
  },

  deleteUpload: async (id) => {
    const response = await api.delete(`/upload/${id}`)
    return response.data
  },

  downloadFile: async (id) => {
    const response = await api.get(`/upload/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}