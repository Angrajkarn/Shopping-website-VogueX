"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useCartStore } from "@/lib/store"
import { AuthLayout } from "@/components/ui/auth-layout"
import { GoogleButton } from "@/components/auth/google-button"
import { OtpInput } from "@/components/auth/otp-input"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectPath = searchParams.get('redirect') || '/profile'

    const { login } = useAuthStore()
    const activeCartItems = useCartStore((state) => state.items)
    const clearCart = useCartStore((state) => state.clearCart)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [mode, setMode] = useState<"password" | "otp" | "forgot">("password")
    const [step, setStep] = useState<"input" | "verify">("input") // For OTP flow
    const [identifier, setIdentifier] = useState("") // Email or Phone

    const handleLoginSuccess = async (token: string) => {
        try {
            await login(token)

            // Sync Cart if items exist
            if (activeCartItems.length > 0) {
                await api.syncCart(token, activeCartItems)
                // Ideally we should replace local cart with server response to get updated structure
                // For now, let's keep local or clear it if server is source of truth.
                // Actually, advanced flow: Server IS source of truth for logged in.
                // So we might want to clear local or fetch fresh.
                // Simplest: Sync sends items -> Server adds them -> We can clear local and fetch if needed.
                // But CartStore is client side.
                // Let's just sync so server has them.
            }

            router.push(redirectPath)
        } catch (e) {
            console.error("Login post-processing failed", e)
            // Still redirect even if sync fails? Maybe safer to show error but user is logged in.
            router.push(redirectPath)
        }
    }

    const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await api.login(data)
            await handleLoginSuccess(res.access)
        } catch (err) {
            setError("Invalid email or password")
        } finally {
            setLoading(false)
        }
    }

    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const isEmail = identifier.includes("@")
        const payload = isEmail ? { email: identifier } : { phone_number: identifier }

        try {
            const res = await api.sendOtp(payload)
            console.log("OTP Debug:", res.debug_otp) // For demo purposes
            setStep("verify")
        } catch (err) {
            setError("Failed to send OTP. Please check your input.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (otp: string) => {
        setLoading(true)
        setError("")

        const isEmail = identifier.includes("@")
        const payload = isEmail
            ? { email: identifier, otp }
            : { phone_number: identifier, otp }

        try {
            const res = await api.verifyOtp(payload)
            await handleLoginSuccess(res.access)
        } catch (err) {
            setError("Invalid OTP. Please try again.")
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (token: string) => {
        setLoading(true)
        try {
            await handleLoginSuccess(token)
        } catch (err) {
            setError("Google sign-in failed")
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await api.forgotPassword(identifier)
            console.log("Reset OTP Debug:", res.debug_otp)
            // In a real app, redirect to a reset password page or show a modal
            alert(`OTP sent to ${identifier}. Check console for code.`)
            // For now, just go back to login
            setMode("password")
        } catch (err) {
            setError("Failed to process request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title={mode === "password" ? "Welcome Back" : mode === "otp" ? "OTP Login" : "Reset Password"}
            subtitle="Securely access your fashion world"
            image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                {/* Mode Switcher */}
                {mode !== "forgot" && (
                    <div className="flex p-1 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                        <button
                            onClick={() => { setMode("password"); setStep("input"); setError("") }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "password" ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => { setMode("otp"); setStep("input"); setError("") }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "otp" ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}
                        >
                            OTP / Phone
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {mode === "password" && (
                        <motion.div
                            key="password-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <GoogleButton onSuccess={handleGoogleSuccess} onError={() => setError("Google Sign-In Failed")} />

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/20 px-2 text-white/50 backdrop-blur-xl">Or continue with email</span></div>
                            </div>

                            <form onSubmit={handlePasswordLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                                        <Input name="email" type="email" placeholder="name@example.com" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="text-white">Password</Label>
                                        <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                                        <Input name="password" type="password" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {mode === "otp" && (
                        <motion.div
                            key="otp-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {step === "input" ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-white">Email or Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                                            <Input
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                placeholder="+1234567890 or email@example.com"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-6 text-center">
                                    <div className="space-y-2">
                                        <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Enter Verification Code</h3>
                                        <p className="text-sm text-white/60">We sent a code to {identifier}</p>
                                    </div>

                                    <OtpInput length={6} onComplete={handleVerifyOtp} />

                                    <button
                                        onClick={() => setStep("input")}
                                        className="text-sm text-white/40 hover:text-white transition-colors"
                                    >
                                        Wrong number? Go back
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {mode === "forgot" && (
                        <motion.div
                            key="forgot-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Enter your email</Label>
                                    <Input
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setMode("password")}
                                    className="w-full text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Back to Login
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="text-center text-sm text-white/40">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    )
}
