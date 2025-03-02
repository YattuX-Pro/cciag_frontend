import { UserRole, UserStatus } from ".";

export const urls = {
    home: '/',
    dashboard: '/dashboard',
    users: '/dashboard/users',
    merchants : '/dashboard/merchants',
    merchants_review : '/dashboard/merchants-review',
    id_cards : '/dashboard/id-cards',
    cards_history : '/dashboard/card-history',
    merchant_payments : '/dashboard/payments',

    login : '/login',
    logout : '/logout',
    not_fount: '/not-found',
    auth_logout: '/auth/logout/',
    create_token: '/token',
    refresh_token: '/token/refresh/',
    reset_password: '/auth/users/reset_password/',
    reset_confirm_password: '/auth/users/reset_password_confirm/',

    espace_client: '/espace-client',
}

export const roles = {
    admin : 'admin',
    client : 'client',
    operation : 'operation',
    validation : 'validation',
    impression : 'impression'
}

export const user_roles = () : UserRole[] => [
    {name: "Admin", value: roles.admin},
    {name: "Client", value: roles.client},
    {name: "Opération", value: roles.operation},
    {name: "Validation", value: roles.validation},
    {name: "Impression", value: roles.impression},
]

export const user_status_list = () : UserStatus[] => [
    {name : "Actif", value: "actif"},
    {name : "Non Actif", value: "non_actif"}
]

export const user_status = {
    actif : 'actif', 
    non_actif: 'non_actif'
}

export const roleBasedRoutes = {
    admin: [urls.dashboard, urls.cards_history, urls.id_cards, urls.merchants, urls.merchants_review, urls.users, urls.merchant_payments],
    operation: [urls.merchants, urls.dashboard,urls.merchant_payments],
    validation: [urls.merchants_review, urls.dashboard],
    impression: [urls.id_cards, urls.dashboard],
    client: [urls.espace_client],
  };

export const protectedRoutes = [urls.dashboard, urls.espace_client]

export const defaultPagination = {
    "limit" : 1,
}

export const statusMap = {
    'A_PAYER': 'À payer',
    'PAYE': 'Payé', 
    'A_VALIDER': 'À valider',
    'VALIDE': 'Validé',
    'IMPRIME': 'Imprimé',
    'SUSPENDU': 'Suspendu',
    'RENOUVELE': 'Renouvelé',
    'REFUSE': 'Refusé'

  };

  export const paymentStatusMap = {
    'PENDING': 'En Cours',
    'PAID': 'Payé', 
    'FAILED': 'Échoué',
    

  };

const statusColorMap = {
  'A_PAYER': 'dark:bg-orange-500/10 bg-yellow-300 dark:text-orange-400 text-orange-600',
  'PAYE': 'dark:bg-green-500/10 bg-green-500/20 dark:text-green-400 text-green-600',
  'A_VALIDER': 'dark:bg-cyan-500/10 bg-cyan-500/20 dark:text-cyan-400 text-cyan-600',
  'VALIDE': 'dark:bg-emerald-500/10 bg-emerald-500/20 dark:text-emerald-400 text-emerald-600',
  'SUSPENDU': 'dark:bg-red-500/10 bg-red-500/20 dark:text-red-400 text-red-600',
  'REFUSE' : 'dark:bg-red-500/10 bg-red-500/20 dark:text-red-400 text-red-600',
  'RENOUVELE': 'dark:bg-blue-500/10 bg-blue-500/20 dark:text-blue-400 text-blue-600'
} as const;

export const getStatusColor = (status: string) => {
    const color = statusColorMap[status as keyof typeof statusColorMap];
    return color || 'dark:bg-gray-500/10 bg-gray-500/20 dark:text-gray-400 text-gray-600';
};
