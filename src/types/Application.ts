// types/Application.ts

export interface Application {
  fullName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  primaryDepartment: string;
  secondaryDepartment: string;
  motivation: string; // "Why do you want to join SEDS?"
  createdAt?: Date;   // optional, added by backend
}
// types/ApiResponse.ts

export interface ApiResponse<T = unknown> {
  success: boolean;   // true if request was successful
  message: string;    // human-readable message
  data?: T;           // actual response data (optional)
  error?: string;     // error details (optional, for debugging/logging)
}
