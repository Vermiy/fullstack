import { API_CONFIG, getApiUrl, getAxiosConfig } from "@/src/config/api";
import { IBook } from "@/src/types/BookType";
import axios from "axios";

export async function GetAllBooks() {
  return (await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS), getAxiosConfig())).data;
}

export async function GetBookById(id: string | string[]): Promise<IBook> {
  const bookId = Array.isArray(id) ? id[0] : id;
  return (await axios.get(`${getApiUrl(API_CONFIG.ENDPOINTS.BOOKS)}/${bookId}`, getAxiosConfig()))
    .data;
}

type CreateBookPayload = Pick<IBook, "name" | "author" | "pageCount">;

export async function CreateBook(payload: CreateBookPayload) {
  return (await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS), payload, getAxiosConfig())).data;
}

type UpdateBookPayload = Partial<Pick<IBook, "name" | "author" | "pageCount">>;

export async function UpdateBook(id: number, payload: UpdateBookPayload) {
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.BOOKS)}/${id}`;

  try {
    return (await axios.patch(url, payload, getAxiosConfig())).data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 405) {
      return (await axios.put(url, payload, getAxiosConfig())).data;
    }

    throw error;
  }
}

export async function DeleteBook(id: number) {
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.BOOKS)}/${id}`;
  return (await axios.delete(url, getAxiosConfig())).data;
}
