import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Lấy các biến môi trường từ file .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// Cấu hình mặc định cho axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

// Tạo instance axios với cấu hình
const axiosInstance: AxiosInstance = axios.create(axiosConfig)

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      // Lỗi từ server (status code không phải 2xx)
      console.error('Response error:', error.response.status, error.response.data)

      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        // Xử lý logout hoặc refresh token
        localStorage.removeItem('token')
        // Có thể chuyển hướng đến trang đăng nhập
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Không nhận được response
      console.error('Request error:', error.request)
    } else {
      // Lỗi khi setup request
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
