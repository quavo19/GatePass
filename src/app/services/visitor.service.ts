import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ENDPOINTS } from '../constants/apis';
import {
  OtpRequest,
  OtpResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  CheckInRequest,
  CheckInResponse,
  StaffMembersResponse,
  LatestCheckInsResponse,
} from '../interfaces/api.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly apiService = inject(ApiService);
  // Store OTP for mock verification (in real app, this would be handled by backend)
  private mockOtp: string | null = null;
  private mockPhone: string | null = null;

  requestOtp(request: OtpRequest): Observable<OtpResponse> {
    // Generate a mock 6-digit OTP
    this.mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    this.mockPhone = request.phone;

    // Mock API call - simulate network delay
    return of({
      status: {
        code: 200,
        message: 'OTP sent successfully',
      },
      data: {
        message: `OTP sent to ${request.phone}. Mock OTP: ${this.mockOtp}`,
      },
    }).pipe(delay(1000));
  }

  verifyOtp(request: OtpVerifyRequest): Observable<OtpVerifyResponse> {
    // Mock verification - check if OTP matches stored mock OTP
    const isValid =
      this.mockOtp !== null &&
      this.mockPhone === request.phone &&
      this.mockOtp === request.otp;

    return of({
      status: {
        code: isValid ? 200 : 400,
        message: isValid ? 'OTP verified successfully' : 'Invalid OTP',
      },
      data: {
        verified: isValid,
      },
    }).pipe(delay(500));
  }

  checkIn(request: CheckInRequest): Observable<CheckInResponse> {
    return this.apiService.post<CheckInResponse>(
      ENDPOINTS.VISITORS.CHECK_IN,
      request
    );
  }

  getStaffMembers(): Observable<StaffMembersResponse> {
    return this.apiService.get<StaffMembersResponse>(ENDPOINTS.STAFF.MEMBERS);
  }

  getLatestCheckIns(limit: number = 5): Observable<LatestCheckInsResponse> {
    return this.apiService.get<LatestCheckInsResponse>(
      ENDPOINTS.VISITORS.LATEST_CHECK_INS,
      { limit }
    );
  }
}
