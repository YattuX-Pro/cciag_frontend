export interface User {
  id: string;
  last_login: string; 
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  username: string;
  password: string;
  role: "administration" | string; 
  is_active: boolean;
  is_staff: boolean;
  groups: number[]; 
  user_permissions: number[]; 
}

export interface UserRole {
  name: string;
  value: string;
}

export interface UserStatus {
  name : string;
  value: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  signature: string;
  photo: string;
  status: 'active' | 'pending' | 'suspended' | 'approved' | 'denied';
  createdAt: string;
}

export interface IDCard {
  id: string;
  merchantId: string;
  merchantName: string;
  cardNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface CardHistory {
  id: string;
  cardId: string;
  merchantName: string;
  action: 'printed' | 'revoked' | 'renewed';
  actionDate: string;
  performedBy: string;
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}

export interface Address {
  id: number;
  name: string;
  created_at: string;
}


export interface MerchantPayment {
  id: number;
  merchant: number;
  merchant_details: MerchantEnrollment;
  amount: number;
  payment_date: string;
  status: string;
  created_at: string;
}


interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | number;
}


export interface MerchantEnrollment {
  id: number;
  card_number: string;
  id_card: string;
  user?: UserData;
  profile_photo: string;
  signature_photo: string;
  address: Address;
  address_id: number;
  status: Status; 
  created_at: string; 
  created_by?: UserData;
  submited_by: UserData;
  validated_by: UserData;
  printed_by: UserData;
  submited_by_id: number;
  validated_by_id: number;
  printed_by_id: number;
  payed_by_id: number;
  suspended_by_id: number;
  refused_by_id: number;
  is_active: boolean;
}

export enum Status {
  A_PAYER = "A_PAYER",
  PAYE = "PAYE",
  A_VALIDER = "A_VALIDER",
  VALIDE = "VALIDE",
  ANNULE = "ANNULE",
  SUSPENDU = "SUSPENDU",
  IMPRIME = "IMPRIME",
  RENOUVELE = "RENOUVELE",
  REFUSE = "REFUSE"
}

export interface DocumentItem{
  id: number;
  name: string;
  document: string;
  merchant_id: number;
}

export interface MerchantDocument {
  id: number;
  document:string;
  name: string;
}

// Statistiques

export interface UserDataForStatistic {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
}

export interface MerchantEnrollementHistory {
  id: number;
  user: UserDataForStatistic;
  card_number: string;
  profile_photo : string;
  signature_photo : string;
  address: Address;
  status: string;
  id_card: string;
  is_active: boolean;
  created_at: string;
  created_by: UserDataForStatistic | null;
  submited_by: UserDataForStatistic | null;
  validated_by: UserDataForStatistic | null;
  printed_by: UserDataForStatistic | null;
  payed_by: UserDataForStatistic | null;
  suspended_by: UserDataForStatistic | null;
  refused_by: UserDataForStatistic | null;
  documents: MerchantDocument[];
  payments: MerchantPayment[];
}

// Enrollement Statistics Interface
export interface UsersStatistics {
  total_users: number;
  last_month_users: number;
  percentage_last_month: number;
}

export interface ActiveMerchantsStatistics {
  total_active_merchants: number;
  last_month_active_merchants: number;
  percentage_last_month: number;
}

export interface PrintedMerchantsStatistics {
  total_printed_merchants: number;
  last_month_printed_merchants: number;
  percentage_last_month: number;
}

export interface ToValidateMerchantsStatistics {
  total_to_validate_merchants: number;
  last_month_to_validate_merchants: number;
  percentage_last_month: number;
}

export interface EnrollementStatistics {
  users_statistics: UsersStatistics;
  active_merchants_statistics: ActiveMerchantsStatistics;
  printed_merchants_statistics: PrintedMerchantsStatistics;
  to_validate_merchants_statistics: ToValidateMerchantsStatistics;
}

// Detailed Statistics Interface
export interface MerchantsByAddress {
  address_name: string;
  total_merchants: number;
}

export interface PaymentsByMonth {
  month: string;
  total_amount: number;
  payment_count: number;
}

export interface DetailedStatistics {
  merchants_by_address: MerchantsByAddress[];
  payments_by_month: PaymentsByMonth[];
}


