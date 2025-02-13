import axios from "axios";
import { AuthActions } from "@/app/(auth)/utils";
import Cookies from 'js-cookie';

const { handleJWTRefresh, storeToken, getToken } = AuthActions();
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { access } = (await handleJWTRefresh()).data as { access: string };
        storeToken(access, "access");
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (err) {
        window.location.replace("/login");
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export const fetcher = async (url: string): Promise<any> => {
  const response = await api.get(url);
  return response.data;
};

export const poster = async (url: string, body: any): Promise<any> => {
  const response = await api.post(url, body);
  return response.data;
};

export const updater = async (url: string, body: any): Promise<any> => {
  const response = await api.put(url, body);
  return response.data;
};

export const deleter = async (url: string): Promise<any> => {
  const response = await api.delete(url);
  return response.data;
};

