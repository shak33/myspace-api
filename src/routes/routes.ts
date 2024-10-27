export const API_BASE_URL = '/api/v1';
export const API_ROUTE_AUTH = `${API_BASE_URL}/auth`;

// Auth
export const authRoutes = {
  register: '/register',
  login: '/login',
} as const;
