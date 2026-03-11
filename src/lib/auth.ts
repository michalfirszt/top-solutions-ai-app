import { AUTH_EMAIL_STORAGE_KEY } from '../config'

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(AUTH_EMAIL_STORAGE_KEY)
}

export function setStoredEmail(email: string): void {
  localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, normalizeEmail(email))
}

export function clearStoredEmail(): void {
  localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY)
}
