/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig'

// Interface cho response data
interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// Class ApiService cung cấp các phương thức để gọi API
class ApiService {
  // GET request
  static async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  // POST request
  static async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data)
    return response.data
  }

  // PUT request
  static async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data)
    return response.data
  }

  // DELETE request
  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url)
    return response.data
  }

  // PATCH request
  static async patch<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data)
    return response.data
  }
}

export default ApiService
