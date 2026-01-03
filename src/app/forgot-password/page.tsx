"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, KeyRound, Mail, ShieldCheck, CheckCircle2 } from "lucide-react"
import { AuthLayout } from "@/components/ui/auth-layout"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")

    // Step 1: Send OTP
    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const emailValue = formData.get('email') as string

        try {
            await api.forgotPassword(emailValue)
            setEmail(emailValue)
            setStep('otp')
            toast.success("Verification code sent to your email")
        } catch (err: any) {
            toast.error(err.message || "Failed to send code")
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Verify OTP (Visual Transition only, actual verification is with reset)
    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const otpValue = formData.get('otp') as string

        if (otpValue.length !== 6) {
            toast.error("Please enter a valid 6-digit code")
            return
        }

        setOtp(otpValue)
        setStep('password')
    }

    // Step 3: Reset Password
    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const newPassword = formData.get('newPassword')
        const confirmPassword = formData.get('confirmPassword')

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            // Final Call: Email + OTP + New Password
            await api.resetPassword({
                email,
                otp,
                new_password: newPassword
            })
            toast.success("Password reset successfully!")
            router.push("/login")
        } catch (err: any) {
            // If error is about OTP, might want to go back to OTP step
            if (err.message && (err.message.toLowerCase().includes('otp') || err.message.toLowerCase().includes('code'))) {
                setStep('otp')
                toast.error("Invalid or expired OTP. Please try again.")
            } else {
                toast.error(err.message || "Failed to reset password")
            }
        } finally {
            setLoading(false)
        }
    }

    const slideVariants = {
        hidden: { x: 20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 }
    }

    return (
        <AuthLayout
            title={
                step === 'email' ? "Forgot Password?" :
                    step === 'otp' ? "Verify Identity" : "Reset Password"
            }
            subtitle={
                step === 'email' ? "Enter your email to receive a recovery code" :
                    step === 'otp' ? `Enter the code sent to ${email}` : "Create a strong new password"
            }
            image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop"
        >
            <AnimatePresence mode="wait">
                {/* STEP 1: EMAIL */}
                {step === 'email' && (
                    <motion.div
                        key="email"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Code"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: OTP */}
                {step === 'otp' && (
                    <motion.div
                        key="otp"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <ShieldCheck className="h-8 w-8 text-indigo-400" />
                            </div>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-white text-center block uppercase tracking-widest text-xs opacity-70">Enter 6-Digit Code</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    placeholder="000000"
                                    className="h-14 bg-white/10 border-white/20 text-white text-center tracking-[0.5em] font-mono text-2xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all rounded-xl"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 bg-transparent border-white/20 text-white hover:bg-white/10"
                                    onClick={() => setStep('email')}
                                >
                                    Change Email
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-11 font-medium bg-white text-black hover:bg-white/90"
                                >
                                    Verify Code
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 'password' && (
                    <motion.div
                        key="password"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all transform hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Reset Password"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-white/50 hover:text-white"
                                onClick={() => setStep('otp')}
                                disabled={loading}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    )
}
