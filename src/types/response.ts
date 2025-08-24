export interface ApiResponse<T = unknown> {
  success: boolean;   // true if request was successful
  message: string;    // human-readable message
  data?: T;           // actual response data (optional)
  error?: string;     // error details (optional, for debugging/logging)
}
