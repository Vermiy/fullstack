import { API_CONFIG, getApiUrl, getAxiosConfig } from "@/src/config/api";
import { IUser } from "@/src/types/UserType";
import { IUserRole } from "@/src/types/UserRoles";
import axios from "axios";

type AuthUserResponse = {
  id: number;
  name: string;
  email: string;
  role?: IUserRole | string;
  roles?: Array<IUserRole | string>;
  accessToken?: string;
};

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

export function normalizeUser(user: AuthUserResponse): IUser {
  const roles = user.roles ?? (user.role ? [user.role] : []);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: roles.map((role) => role as IUserRole),
  };
}

async function requestCurrentUser() {
  return fetch(getApiUrl(API_CONFIG.ENDPOINTS.ME), {
    credentials: "include",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

export async function getCurrentUser() {
  let res = await requestCurrentUser();

  if (res.status === 401) {
    const refreshData = await Refresh();

    if (refreshData?.accessToken) {
      setAccessToken(refreshData.accessToken);
      res = await requestCurrentUser();
    }
  }

  if (res.status === 401 || res.status === 404) {
    clearAccessToken();
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await res.json();
  return normalizeUser(data.user ?? data);
}

export async function Login(data: { email: string; password: string }) {
  const res = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), data, getAxiosConfig());
  return res.data;
}

export async function SignUp(data: { name: string; email: string; password: string }) {
  const res = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP), data, getAxiosConfig());
  return res.data;
}

export async function Logout() {
  await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), undefined, getAxiosConfig());
  clearAccessToken();
}

export async function Refresh() {
  const res = await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.REFRESH),
    undefined,
    getAxiosConfig()
  );

  if (res.data?.accessToken) {
    setAccessToken(res.data.accessToken);
  }

  return res.data;
}
