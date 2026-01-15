/**
 * Error Messages Constants
 * Centralized error messages for consistency
 */
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Identifiants invalides',
  USER_NOT_FOUND: 'Utilisateur introuvable',
  UNAUTHORIZED: 'Action non autorisée',

  // Registration
  EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé',
  ADMIN_REGISTRATION_FORBIDDEN: 'Action non autorisée',

  // Validation
  INVALID_EMAIL: 'Email invalide',
  INVALID_PASSWORD: 'Le mot de passe doit faire au moins 6 caractères',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  INVALID_ROLE: 'Rôle invalide',

  // General
  VALIDATION_FAILED: 'Validation failed',
  UNEXPECTED_ERROR: 'Unexpected error occurred',
};
