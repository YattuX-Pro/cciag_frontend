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

const storeToken = (token: string, type: "access" | "refresh") => {
  Cookies.set(type + "Token", token);
};

const getToken = (type: string) => {
  return Cookies.get(type + "Token");
};

const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
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
  return api.post("/auth/jwt/create", { email, password });
};

const logout = () => {
  const refreshToken = getToken("refresh");
  removeTokens();
  return api.post("/auth/logout/", { refresh: refreshToken });
};

const handleJWTRefresh = () => {
  const refreshToken = getToken("refresh");
  return api.post("/auth/jwt/refresh", { refresh: refreshToken });
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
  };
};
