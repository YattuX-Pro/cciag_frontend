import { UserRole, UserStatus } from ".";

export const user_roles = () : UserRole[] => [
    {name: "Opération", value: "operation"},
    {name: "Validation", value: "validation"},
    {name: "Impression", value: "impression"},
]

export const user_status = () : UserStatus[] => [
    {name : "Actif", value: "actif"},
    {name : "Non Actif", value: "non_actif"}
]
