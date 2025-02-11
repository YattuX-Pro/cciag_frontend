import { Address, MerchantEnrollment, User, MerchantPayment } from "@/types";
import { fetcher, poster, updater } from "./fetcher";

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

export const resetPassword = (email: string): Promise<any> => 
  poster('/api/users/admin/reset_password', { email });

export const getMerchants = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<MerchantEnrollment>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/merchants/enrollements/?${queryString}`);
  return extractPaginationParams(response);
};

export const createMerchant = (body: MerchantEnrollment): Promise<any> => 
  poster('/api/merchants/enrollements/', body);

export const updateMerchant = (body: MerchantEnrollment, id: number): Promise<any> => 
  updater(`/api/merchants/enrollements/${id}`, body);

export const getMerchantDetail = (id: number): Promise<MerchantEnrollment> => 
  fetcher(`/api/merchants/enrollements/${id}`);

export const getMerchantPayments = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<MerchantPayment>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/merchants/payments/?${queryString}`);
  return extractPaginationParams(response);
};

export const createMerchantPayment = (body: MerchantPayment): Promise<any> => 
  poster('/api/merchants/payments/', body);

export const updateMerchantPayment = (body: MerchantPayment, id: number): Promise<any> => 
  updater(`/api/merchants/payments/${id}`, body);

export const getMerchantPaymentDetail = (id: number): Promise<MerchantPayment> => 
  fetcher(`/api/merchants/payments/${id}`);

export const getAddresses = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Address>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/addresses/?${queryString}`);
  return extractPaginationParams(response);
};

export const createAddress = (body: Address): Promise<any> => 
  poster('/api/addresses/', body);

export const updateAddress = (body: Address, id: number): Promise<any> => 
  updater(`/api/addresses/${id}`, body);

export const getAddressDetail = (id: number): Promise<Address> => 
  fetcher(`/api/addresses/${id}`);





