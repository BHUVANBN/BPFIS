import axios from 'axios'

// In development, use the full backend URL
const isDev = process.env.NODE_ENV === 'development'
const api = axios.create({
  baseURL: isDev ? 'http://localhost:5000/api/v1' : '/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri3-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // clear session and route to auth
      localStorage.removeItem('agri3-token')
      localStorage.removeItem('agri3-user')
      // naive redirect; app uses internal state, but this ensures recovery on hard refresh
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api
