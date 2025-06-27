import serverAxios from '@/lib/server-axios';
import {
  User,
  UserResponse,
  CreateUserDto,
  FilterUsersDto,
  UpdateUserDto,
  UserStats
} from '@/types/user';

export const serverUsersApi = {
  // Get all users with pagination and filtering
  getUsers: async (filters: FilterUsersDto): Promise<UserResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);

    const response = await serverAxios.get(`/users?${params.toString()}`);
    return response.data.data;
  },

  // Get user statistics
  getUserStats: async (): Promise<UserStats> => {
    const response = await serverAxios.get('/users/stats');
    return response.data.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await serverAxios.get('/users/me');
    return response.data.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await serverAxios.get(`/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await serverAxios.post('/users', data);
    return response.data.data;
  },

  // Update current user profile
  updateCurrentUser: async (
    data: Omit<UpdateUserDto, 'role' | 'status'>
  ): Promise<User> => {
    const response = await serverAxios.patch('/users/me', data);
    return response.data.data;
  },

  // Update user by ID (Admin only)
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await serverAxios.patch(`/users/${id}`, data);
    return response.data.data;
  },

  // Activate user
  activateUser: async (id: string): Promise<User> => {
    const response = await serverAxios.patch(`/users/${id}/activate`);
    return response.data.data;
  },

  // Deactivate user
  deactivateUser: async (id: string): Promise<User> => {
    const response = await serverAxios.patch(`/users/${id}/deactivate`);
    return response.data.data;
  },

  // Delete user (soft delete)
  deleteUser: async (id: string): Promise<void> => {
    await serverAxios.delete(`/users/${id}`);
  }
};
