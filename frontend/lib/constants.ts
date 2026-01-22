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
    ASSIGN_SUCCESS: "GP assigné avec succès",
    ASSIGN_ERROR: "Erreur lors de l'assignation du GP",
    UNASSIGN_SUCCESS: "GP désassigné avec succès",
    UNASSIGN_ERROR: "Erreur lors de la désassignation du GP",
  },
  VOYAGE: {
    CREATE_SUCCESS: "Voyage créé avec succès",
    CREATE_ERROR: "Erreur lors de la création du voyage",
    SEARCH_ERROR: "Erreur lors de la recherche",
    AFFECTER_SUCCESS: "GP affecté avec succès",
    AFFECTER_ERROR: "Erreur lors de l'affectation du GP",
    CHANGE_STATUT_SUCCESS: "Statut modifié avec succès",
    CHANGE_STATUT_ERROR: "Erreur lors de la modification du statut",
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
    ASSIGN_GP: (id: number) => `/trips/${id}/assign-gp`,
    UNASSIGN_GP: (id: number) => `/trips/${id}/unassign-gp`,
  },
  VOYAGES: {
    BASE: "/voyages",
    SEARCH: "/voyages/search",
    MES_VOYAGES: "/voyages/mes-voyages",
    QUI_ME_SONT_AFFECTES: "/voyages/qui-me-sont-affectes",
    BY_ID: (id: number) => `/voyages/${id}`,
    AFFECTATIONS: (id: number) => `/voyages/${id}/affectations`,
    CHANGE_STATUT: (id: number) => `/voyages/${id}/statut`,
  },
  USERS: {
    GPS: "/users/gps",
  },
};

export enum BodyType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}
