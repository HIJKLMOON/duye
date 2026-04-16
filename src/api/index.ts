import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { message, Modal } from 'antd';
import type { ApiResponse, LoginForm, LoginResponse, MenuItem } from '../types';
import { logout } from '../store/slices/authSlice';
import { store } from '../store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code === 200) {
      return response;
    }
    if (res.code === 401) {
      Modal.confirm({
        title: '提示',
        content: '登录已过期，请重新登录',
        okText: '去登录',
        cancelText: '取消',
        onOk() {
          store.dispatch(logout());
          window.location.href = '/login';
        },
      });
      return Promise.reject(new Error(res.message || '未登录'));
    }
    message.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message));
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        Modal.confirm({
          title: '提示',
          content: '登录已过期，请重新登录',
          okText: '去登录',
          cancelText: '取消',
          onOk() {
            store.dispatch(logout());
            window.location.href = '/login';
          },
        });
      } else if (status === 403) {
        message.error('没有权限访问');
      } else if (status === 500) {
        message.error('服务器错误');
      } else {
        message.error(error.response.data?.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.get<ApiResponse<T>>(url, config).then((res) => res.data);
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axiosInstance.delete<ApiResponse<T>>(url, config).then((res) => res.data);
  },
};

export const authApi = {
  login: (data: LoginForm) => request.post<LoginResponse>('/auth/login', data),
  logout: () => request.post('/auth/logout'),
  getUserInfo: () => request.get<{ user: any; menus: MenuItem[]; permissions: string[] }>('/auth/userInfo'),
};

export const userApi = {
  list: (params?: any) => request.get('/user/list', { params }),
  add: (data: any) => request.post('/user', data),
  update: (data: any) => request.put('/user', data),
  delete: (id: string) => request.delete(`/user/${id}`),
  detail: (id: string) => request.get(`/user/${id}`),
};

export const roleApi = {
  list: (params?: any) => request.get('/role/list', { params }),
  add: (data: any) => request.post('/role', data),
  update: (data: any) => request.put('/role', data),
  delete: (id: string) => request.delete(`/role/${id}`),
  detail: (id: string) => request.get(`/role/${id}`),
};

export const menuApi = {
  list: (params?: any) => request.get('/menu/list', { params }),
  add: (data: any) => request.post('/menu', data),
  update: (data: any) => request.put('/menu', data),
  delete: (id: string) => request.delete(`/menu/${id}`),
  detail: (id: string) => request.get(`/menu/${id}`),
};

export default axiosInstance;