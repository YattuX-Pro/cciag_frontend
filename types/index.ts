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
}

export enum Status {
  A_PAYER = "A_PAYER",
  PAYE = "PAYE",
  ANNULE = "ANNULE"
}

export interface DocumentItem{
  id: number;
  name: string;
  document: string;
  merchant_id: number;
}

export interface MerchantDocument {
  merchant_id: number;
  documents: DocumentItem[];
}

