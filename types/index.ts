export interface User {
  id?: number;
  last_login?: string; 
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: "administration" | string; 
  is_active?: boolean;
  is_staff?: boolean;
  groups?: number[]; 
  user_permissions?: number[]; 
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
  sub_prefecture_id: number;
  sub_prefecture: SubPrefecture;
  created_at: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type PaymentType = 'CASH' | 'ORANGE_MONEY' | 'BANK'; 

export interface MerchantPayment {
  id?: number;
  transaction_id?: string | null;
  payment_type: PaymentType;
  merchant_id: number;
  merchant?: MerchantEnrollment;
  amount: number;
  status?: PaymentStatus;
  payment_date?: string | null;
  paid_by?: UserData;
  bank?: string;
  banque_id?: number;
  banque?: Banque;
  created_at?: string;
  updated_at?: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | number;
}

export interface MerchantEnrollment {
  id?: number;
  user?: User;
  card_number?: string;
  status?: Status;
  profile_photo?: string;
  signature_photo?: string;
  address?: Address;
  address_id?: number;
  activities?: Activity[];
  activity_ids?: number[];
  sub_activities?: SubActivity[];
  sub_activity_ids?: number[];
  entreprise?: Entreprise;
  created_at?: string;
  created_by?: UserData;
  submited_by?: UserData;
  submited_by_id?: number;
  submited_at?: string;
  validated_by?: UserData;
  validated_by_id?: number;
  validated_at?: string;
  printed_by?: UserData;
  printed_by_id?: number;
  printed_at?: string;
  payed_by?: UserData;
  payed_by_id?: number;
  payed_at?: string;
  suspended_by?: UserData;
  suspended_by_id?: number;
  suspended_at?: string;
  refused_by?: UserData;
  refused_by_id?: number;
  refused_at?: string;
  expired_at?: string;
  updated_at?: string;
  id_card?: string;
  type_adhesion?: ITypeAdhesion;
  date_naissance?: string;
  genre?: 'HOMME' | 'FEMME';
  fonction?: string;
  type_adherent?: 'ADHERANT' | 'MEMBRE';
  tarification_adhesion?: Tarification;
  tarification_adhesion_id?: number;
  is_active?: boolean;
  refusal_list?: MerchantRefusal[];
  work_position: WorkPosition;
  nationality: Nationality;
  work_position_id?: number;
  nationality_id?: number;
  printed: boolean;
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
  document_number: string;
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

export interface SimpleMerchant {
  id: number;
  user: User;
  card_number: string;
  status: Status;
  address: Address;
  created_at: string;
}

export interface Activity {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubActivity {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Entreprise {
  id: number;
  merchant: SimpleMerchant;
  nom: string;
  sigle?: string;
  taille: 'TPE' | 'PME' | 'GE';
  taille_display: string;
  date_creation: string;
  nombre_employe: string;
  nombre_employe_display: string;
  chiffre_affaire: string;
  chiffre_affaire_display: string;
  produits: string;
  address: Address;
  address_id: number;
  logo: string;
  quitus_fiscal: string;
  certificat_fiscal: string;
  type_activite: string;
  type_commerce: string;
  forme_juridique: string;
  numero_rccm: string;
  numero_nif: string;
  adresse: string;
  commentaire: string;
  created_at: string;
  updated_at: string;
}

export interface Banque {
  id: number;
  nom: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TypeAdhesion = 'STANDARD' | 'PREMIUM' | 'MEMBRE';
export type TypeEntreprise = 'PME' | 'GE' | 'DETAILLANT' | 'GROSSISTE';

export interface TarificationAdhesion {
  id: number;
  type_adhesion: TypeAdhesion;
  type_adhesion_display: string;
  type_activite: string;
  type_activite_display: string;
  montant: number;
  created_at: string;
  updated_at: string;
}

export interface Tarification {
  id?: number;
  type_adhesion: TypeAdhesion;
  type_adhesion_display: string;
  type_entreprise: TypeEntreprise;
  type_entreprise_display: string;
  montant: number;
  created_at?: string;
  updated_at?: string;
}

export interface TypeAdhesionData {
  type_demande: string;
  type_adhesion: string;
  type_adhesion_display: string;
  typeActivite: {
    formalisee: boolean;
    nonFormalisee: boolean;
  };
}

export interface ITypeAdhesion {
    id?: number;
    type_demande: string;
    type_adhesion: string;
    type_adhesion_display?: string;
    formalisee: boolean;
    non_formalisee: boolean;
    
}

export interface MerchantEnrollmentSubmission {
  merchantData: MerchantEnrollment;
  documentData: DocumentItem[];
  companyData?: Partial<Entreprise>;
  typeAdhesion: ITypeAdhesion;
}

// WorkPosition CRUD operations
export interface WorkPosition {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

// Nationality CRUD operations
export interface Nationality {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

// MerchantRefusal CRUD operations
export interface MerchantRefusal {
  id?: number;
  reason?: string;
  merchant_enrollment_id?: number;
  created_at?: string;
  updated_at?: string;
  refused_by?: UserData;
  refusal_order?: number;
  is_active?: boolean;
}

// Prefecture CRUD operations
export interface Prefecture {
  id?: number;
  name: string;
  region: Region;
  region_id: number;
  created_at?: string;
  updated_at?: string;
}

// SubPrefecture CRUD operations
export interface SubPrefecture {
  id?: number;
  name?: string;
  prefecture?: Prefecture;
  prefecture_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Region CRUD operations
export interface Region {
  id?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

declare global {
  interface Window {
    STPadServerLibCommons: any;
    STPadServerLibDefault: any;
    STPadServerLib: any;
    STPadServerLibApi: any;
  }
}
