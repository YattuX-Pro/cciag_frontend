import { User } from "@/types";
import { fetcher, poster, updater } from "./fetcher";

// Utilitaire pour générer la query string à partir des paramètres
const generateQueryString = (params: Record<string, any> = {}) => {
  return new URLSearchParams(params).toString();
};

// Récupérer la liste des utilisateurs avec des paramètres
export const getUsers = (params: Record<string, any> = {}): Promise<any> => {
  const queryString = generateQueryString(params);
  return fetcher(`/api/users/?${queryString}`);
};

//Créer un utilisateur
export const createUser = (body: User): Promise<any> => poster('/api/users/', body);

//Modifier un utilisateur
export const updateUser = (body: User, id): Promise<any> => updater(`/api/users/${id}`, body);


export const getUserDetail = (id): Promise<User> => fetcher(`/api/users/${id}`);
