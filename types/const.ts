import { UserRole, UserStatus } from ".";

export const urls = {
    home: '/',
    dashboard: '/dashboard',
    users: '/dashboard/users',
    merchants : '/dashboard/merchants',
    merchants_review : '/dashboard/review',
    id_cards : '/dashboard/id-cards',
    cards_history : '/dashboard/card-history',
    merchant_payments : '/dashboard/payments',
    configuration: '/dashboard/configuration',

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
    admin: [urls.dashboard, urls.cards_history, urls.id_cards, urls.merchants, urls.merchants_review, urls.users, urls.merchant_payments, urls.configuration],
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
    'PENDING': 'En attente',
    'PAID': 'Payé', 
    'FAILED': 'Échoué'
  } as const;

  export const paymentStatusColorMap = {
    PENDING: 'dark:bg-yellow-500/10 bg-yellow-500/20 dark:text-yellow-400 text-yellow-600',
    PAID: 'dark:bg-green-500/10 bg-green-500/20 dark:text-green-400 text-green-600',
    FAILED: 'dark:bg-red-500/10 bg-red-500/20 dark:text-red-400 text-red-600'
  } as const;

  export const getPaymentStatusColor = (status: string) => {
    const color = paymentStatusColorMap[status as keyof typeof paymentStatusColorMap];
    return color || 'dark:bg-gray-500/10 bg-gray-500/20 dark:text-gray-400 text-gray-600';
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

export const TAILLE_ENTREPRISE = [
  { value: 'PME', label: 'Petite et Moyenne Entreprise (PME)' },
  { value: 'GE', label: 'Grande Entreprise (GE)' }
];

export const TYPE_DEMANDE = [
  { value: 'NOUVELLE_ADHESION', label: 'Nouvelle adhésion' },
  { value: 'DUPLICATA', label: 'Duplicata' },
  { value: 'CHANGEMENT_STATUT', label: 'Changement de statut' }
];

export const TYPE_DEMANDE_MAP = {
  NOUVELLE_ADHESION: 'Nouvelle adhésion',
  DUPLICATA: 'Duplicata',
  CHANGEMENT_STATUT: 'Changement de statut'
} as const;

export const NOMBRE_EMPLOYE = [
    { value: '0-5', label: '0 à 5 employés' },
    { value: '5-10', label: '5 à 10 employés' },
    { value: '10-20', label: '10 à 20 employés' },
    { value: '20-50', label: '20 à 50 employés' },
    { value: '50-100', label: '50 à 100 employés' },
    { value: '+100', label: 'Plus de 100 employés' },
  ];

 export const CHIFFRE_AFFAIRE = [
    { value: '0-100', label: '0 à 100 millions' },
    { value: '100-250', label: '100 à 250 millions' },
    { value: '250-500', label: '250 à 500 millions' },
    { value: '500-2.5', label: '500 millions à 2.5 milliards' },
    { value: '+2.5', label: 'Plus de 2.5 milliards' },
  ];

  export const TYPE_ACTIVITE = [
    { value: 'IMPORT', label: 'Import' },
    { value: 'EXPORT', label: 'Export' },
  ];
  
  export const TYPE_COMMERCE = [
    { value: 'DETAILLANT', label: 'Détaillant' },
    { value: 'GROSSISTE', label: 'Grossiste' },
  ];
  
  export const FORME_JURIDIQUE = [
    { value: 'EI', label: 'Entreprise Individuelle' },
    { value: 'SARL', label: 'Société à Responsabilité Limitée' },
    { value: 'SARLU', label: 'SARL Unipersonnelle' },
    { value: 'SA', label: 'Société Anonyme' },
    { value: 'SAS', label: 'Société par Actions Simplifiée' },
    { value: 'SASU', label: 'SAS Unipersonnelle' },
    { value: 'GIE', label: "Groupement d'Intérêt Économique" },
    { value: 'SUCC', label: 'Succursale' },
  ];

export const paymentTypeMap = {
  'CASH': 'Espèce',
  'ORANGE_MONEY': 'Orange Money'
} as const;

export const paymentTypeColorMap = {
  'CASH': 'dark:bg-blue-500/10 bg-blue-500/20 dark:text-blue-400 text-blue-600',
  'ORANGE_MONEY': 'dark:bg-orange-500/10 bg-orange-500/20 dark:text-orange-400 text-orange-600'
} as const;

export const getPaymentTypeColor = (type: string) => {
  const color = paymentTypeColorMap[type as keyof typeof paymentTypeColorMap];
  return color || 'dark:bg-gray-500/10 bg-gray-500/20 dark:text-gray-400 text-gray-600';
};
