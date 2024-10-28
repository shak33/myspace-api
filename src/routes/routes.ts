export const API_BASE_URL = '/api/v1';
export const API_ROUTE_AUTH = `${API_BASE_URL}/auth`;
export const API_ROUTE_PROFILE = `${API_BASE_URL}/profile`;
export const API_ROUTE_POST = `${API_BASE_URL}/post`;

// Auth
export const authRoutes = {
  register: '/register',
  login: '/login',
} as const;

export const profileRoutes = {
  uploadProfilePicture: '/upload-profile-picture',
} as const;

export const postRoutes = {
  createPost: '/create',
  updatePost: '/update/:postId',
} as const;
