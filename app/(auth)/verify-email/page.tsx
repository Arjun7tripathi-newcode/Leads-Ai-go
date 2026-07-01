"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, RefreshCw, ArrowLeft } from "lucide-react"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  async function handleResend() {
    setIsResending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResendSuccess(true)
    setIsResending(false)
    
    // Hide success message after 3 seconds
    setTimeout(() => setResendSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col items-center text-center py-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-indigo-500 blur-[40px] opacity-20 rounded-full" />
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-black/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.04)] relative z-10">
          <Mail className="h-10 w-10 text-indigo-500" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl font-semibold tracking-tight text-[#0a0a0a] mb-4"
      >
        Verify your email
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-[15px] text-gray-500 font-light mb-10 max-w-[320px] leading-relaxed"
      >
        We've sent a verification link to <span className="font-medium text-gray-900">john@company.com</span>. Please click the link to verify your account.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full space-y-4"
      >
        <button
          onClick={handleResend}
          disabled={isResending || resendSuccess}
          className="w-full h-14 bg-black text-white rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          {isResending ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : resendSuccess ? (
            "Email Sent!"
          ) : (
            "Resend Email"
          )}
        </button>

        <button className="w-full h-14 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-[15px] font-semibold transition-all flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Change Email Address
        </button>
      </motion.div>
    </div>
  )
}
