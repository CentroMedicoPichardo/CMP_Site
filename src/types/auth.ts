// src/types/auth.ts
export interface VerificationCode {
  email: string;
  codigo: string;
  expira: Date;
  intentos: number;
}