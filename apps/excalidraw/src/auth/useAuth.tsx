"use client"

import { BACKEND_URL } from "@/utils/config"
import axios from "axios"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type AuthContextType = {
  token: string
  login: (email: string, password: string) => Promise<void>
  signup : (email : string, name : string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
      }
      setIsLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            email, password 
         })
         setToken(response.data.token);
         localStorage.setItem("token", response.data.token)
    } catch (error) {
        console.log(error);
    }
  }

  const signup = async (email : string, name : string, password : string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            email,
            name,
            password
        })
    
        console.log(response.data)
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token)
    } catch (error) {
        console.log(error);
    }   
  }

  const logout = () => {
    setToken("")
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ token, login, logout, isLoading, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

