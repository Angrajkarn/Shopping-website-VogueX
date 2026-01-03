"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"

const BACKEND_URL = "http://localhost:8080/api"

export default function AdminLoginPage() {
    const router = useRouter()
    const { login } = useAuthStore() // We might need a separate store, but let's reuse for now with care
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${BACKEND_URL}/admin-panel/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Login failed")
            }

            // Manually set store state for Admin
            // NOTE: In a real app, use a separate 'useAdminAuthStore' to avoid conflicts
            // For now, we reuse but ensure 'user' has admin roles
            useAuthStore.setState({
                token: data.token,
                user: { ...data.admin, is_superuser: true } as any,
                isAuthenticated: true
            })

            document.cookie = `auth_token=${data.token}; path=/; SameSite=Strict; Secure`

            toast.success("Admin Access Granted", { icon: <ShieldCheck className="w-4 h-4 text-green-500" /> })
            router.push("/admin/dashboard")

        } catch (error: any) {
            toast.error("Access Denied", { description: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Admin</h1>
                    <p className="text-slate-400 text-sm">Authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email ID</label>
                        <Input
                            type="email"
                            required
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-600 focus:ring-blue-600/20"
                            placeholder="admin@voguex.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                        <Input
                            type="password"
                            required
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-600 focus:ring-blue-600/20"
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-base font-semibold tracking-wide"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {loading ? "Authenticating..." : "Access Control Panel"}
                    </Button>
                </form>

                <div className="text-center text-xs text-slate-600">
                    <p>Protected by VogueX Enterprise Security</p>
                </div>
            </div>
        </div>
    )
}
