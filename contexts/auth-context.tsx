"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/auth"
import { mockUsers } from "@/lib/database"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string, fullName: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("rewear_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call Supabase
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        full_name: foundUser.full_name,
        points: foundUser.points,
        role: foundUser.role,
        avatar_url: foundUser.avatar_url,
      }
      setUser(userSession)
      localStorage.setItem("rewear_user", JSON.stringify(userSession))
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    // Mock signup - in real app, this would call Supabase
    const newUser = {
      id: Date.now().toString(),
      email,
      full_name: fullName,
      points: 100,
      role: "user",
      avatar_url: "/placeholder.svg?height=40&width=40",
    }
    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("rewear_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("rewear_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
