"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Mail, ShieldCheck } from "lucide-react"
import { AuthLayout } from "@/components/ui/auth-layout"
import { GoogleButton } from "@/components/auth/google-button"

export default function SignupPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState<any>({})
    const [debugOtp, setDebugOtp] = useState("") // For development only

    const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const form = new FormData(e.currentTarget)
        const data = Object.fromEntries(form)

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const res = await api.sendSignupOtp({ email: data.email as string })
            setFormData(data)
            if (res.debug_otp) setDebugOtp(res.debug_otp)
            setStep('otp')
        } catch (err: any) {
            setError(err.message || "Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const form = new FormData(e.currentTarget)
        const otp = form.get('otp')

        try {
            // 1. Create Account with OTP
            await api.signup({
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                otp: otp
            })

            // 2. Auto Login
            const loginRes = await api.login({
                email: formData.email,
                password: formData.password
            })

            // 3. Store Token & Redirect
            await login(loginRes.access)
            router.push("/profile")

        } catch (err: any) {
            setError(err.message || "Invalid OTP or Signup failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title={step === 'details' ? "Create Account" : "Verify Email"}
            subtitle={step === 'details' ? "Join the future of fashion today" : `Code sent to ${formData.email}`}
            image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
        >
            <AnimatePresence mode="wait">
                {step === 'details' ? (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4">
                            <GoogleButton
                                onSuccess={() => {/* handled by button redirect */ }}
                                onError={() => setError("Google Sign-In Failed")}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/20" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black/40 px-2 text-white/70 backdrop-blur-xl">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-white">First name</Label>
                                    <Input id="firstName" name="firstName" required className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-white">Last name</Label>
                                    <Input id="lastName" name="lastName" required className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email address</Label>
                                <Input id="email" name="email" type="email" required className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Password</Label>
                                <Input id="password" name="password" type="password" required className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 transition-all" />
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11 text-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Email & Continue"}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-white hover:text-indigo-400 hover:underline transition-all">
                                Sign in
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                                <ShieldCheck className="h-8 w-8 text-indigo-400" />
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-gray-400 text-sm">
                                We've sent a 6-digit verification code to
                                <br />
                                <span className="text-white font-medium">{formData.email}</span>
                            </p>
                            {debugOtp && (
                                <p className="text-xs text-yellow-500/70 border border-yellow-500/20 rounded p-1 inline-block">
                                    Debug Code: {debugOtp}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-white text-center block">Enter Code</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    className="h-14 bg-white/10 border-white/20 text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/20 focus:border-white/50 focus:ring-white/20 transition-all font-mono"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-11 bg-transparent border-white/20 text-white hover:bg-white/10"
                                    onClick={() => setStep('details')}
                                    disabled={loading}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <Button type="submit" className="flex-[2] h-11 text-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify & Create"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    )
}
