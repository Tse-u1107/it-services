import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// ================================
// Extend AxiosRequestConfig
// ================================

declare module 'axios' {
  export interface AxiosRequestConfig {
    requireAuth?: boolean; // <--- Add this to enable token injection
  }
}

// ================================
// Base URL & API Client
// ================================

export const baseUrl = '/';

export const homepageServiceList = '/home/services';

const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// ================================
// Request Interceptor
// ================================

apiClient.interceptors.request.use(
  (config) => {
    // Only attach token when explicitly requested
    if (config.requireAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// Response Interceptor
// ================================

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

// ================================
// fetchRequest<T> Wrapper
// ================================

export const fetchRequest = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient({
      ...config,
      url: endpoint,
      method: config?.method || 'GET',
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while fetching data';

      throw new Error(msg);
    }

    throw error;
  }
};
