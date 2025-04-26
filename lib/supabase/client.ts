import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types"

// Use a global variable to ensure true singleton across module boundaries
declare global {
  var supabaseClient: ReturnType<typeof createClient> | undefined
}

export const getSupabaseClient = () => {
  // Use the global instance if it exists
  if (global.supabaseClient) return global.supabaseClient

  // For client-side, check if we already have an instance
  if (typeof window !== "undefined" && (window as any).__supabaseClient) {
    return (window as any).__supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase configuration is incomplete")
  }

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "kodini-auth-token",
    },
  })

  // Store the client in the appropriate global object
  if (typeof window !== "undefined") {
    ;(window as any).__supabaseClient = client
  } else {
    global.supabaseClient = client
  }

  return client
}

// For backward compatibility
export const supabase = getSupabaseClient()
