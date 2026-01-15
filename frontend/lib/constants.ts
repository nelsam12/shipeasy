export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: {
    CLIENT: "/dashboard/client",
    GP: "/dashboard/gp",
    GESTIONNAIRE: "/dashboard/gestionnaire",
    ADMIN: "/dashboard/admin",
  },
};

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Connexion réussie",
    LOGOUT_SUCCESS: "Déconnexion réussie",
    REGISTER_SUCCESS: "Compte créé avec succès",
  },
  ERRORS: {
    NETWORK: "Erreur de connexion au serveur",
    INVALID_CREDENTIALS: "Identifiants invalides",
    REQUIRED_FIELD: "Ce champ est requis",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
};

export enum BodyType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}
