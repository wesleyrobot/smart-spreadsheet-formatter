import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadSpreadsheet = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/api/spreadsheet/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const transformData = async (data, transformations) => {
  return api.post('/api/spreadsheet/transform', { data, transformations })
}

export const getMLSuggestions = async (data) => {
  return api.post('/api/ml/suggestions', data)
}

export default api
