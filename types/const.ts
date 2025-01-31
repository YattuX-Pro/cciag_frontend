import { UserRole, UserStatus } from ".";

export const urls = {
    home: '/',
    dashboard: '/dashboard',
    users: '/dashboard/users',
    merchants : '/dashboard/merchants',
    merchants_review : '/dashboard/merchants-review',
    id_cards : '/dashboard/id-cards',
    cards_history : '/dashboard/card-history',

    login : '/login',
    logout : '/logout',
    not_fount: '/not-found',
    auth_logout: '/auth/logout/',
    create_token: '/token',
    refresh_token: '/token/refresh/',
    reset_password: '/auth/users/reset_password/',
    reset_confirm_password: '/auth/users/reset_password_confirm/',
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
    admin: [urls.dashboard, urls.cards_history, urls.id_cards, urls.merchants, urls.merchants_review, urls.users],
    operation: [urls.merchants],
    validation: [urls.merchants_review],
    impression: [urls.id_cards],
  };

export const protectedRoutes = [urls.dashboard]


