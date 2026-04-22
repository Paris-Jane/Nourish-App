import { apiClient, unwrap } from "./client";
import type { ActivityLevel, AuthResponse } from "types/models";

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  age: number;
  sex: string;
  activityLevel: ActivityLevel;
  householdName: string;
  householdSize: number;
  timezone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export function register(payload: RegisterRequest) {
  return unwrap<AuthResponse>(apiClient.post("/api/auth/register", payload));
}

export function login(payload: LoginRequest) {
  return unwrap<AuthResponse>(apiClient.post("/api/auth/login", payload));
}
