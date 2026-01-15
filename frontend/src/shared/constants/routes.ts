export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: {
    CLIENT: '/dashboard/client',
    GP: '/dashboard/gp',
    GESTIONNAIRE: '/dashboard/gestionnaire',
    ADMIN: '/dashboard/admin',
  },
  DESTINATIONS: '/destinations',
  SEARCH: '/search',
  MESSAGES: '/messages',
  PASS: '/pass',
} as const;
