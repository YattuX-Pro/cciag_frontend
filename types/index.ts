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