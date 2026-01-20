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
  SEARCH: "/search",

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
  TRIP: {
    CREATE_SUCCESS:  "Voyage créé avec succès",
    CREATE_ERROR: "Erreur lors de la création du voyage",
    SEARCH_ERROR: "Erreur lors de la recherche",
  },
  VALIDATION: {
    PHONE_INVALID: "Numéro de téléphone invalide",
    PASSWORD_MISMATCH: "Les mots de passe ne correspondent pas",
    DATE_PAST: "La date ne peut pas être dans le passé",
    KILOS_POSITIVE: "Le poids doit être positif",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  TRIPS: {
    BASE: "/trips",
    ACTIVE: "/trips/active",
    SEARCH:  "/trips/search",
    MY_TRIPS: "/trips/my-trips",
    BY_ID: (id: number) => `/trips/${id}`,
  },
};

export enum BodyType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}
