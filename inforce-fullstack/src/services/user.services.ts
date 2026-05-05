import { API_CONFIG, getApiUrl, getAxiosConfig } from "@/src/config/api";
import { IUser } from "@/src/types/UserType";
import { IUserRole } from "@/src/types/UserRoles";
import axios from "axios";

type UserApiResponse = {
  id: number;
  name: string;
  email: string;
  role?: IUserRole | string;
  roles?: Array<IUserRole | string>;
};

function normalizeUser(user: UserApiResponse): IUser {
  const roles = user.roles ?? (user.role ? [user.role] : []);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: roles.map((role) => role as IUserRole),
  };
}

export async function GetAllUsers() {
  const data: UserApiResponse[] = (
    await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.USERS), getAxiosConfig())
  ).data;
  return data.map(normalizeUser);
}

export async function GetUserById(id: string | string[]): Promise<IUser> {
  const userId = Array.isArray(id) ? id[0] : id;
  const data: UserApiResponse = (
    await axios.get(`${getApiUrl(API_CONFIG.ENDPOINTS.USERS)}/${userId}`, getAxiosConfig())
  ).data;
  return normalizeUser(data);
}

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export async function CreateUser(payload: CreateUserPayload) {
  return (await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.USERS), payload, getAxiosConfig())).data;
}

type UpdateUserPayload = {
  name?: string;
  email?: string;
  role?: IUserRole;
  roles?: IUserRole[];
};

export async function UpdateUser(id: number, payload: UpdateUserPayload) {
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.USERS)}/${id}`;
  const requestPayload = {
    ...payload,
    ...(payload.role ? {} : payload.roles?.[0] ? { role: payload.roles[0] } : {}),
  };

  delete requestPayload.roles;

  try {
    return (await axios.patch(url, requestPayload, getAxiosConfig())).data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 405) {
      return (await axios.put(url, requestPayload, getAxiosConfig())).data;
    }

    throw error;
  }
}

export async function DeleteUser(id: number) {
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.USERS)}/${id}`;
  return (await axios.delete(url, getAxiosConfig())).data;
}
