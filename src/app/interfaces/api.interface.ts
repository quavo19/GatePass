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

export interface OtpRequest {
  phone: string;
}

export interface OtpResponse extends ApiResponse<{ message: string }> {}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface OtpVerifyResponse extends ApiResponse<{ verified: boolean }> {}

export interface CheckInRequest {
  fullName: string;
  phone: string;
  ghanaCardNumber: string;
  staffMemberId: string | number;
  purpose: string;
}

export interface CheckInResponse
  extends ApiResponse<{
    ticketNumber: string;
    visitor: {
      fullName: string;
      phone: string;
      ghanaCardNumber: string;
      staffMember: string;
      purpose: string;
      checkInTime: string;
      status: 'checked_in' | 'checked_out';
    };
  }> {}

export interface StaffMember {
  id: number;
  name: string;
  department: string;
}

export interface StaffMembersResponse extends ApiResponse<StaffMember[]> {}

export interface LatestCheckIn {
  id: string;
  fullName: string;
  phone: string;
  staffMember: string;
  purpose: string;
  ticketNumber: string;
  checkInTime: string;
  status: 'checked_in' | 'checked_out';
}

export interface LatestCheckInsResponse extends ApiResponse<LatestCheckIn[]> {}
