// role es String en el schema ("admin" | "cliente"), no un enum fijo.
export type UserRole = "admin" | "cliente";

export interface User {
  id: number;
  email: string;
  name: string;
  businessId: number | null;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  businessName: string;
}
