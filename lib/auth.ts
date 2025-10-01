"use client"

// Simple authentication system (will be replaced with Supabase later)
const ADMIN_PASSWORD = "admin123" // In production, this would be in env variables

export function checkAuth(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("admin_authenticated") === "true"
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("admin_authenticated", "true")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("admin_authenticated")
}
