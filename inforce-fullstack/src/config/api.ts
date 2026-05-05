export const API_CONFIG = {
  BASE_URL: (() => {
    return "http://localhost:3000";
  })(),

  ENDPOINTS: {
    BOOKS: "/api/books",
    USERS: "/api/users",

    ME: "/api/auth/me",
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = (): Record<string, string> => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
  };
};

export const getAxiosConfig = (headers?: Record<string, string>) => {
  return {
    withCredentials: true,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...headers,
    },
  };
};
