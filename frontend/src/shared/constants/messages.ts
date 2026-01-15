export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGOUT_SUCCESS: 'Déconnexion réussie',
    REGISTER_SUCCESS: 'Compte créé avec succès',
    INVALID_CREDENTIALS: 'Identifiants invalides',
    UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
    FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue',
    NETWORK: 'Impossible de contacter le serveur',
    VALIDATION: 'Veuillez vérifier les champs du formulaire',
  },
  VALIDATION: {
    REQUIRED: 'Ce champ est obligatoire',
    EMAIL_INVALID: 'Email invalide',
    PASSWORD_MIN: 'Minimum 6 caractères',
    PHONE_INVALID: 'Numéro de téléphone invalide',
    PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  },
} as const;
