"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react"
import { GoogleSignInButton } from "@/components/ui/google-signin-button"

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy."
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password", "")

  // Password strength calculation
  const strength = useMemo(() => {
    let score = 0
    if (password.length > 0) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1
    return score // 0: None, 1: Weak, 2: Fair, 3: Good, 4: Excellent
  }, [password])

  const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Excellent"]
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"]

  const requirements = [
    { label: "8+ Characters", met: password.length >= 8 },
    { label: "Uppercase & Lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special Character", met: /[^A-Za-z0-9]/.test(password) }
  ]

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Signup Data:", data)
    setIsLoading(false)
    window.location.href = "/welcome"
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0a0a0a] mb-2">
          Create Your Account
        </h1>
        <p className="text-[15px] text-gray-500 font-light">
          Start generating verified leads in minutes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <GoogleSignInButton label="Google" />
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-gray-700">
          <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="h-5 w-5 opacity-80" />
          Apple
        </button>
      </div>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
          Or continue with email
        </span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900" htmlFor="fullName">
            Full Name
          </label>
          <input
            {...register("fullName")}
            id="fullName"
            type="text"
            placeholder="John Doe"
            className={`w-full h-14 px-4 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
              errors.fullName ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-black focus:ring-black/5"
            }`}
          />
          {errors.fullName && <p className="text-[13px] text-red-500 font-medium">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900" htmlFor="email">
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="john@company.com"
            className={`w-full h-14 px-4 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
              errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-black focus:ring-black/5"
            }`}
          />
          {errors.email && <p className="text-[13px] text-red-500 font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className={`w-full h-14 pl-4 pr-12 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
                errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-black focus:ring-black/5"
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
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="pt-2 animate-in fade-in">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${strength >= level ? strengthColors[strength] : 'bg-gray-100'}`} 
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-y-2 mt-3">
                {requirements.map((req, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300 ${req.met ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <Check className="h-2 w-2" />
                    </div>
                    {req.label}
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.password && <p className="text-[13px] text-red-500 font-medium">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className={`w-full h-14 px-4 rounded-xl border bg-white text-[15px] outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-4 ${
              errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-black focus:ring-black/5"
            }`}
          />
          {errors.confirmPassword && <p className="text-[13px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-3 pt-2 pb-2">
          <div className="mt-1">
            <input
              {...register("terms")}
              id="terms"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black/20"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            I agree to the <Link href="#" className="font-semibold text-black hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-black hover:underline">Privacy Policy</Link>.
          </label>
        </div>
        {errors.terms && <p className="text-[13px] text-red-500 font-medium -mt-2">{errors.terms.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-black text-white rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-black hover:underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </>
  )
}
