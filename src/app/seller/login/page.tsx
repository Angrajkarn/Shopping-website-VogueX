"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowRight, TrendingUp, ShieldCheck, Zap, Store, Mail, Lock, Phone } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export default function SellerAuthPage() {
    const router = useRouter()
    const [mode, setMode] = useState<"login" | "signup">("login")
    const [loading, setLoading] = useState(false)

    // Login State
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Signup State
    const [signupStep, setSignupStep] = useState(1) // 1: Details, 2: OTP
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        store_name: "",
        phone_number: "",
        otp: ""
    })
    const [otpSent, setOtpSent] = useState(false)

    useEffect(() => {
        // Auto-redirect if already logged in as seller
        const stored = localStorage.getItem("auth-storage")
        if (stored) {
            try {
                const { state } = JSON.parse(stored)
                if (state?.token && state?.seller) {
                    // Ensure cookie is synced (User might have cleared cookies but kept local storage)
                    const isCookieSet = document.cookie.includes('auth_token=')
                    if (!isCookieSet) {
                        document.cookie = `auth_token=${state.token}; path=/; SameSite=Strict; Secure`
                    }

                    // Prevent fast flicker if possible, but redirect
                    router.push("/seller/dashboard")
                }
            } catch (e) {
                // Invalid JSON, ignore
            }
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.sellerLogin({ email: loginEmail, password: loginPassword })

            // Update Global Store (In-Memory + Auto-Persist)
            useAuthStore.setState({
                token: res.tokens.access,
                user: { ...res.seller, first_name: res.seller.store_name } as any, // Cast to match User interface partially
                isAuthenticated: true
            })

            // Sync cookie for Middleware
            document.cookie = `auth_token=${res.tokens.access}; path=/; SameSite=Strict; Secure`

            toast.success("Welcome back!", { description: `Redirecting to ${res.seller.store_name} Dashboard...` })
            router.push("/seller/dashboard")
        } catch (err: any) {
            toast.error("Login Failed", { description: err.message })
        } finally {
            setLoading(false)
        }
    }

    const handleSendOTP = async () => {
        if (!formData.email || !formData.phone_number) {
            toast.error("Contact Info Missing", { description: "Please enter email and phone number" })
            return
        }
        setLoading(true)
        try {
            await api.sendSellerOTP({ email: formData.email, phone_number: formData.phone_number })
            setOtpSent(true)
            toast.success("OTP Sent!", { description: `Code sent to ${formData.email}` })
            setSignupStep(2)
        } catch (err: any) {
            toast.error("Failed to send OTP", { description: err.message })
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (signupStep === 1) {
            await handleSendOTP()
            return
        }

        setLoading(true)
        try {
            const res = await api.sellerSignup(formData)

            // Update Global Store (In-Memory + Auto-Persist)
            useAuthStore.setState({
                token: res.tokens.access,
                user: { ...res.seller, first_name: res.seller.store_name } as any,
                isAuthenticated: true
            })

            // Sync cookie for Middleware
            document.cookie = `auth_token=${res.tokens.access}; path=/; SameSite=Strict; Secure`

            toast.success("Account Created!", { description: "Welcome to VogueX Seller Hub" })
            router.push("/seller/dashboard")
        } catch (err: any) {
            toast.error("Signup Failed", { description: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* LEFT: Branding Section */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://static-assets-web.flixcart.com/fk-sp-static/images/pre-login/banner-bg.svg')] bg-cover opacity-20" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />

                <div className="relative z-10 text-white">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">VogueX <span className="opacity-70">Seller Hub</span></h2>
                    <div className="h-1 w-20 bg-yellow-400 rounded-full" />
                </div>

                <div className="relative z-10 space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <TrendingUp className="w-7 h-7 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Track Your Growth</h3>
                                <p className="text-blue-100 leading-relaxed max-w-sm">
                                    Real-time analytics and sales reports to help you make better business decisions.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <ShieldCheck className="w-7 h-7 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Secure Payments</h3>
                                <p className="text-blue-100 leading-relaxed max-w-sm">
                                    Timely settlements directly to your bank account with complete transparency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-white/50 text-sm font-medium">
                    © 2026 VogueX Internet Pvt Ltd.
                </div>
            </div>

            {/* RIGHT: Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">

                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
                        <button
                            onClick={() => setMode("login")}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "login" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "signup" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            New Seller
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">
                            {mode === "login" ? "Welcome Back!" : "Start Selling Today"}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {mode === "login" ? "Log in to manage your seller account" : "Join thousands of successful sellers"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === "login" ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                        <Input
                                            placeholder="seller@example.com"
                                            className="h-14 pl-12 text-lg bg-slate-50 border-slate-200 focus:bg-white"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 pl-12 text-lg bg-slate-50 border-slate-200 focus:bg-white"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login Securely"}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="signup-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSignup}
                                className="space-y-4"
                            >
                                {signupStep === 1 ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                                <Input
                                                    placeholder="John Doe"
                                                    className="h-12 bg-slate-50"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Store Name</label>
                                                <div className="relative">
                                                    <Store className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        placeholder="FashionHub"
                                                        className="h-12 pl-9 bg-slate-50"
                                                        value={formData.store_name}
                                                        onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="work@business.com"
                                                    className="h-12 pl-12 bg-slate-50"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="+91 98765 43210"
                                                    className="h-12 pl-12 bg-slate-50"
                                                    value={formData.phone_number}
                                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Create Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    type="password"
                                                    placeholder="Strong password"
                                                    className="h-12 pl-12 bg-slate-50"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg mt-2"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                            Verify & Create Account
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                                            <p className="text-sm text-blue-800 mb-1">OTP sent to <strong>{formData.email}</strong></p>
                                            <button
                                                type="button"
                                                onClick={() => setSignupStep(1)}
                                                className="text-xs font-bold text-blue-600 underline"
                                            >
                                                Change details
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Enter Verification Code</label>
                                            <Input
                                                placeholder="123456"
                                                className="h-14 text-center text-2xl tracking-[0.5em] font-mono font-bold bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                maxLength={6}
                                                value={formData.otp}
                                                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-200"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Launch Store 🚀"}
                                        </Button>
                                    </div>
                                )}
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
