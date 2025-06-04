// utils/axiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: '', // 设置 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    // 统一处理错误
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// 封装请求方法
export const axiosRequest = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
};