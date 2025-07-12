"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/auth"
import { getUser } from "@/lib/database"

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
    // Simple authentication using localStorage data
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      const foundUser = users.find((u: any) => u.email === email && u.password === password)
      
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
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        full_name: fullName,
        password,
        points: 100,
        role: "user",
        avatar_url: "/placeholder-user.jpg",
        bio: null,
        location: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to users array
      users.push(newUser)
      localStorage.setItem('rewear_users', JSON.stringify(users))

      // Set as current user
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        points: newUser.points,
        role: newUser.role,
        avatar_url: newUser.avatar_url,
      }
      setUser(userSession)
      localStorage.setItem("rewear_user", JSON.stringify(userSession))
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
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
