import { Address, MerchantEnrollment, User, MerchantPayment, MerchantDocument, DocumentItem, MerchantEnrollementHistory, EnrollementStatistics, DetailedStatistics, Activity, SubActivity, Entreprise, MerchantEnrollmentSubmission } from "@/types";
import { deleter, fetcher, poster, updater } from "./fetcher";

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


export const getMerchantDocuments = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<MerchantDocument>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/merchants/documents/?${queryString}`);
  return extractPaginationParams(response);
};

export const getMerchantDocumentDetail = (id: number): Promise<Address> => 
  fetcher(`/api/merchants/documents/${id}`);

export const createMerchantDocument= (body: MerchantDocument): Promise<any> => 
  poster('/api/merchants/documents/', body);

export const getMerchantDocumentByMerchantId = (merchant_id: number): Promise<Array<DocumentItem>> => 
  fetcher(`/api/merchant-documents/${merchant_id}`);

export const deleteMerchantDocument = (merchant_id: number, document_id: number): Promise<any> => 
  deleter(`/api/merchants/${merchant_id}/documents/${document_id}`);

export const getMerchantEnrollementHistory = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<MerchantEnrollementHistory>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/statistics/merchant-history/?${queryString}`);
  return extractPaginationParams(response);
};

export const getMerchantStatistics = async (): Promise<EnrollementStatistics> => {
  const response = await fetcher(`/statistics/`);
  return response;
}

export const getMerchantDetailedStatistics = async (): Promise<DetailedStatistics> => {
  const response = await fetcher(`/statistics/detailed-statistics/`);
  return response;
}

export const getActivities = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Activity>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/activities/?${queryString}`);
  return extractPaginationParams(response);
};

export const getActivityDetail = (id: number): Promise<Activity> => 
  fetcher(`/api/activities/${id}`);

export const createActivity = (body: Activity): Promise<any> => 
  poster('/api/activities/', body);

export const updateActivity = (body: Activity, id: number): Promise<any> => 
  updater(`/api/activities/${id}`, body);

export const getSubActivities = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<SubActivity>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/subactivities/?${queryString}`);
  return extractPaginationParams(response);
};

export const getSubActivityDetail = (id: number): Promise<SubActivity> => 
  fetcher(`/api/subactivities/${id}`);

export const createSubActivity = (body: SubActivity): Promise<any> => 
  poster('/api/subactivities/', body);

export const updateSubActivity = (body: SubActivity, id: number): Promise<any> => 
  updater(`/api/subactivities/${id}`, body);

export const getEntreprises = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Entreprise>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/entreprises/?${queryString}`);
  return extractPaginationParams(response);
};

export const getEntrepriseDetail = (id: number): Promise<Entreprise> => 
  fetcher(`/api/entreprises/${id}`);

export const createEntreprise = (body: Entreprise): Promise<any> => 
  poster('/api/entreprises/', body);

export const updateEntreprise = (body: Entreprise, id: number): Promise<any> => 
  updater(`/api/entreprises/${id}`, body);

export const createEnrollement = (body: MerchantEnrollmentSubmission): Promise<any> => 
  poster('/api/merchants/create/', body);
