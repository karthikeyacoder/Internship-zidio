import api from './api.jsx'

export const chartService = {
  generateChart: async (chartData) => {
    const response = await api.post('/chart/generate', chartData)
    return response.data
  },

  getUserCharts: async (page = 1, limit = 10) => {
    const response = await api.get(`/chart/user?page=${page}&limit=${limit}`)
    return response.data
  },

  getChart: async (id) => {
    const response = await api.get(`/chart/${id}`)
    return response.data.chart
  },

  updateChart: async (id, chartData) => {
    const response = await api.put(`/chart/${id}`, chartData)
    return response.data
  },

  deleteChart: async (id) => {
    const response = await api.delete(`/chart/${id}`)
    return response.data
  },

  downloadChart: async (id, format = 'png') => {
    const response = await api.post(`/chart/${id}/download`, { format }, {
      responseType: 'blob'
    })
    return response.data
  }
}