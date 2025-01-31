import { User } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Accept": "application/json",
  },
});

const storeToken = (token: string, type: "access" | "refresh" | "userRole") => {
  Cookies.set(type + "Token", token);
};

const getToken = (type: string) => {
  return Cookies.get(type + "Token");
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decodedToken: { user_id: string } = jwtDecode(token);
    return decodedToken.user_id || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const isAuthenticated = (): boolean => {
  const accessToken = getToken("access");
  const role = getToken("userRole");
  
  if (!accessToken || !role) {
    return false;
  }
  
  return !isTokenExpired(accessToken);
};

const getUserRoleFromToken = (token: string): string | null => {
  try {

    const decodedToken: { role: string } = jwtDecode(token);
    return decodedToken.role || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("userRoleToken");
};

const isTokenExpired = (token: string) => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token", error);
    return true;
  }
};

const register = (email: string, username: string, password: string) => {
  return api.post("/auth/users/", { email, username, password });
};

const login = (email: string, password: string) => {
  return api.post("/token", { email, password });
};

const logout = () => {
  const refreshToken = getToken("refresh");
  removeTokens();
  return api.post("/auth/logout/", { refresh: refreshToken });
};

const handleJWTRefresh = () => {
  const refreshToken = getToken("refresh");
  return api.post("/token/refresh/", { refresh: refreshToken });
};

const resetPassword = (email: string) => {
  return api.post("/auth/users/reset_password/", { email });
};

const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string
) => {
  return api.post("/auth/users/reset_password_confirm/", {
    uid,
    token,
    new_password,
    re_new_password,
  });
};

export const AuthActions = () => {
  return {
    login,
    resetPasswordConfirm,
    handleJWTRefresh,
    register,
    resetPassword,
    storeToken,
    getToken,
    logout,
    removeTokens,
    isTokenExpired,
    getUserIdFromToken,
    getUserRoleFromToken,
    isAuthenticated
  };
};
