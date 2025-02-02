import { User } from "@/types";
import { fetcher, poster, updater } from "./fetcher";
import { defaultPagination } from "@/types/const";

interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const generateQueryString = (params: Record<string, any> = {}) => {
  return new URLSearchParams(params).toString();
};

const extractPaginationParams = (response: DjangoPaginatedResponse<any>) => {
  if (response.next) {
    const nextUrl = new URL(response.next);
    response.next = nextUrl.searchParams.toString();
  }
  if (response.previous) {
    const prevUrl = new URL(response.previous);
    response.previous = prevUrl.searchParams.toString();
  }
  return response;
};

export const getUsers = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<User>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/users/?${queryString}`);
  return extractPaginationParams(response);
};

export const createUser = (body: User): Promise<any> => poster('/api/users/', body);

export const updateUser = (body: User, id): Promise<any> => updater(`/api/users/${id}`, body);

export const getUserDetail = (id): Promise<User> => fetcher(`/api/users/${id}`);
