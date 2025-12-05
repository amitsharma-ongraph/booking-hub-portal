/**
 * Auth API Types
 */

export interface OtpRequestDto {
  phoneNumber: string;
}

export interface OtpResponseDto {
  otp: string;
}

export interface OtpVerificationDto {
  phoneNumber: string;
  otp: string;
}

export interface AuthRequestDto {
  phoneNumber: string;
}

export interface AuthResponseDto {
  token: string;
}

export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  profilePicture: string | null;
  firebaseToken: string | null;
}

export interface CustomerCreationDto {
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  firebaseToken?: string;
}

