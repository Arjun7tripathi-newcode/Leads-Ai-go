"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  label?: string
}

export function GoogleSignInButton({ label = "Google" }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign in error", error)
      setIsLoading(false)
    }
  }

  return (
    <button 
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-gray-700 disabled:opacity-70 disabled:pointer-events-none w-full"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <img 
          src="https://www.svgrepo.com/show/475656/google-color.svg" 
          alt="Google" 
          className="h-5 w-5" 
        />
      )}
      {isLoading ? "Connecting..." : label}
    </button>
  )
}
