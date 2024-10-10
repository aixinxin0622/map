import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_HOME_API,
  timeout: 500000
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
