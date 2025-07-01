export interface EnrollementStatistics {
  users_statistics?: {
    total_users: number;
    last_month_users: number;
  };
  active_merchants_statistics?: {
    total_active_merchants: number;
    last_month_active_merchants: number;
  };
  printed_merchants_statistics?: {
    total_printed_merchants: number;
    last_month_printed_merchants: number;
  };
  to_validate_merchants_statistics?: {
    total_to_validate_merchants: number;
    last_month_to_validate_merchants: number;
  };
}

export interface DetailedStatistics {
  merchants_by_address: Array<{
    address_name: string;
    total_merchants: number;
  }>;
  payments_by_month: Array<{
    month: string;
    total_amount: number;
  }>;
}

export interface FinancialStatistics {
  total_amount_collected: number;
  faso_amount: number;
  cciag_amount: number;
  faso_percentage: number;
  cciag_percentage: number;
  payments_by_month: Array<{
    month: string;
    year: number;
    period: string;
    total_amount: number;
    payment_count: number;
    faso_amount: number;
    cciag_amount: number;
  }>;
  payment_type_statistics: {
    total_count: number;
    details: Array<{
      payment_type_code: string;
      payment_type_name: string;
      total_amount: number;
      payment_count: number;
      amount_percentage: number;
      count_percentage: number;
      faso_amount: number;
      cciag_amount: number;
    }>;
  };
}

export interface EnterpriseStatistics {
  stats_by_company_size: {
    taille: string;
    total: number;
  }[];
  stats_by_activity_type: {
    type_activite: string;
    total: number;
  }[];
  stats_by_commerce_type: {
    type_commerce: string;
    total: number;
  }[];
  stats_by_turnover: {
    chiffre_affaire: string;
    total: number;
  }[];
  stats_by_employee_count: {
    nombre_employe: string;
    total: number;
  }[];
}

export interface StatusStatistics {
  stats_by_status: {
    status: string;
    total: number;
  }[];
  status_counts: {
    a_valider: number;
    valide: number;
    refuse: number;
    total: number;
    formalisee: number;
    non_formalisee: number;
  };
  stats_by_creator: {
    created_by__first_name: string;
    created_by__last_name: string;
    created_by__email: string;
    total: number;
  }[];
}