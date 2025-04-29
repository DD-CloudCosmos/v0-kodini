"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type User = any | null

interface AuthContextType {
  user: User
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Use a ref to store the Supabase client to prevent recreation on re-renders
  const supabaseRef = useRef(getSupabaseClient())

  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.id)
    setUser(session?.user ?? null)
    setLoading(false)

    if (event === "SIGNED_IN") {
      router.refresh() // Refresh the current route
      router.push("/dashboard") // Navigate to dashboard
    } else if (event === "SIGNED_OUT") {
      router.refresh() // Refresh the current route
      router.push("/login") // Navigate to login
    }
  }, [router])

  useEffect(() => {
    const supabase = supabaseRef.current

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await handleAuthStateChange("SIGNED_IN", session)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = supabaseRef.current
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error during sign in:", error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabase = supabaseRef.current
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      return { data, error }
    } catch (error) {
      console.error("Error during sign up:", error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = supabaseRef.current
      await supabase.auth.signOut()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
