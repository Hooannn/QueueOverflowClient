import axios from 'axios';
import { getI18n } from 'react-i18next';
import cookies from './cookies';
export const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'https://sevenfastfood-be.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const getAccessToken = () => cookies.get('access_token') || localStorage.getItem('access_token');

const refreshToken = async () =>
  new Promise<string | null>((resolve, reject) => {
    axiosIns({
      url: '/auth/refresh',
      method: 'POST',
      validateStatus: null,
      data: {
        refreshToken: cookies.get('refresh_token') || localStorage.getItem('refresh_token'),
      },
    })
      .then(res => {
        const token = res.data?.data;
        if (token) {
          cookies.set('access_token', token);
          resolve(token);
        } else {
          window.location.href = '/auth';
          resolve(null);
        }
      })
      .catch(error => {
        window.location.href = '/auth';
        reject(error);
      });
  });

axiosIns.interceptors.request.use(
  async config => {
    if (!config.headers['Authorization']) {
      const token = getAccessToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    const i18n = getI18n();
    if (config.params) config.params.locale = i18n.resolvedLanguage;
    else config.params = { locale: i18n.resolvedLanguage };
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosIns.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const token = await refreshToken();
      if (!token) throw new Error('REFRESH_FAILED');
      prevRequest.headers.Authorization = `Bearer ${token}`;
      return axiosIns({
        ...prevRequest,
        headers: prevRequest.headers.toJSON(),
      });
    }
    return Promise.reject(error);
  },
);

export default axiosIns;
