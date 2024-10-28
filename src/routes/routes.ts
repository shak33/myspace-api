export const API_BASE_URL = '/api/v1';
export const API_ROUTE_AUTH = `${API_BASE_URL}/auth`;
export const API_ROUTE_PROFILE = `${API_BASE_URL}/profile`;

// Auth
export const authRoutes = {
  register: '/register',
  login: '/login',
} as const;

export const profileRoutes = {
  uploadProfilePicture: '/upload-profile-picture',
};
