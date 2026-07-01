"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmittedEmail(data.email)
    setIsSuccess(true)
    setIsLoading(false)
  }

  return (
    <>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
      </Link>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <h1 className="text-3xl font-semibold tracking-tight text-[#0a0a0a] mb-2">
                Reset Your Password
              </h1>
              <p className="text-[15px] text-gray-500 font-light">
                Enter your email and we'll send you a secure reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900" htmlFor="email">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="name@company.com"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black text-white rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-8">
              <MailCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Check your inbox</h2>
            <p className="text-[15px] text-gray-500 font-light mb-8 max-w-[280px]">
              We've sent password reset instructions to <span className="font-medium text-gray-900">{submittedEmail}</span>.
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email?{" "}
              <button 
                onClick={() => setIsSuccess(false)}
                className="font-semibold text-black hover:underline"
              >
                Click to try again
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
