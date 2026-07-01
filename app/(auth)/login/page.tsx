"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { GoogleSignInButton } from "@/components/ui/google-signin-button"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().default(false).optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      await signIn("credentials", { 
        email: data.email, 
        password: data.password, 
        callbackUrl: "/dashboard" 
      })
    } catch (error) {
      console.error("Login failed", error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0a0a0a] mb-2">
          Welcome Back
        </h1>
        <p className="text-[15px] text-gray-500 font-light">
          Continue growing your business with AI-powered lead generation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900" htmlFor="email">
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`w-full h-14 px-4 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
              errors.email 
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" 
                : "border-gray-200 focus:border-black focus:ring-black/5"
            }`}
          />
          {errors.email && (
            <p className="text-[13px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900" htmlFor="password">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full h-14 pl-4 pr-12 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
                errors.password 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" 
                  : "border-gray-200 focus:border-black focus:ring-black/5"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[13px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 pb-2">
          <input
            {...register("rememberMe")}
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black/20"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600 select-none">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-black text-white rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
          Or continue with
        </span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <GoogleSignInButton label="Google" />
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-gray-700">
          <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-5 w-5 opacity-80" />
          GitHub
        </button>
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-gray-700">
          <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" alt="Microsoft" className="h-4 w-4" />
          Microsoft
        </button>
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-gray-700">
          <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="h-5 w-5 opacity-80" />
          Apple
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/signup" className="font-semibold text-black hover:underline underline-offset-4">
          Create Account
        </Link>
      </p>
    </>
  )
}
