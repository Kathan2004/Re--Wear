import { createHash } from "crypto"

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export interface User {
  id: string
  email: string
  full_name: string
  points: number
  role: string
  avatar_url?: string
  bio?: string
  location?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}
