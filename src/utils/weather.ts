import axios from 'axios';
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_WEATHER_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
  // withCredentials:true
});

export default service;
