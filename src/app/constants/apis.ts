export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/users/login',
    LOGOUT: '/api/v1/users/logout',
    ME: '/api/v1/users/me',
  },
  VISITORS: {
    REQUEST_OTP: '/api/v1/visitors/otp/request',
    VERIFY_OTP: '/api/v1/visitors/otp/verify',
    CHECK_IN: '/api/v1/visitors/check-in',
    LATEST_CHECK_INS: '/api/v1/visitors/check-ins/latest',
  },
  STAFF: {
    MEMBERS: '/api/v1/staff-members',
  },
} as const;
