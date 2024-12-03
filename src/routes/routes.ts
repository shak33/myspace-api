export const API_BASE_URL = '/api/v1';
export const API_ROUTE_AUTH = `${API_BASE_URL}/auth`;
export const API_ROUTE_PROFILE = `${API_BASE_URL}/profile`;
export const API_ROUTE_POST = `${API_BASE_URL}/post`;
export const API_ROUTE_POSTS = `${API_BASE_URL}/posts`;
export const API_ROUTE_FRIEND = `${API_BASE_URL}/friend`;
export const API_ROUTE_USER = `${API_BASE_URL}/user`;

// Auth
export const authRoutes = {
  register: '/register',
  login: '/login',
} as const;

// Profile preview and edit
export const profileRoutes = {
  uploadProfilePicture: '/upload-profile-picture',
  getProfile: '/:profileId',
} as const;

// Writing and editing posts
export const postRoutes = {
  createPost: '/create',
  updatePost: '/update/:postId',
  createPostReply: '/:postId/reply/create',
} as const;

// Fetching posts
export const postsRoutes = {
  getPosts: '/:profileId',
} as const;

// Add and remove friends
export const friendRoutes = {
  sendFriendRequest: '/send-request/:friendId',
  withdrawFriendRequest: '/withdraw-request/:friendId',
  removeFriend: '/remove/:friendId',
  rejectFriendRequest: '/reject-request/:friendId',
  acceptFriendRequest: '/accept-request/:friendId',
} as const;

export const userRoutes = {
  blockUser: '/block/:userId',
} as const;
