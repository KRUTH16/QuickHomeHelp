export type UserRole = "ADMIN" | "EXPERT" | "CUSTOMER";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  userId: number;
  role: UserRole | string;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "ADMIN">;
}
export interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
}
