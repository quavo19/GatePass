export interface ApiStatus {
  code: number;
  message: string;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  data: T;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export type UserRole = 'User' | 'Admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse extends ApiResponse<User> {}

export interface GetUserResponse extends ApiResponse<User> {}

import { IconNameType } from '../constants/icons';

export interface NavigationItem {
  label: string;
  route: string;
  roles: UserRole[];
  icon: IconNameType;
}

