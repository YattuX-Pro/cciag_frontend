import { Address, MerchantEnrollment, User, MerchantPayment, MerchantDocument, DocumentItem, MerchantEnrollementHistory, EnrollementStatistics, DetailedStatistics, Activity, SubActivity, Entreprise, MerchantEnrollmentSubmission, Tarification, ITypeAdhesion, WorkPosition, Nationality, MerchantRefusal, Prefecture, SubPrefecture, Region } from "@/types";
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

export const createActivity = (body: Activity): Promise<Activity> => 
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

export const createSubActivity = (body: SubActivity): Promise<SubActivity> => 
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

export const updateEntreprise = (body: Entreprise | FormData, id: number): Promise<any> => 
  updater(`/api/entreprises/${id}`, body);

export const createEnrollement = (body: MerchantEnrollmentSubmission): Promise<any> => 
  poster('/api/merchants/create/', body);

export const getTarifications = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Tarification>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/tarifications/?${queryString}`);
  return extractPaginationParams(response);
};

export const createTarification = (body: Tarification): Promise<any> => 
  poster('/api/tarifications/', body);

export const updateTarification = (body: Tarification, id: number): Promise<any> => 
  updater(`/api/tarifications/${id}`, body);

export const getTarificationDetail = (id: number): Promise<Tarification> => 
  fetcher(`/api/tarifications/${id}`);

export const deleteTarification = (id: number): Promise<any> => 
  deleter(`/api/tarifications/${id}`);

// Type Adhesion CRUD operations
export const getTypeAdhesions = (): Promise<any> =>
  fetcher('/api/type-adhesions/');

export const getTypeAdhesion = (id: number): Promise<any> =>
  fetcher(`/api/type-adhesions/${id}/`);

export const createTypeAdhesion = (data: ITypeAdhesion): Promise<any> =>
  poster('/api/type-adhesions/', data);

export const updateTypeAdhesion = (id: number, data: ITypeAdhesion): Promise<any> =>
  updater(`/api/type-adhesions/${id}/`, data);

export const deleteTypeAdhesion = (id: number): Promise<any> =>
  deleter(`/api/type-adhesions/${id}/`);

export const getWorkPositions = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<WorkPosition>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/work-positions/?${queryString}`);
  return extractPaginationParams(response);
};

export const getWorkPositionDetail = (id: number): Promise<WorkPosition> => 
  fetcher(`/api/work-positions/${id}`);

export const createWorkPosition = (body: WorkPosition): Promise<any> => 
  poster('/api/work-positions/', body);

export const updateWorkPosition = (body: WorkPosition, id: number): Promise<any> => 
  updater(`/api/work-positions/${id}`, body);

export const deleteWorkPosition = (id: number): Promise<any> => 
  deleter(`/api/work-positions/${id}`);

export const getNationalities = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Nationality>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/nationalities/?${queryString}`);
  return extractPaginationParams(response);
};

export const getNationalityDetail = (id: number): Promise<Nationality> => 
  fetcher(`/api/nationalities/${id}`);

export const createNationality = (body: Nationality): Promise<any> => 
  poster('/api/nationalities/', body);

export const updateNationality = (body: Nationality, id: number): Promise<any> => 
  updater(`/api/nationalities/${id}`, body);

export const deleteNationality = (id: number): Promise<any> => 
  deleter(`/api/nationalities/${id}`);

export const getMerchantRefusals = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<MerchantRefusal>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/merchant-refusals/?${queryString}`);
  return extractPaginationParams(response);
};

export const getMerchantRefusalDetail = (id: number): Promise<MerchantRefusal> => 
  fetcher(`/api/merchant-refusals/${id}`);

export const createMerchantRefusal = (body: MerchantRefusal): Promise<any> => 
  poster('/api/merchant-refusals/', body);

export const updateMerchantRefusal = (body: MerchantRefusal, id: number): Promise<any> => 
  updater(`/api/merchant-refusals/${id}`, body);

export const deleteMerchantRefusal = (id: number): Promise<any> => 
  deleter(`/api/merchant-refusals/${id}`);

export const getPrefectures = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Prefecture>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/prefectures/?${queryString}`);
  return extractPaginationParams(response);
};

export const getPrefectureDetail = (id: number): Promise<Prefecture> => 
  fetcher(`/api/prefectures/${id}`);

export const createPrefecture = (body: Prefecture): Promise<any> => 
  poster('/api/prefectures/', body);

export const updatePrefecture = (body: Prefecture, id: number): Promise<any> => 
  updater(`/api/prefectures/${id}`, body);

export const deletePrefecture = (id: number): Promise<any> => 
  deleter(`/api/prefectures/${id}`);

export const getSubPrefectures = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<SubPrefecture>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }

  const response = await fetcher(`/api/sub-prefectures/?${queryString}`);
  return extractPaginationParams(response);
};

export const getSubPrefectureDetail = (id: number): Promise<SubPrefecture> => 
  fetcher(`/api/sub-prefectures/${id}`);

export const createSubPrefecture = (body: SubPrefecture): Promise<any> => 
  poster('/api/sub-prefectures/', body);

export const updateSubPrefecture = (body: SubPrefecture, id: number): Promise<any> => 
  updater(`/api/sub-prefectures/${id}`, body);

export const deleteSubPrefecture = (id: number): Promise<any> => 
  deleter(`/api/sub-prefectures/${id}`);

export const getRegions = async (params: Record<string, any> = {}): Promise<DjangoPaginatedResponse<Region>> => {
  let queryString;
  if (params.url) {
    queryString = params.url;
  } else {
    queryString = generateQueryString(params);
  }
  const response = await fetcher(`/api/regions/?${queryString}`);
  return extractPaginationParams(response);
};

export const getRegionDetail = (id: number): Promise<Region> => 
  fetcher(`/api/regions/${id}`);

export const createRegion = (body: Region): Promise<any> => 
  poster('/api/regions/', body);

export const updateRegion = (body: Region, id: number): Promise<any> => 
  updater(`/api/regions/${id}`, body);

export const deleteRegion = (id: number): Promise<any> => 
  deleter(`/api/regions/${id}`);

// Statistics Endpoints

export const getFinancialStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/financial-enrollement-statistics/?${queryString}`);
};

export const getGeographicStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/geographic-statistics/?${queryString}`);
};

export const getActivityStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/activity-statistics/?${queryString}`);
};

export const getEnterpriseStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/enterprise-statistics/?${queryString}`);
};

export const getStatusStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/status-statistics/?${queryString}`);
};

export const getRequestTypeStatistics = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`statistics/request-type-statistics/?${queryString}`);
};


