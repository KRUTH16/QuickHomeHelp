import api from "./axios";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/authTypes";

export const loginUser = (payload: LoginRequest) => {
  return api.post<LoginResponse>("/auth/login", payload);
};

export const registerUser = (payload: RegisterRequest) => {
  return api.post("/auth/register", payload);
};
