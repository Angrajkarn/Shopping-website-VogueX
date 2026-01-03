"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, MapPin, CreditCard, Loader2 } from "lucide-react"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { logout, token } = useAuthStore()

    useEffect(() => {
        const loadData = async () => {
            if (!token) {
                router.push('/login')
                return
            }
            try {
                // Parallel fetch for better performance
                const [profileRes, statsRes] = await Promise.all([
                    api.getProfile(token),
                    api.getDashboardStats(token)
                ])
                setProfile(profileRes)
                setStats(statsRes)
            } catch (err: any) {
                console.error("Profile Fetch Error:", err)
                if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
                    logout()
                    router.push('/login')
                } else {
                    setError("Failed to load dashboard data.")
                }
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [router, logout, token])

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome back, {profile.first_name || 'User'}!</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
                        <p className="text-xs text-muted-foreground">Lifetime orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.saved_addresses || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.payment_methods || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                            stats.recent_orders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">Order #{order.id}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                maximumFractionDigits: 0
                                            }).format(parseFloat(order.total_amount))}
                                        </p>
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                                            ${order.status === 'Completed' || order.status === 'Delivered'
                                                ? 'bg-green-500/10 text-green-500 border-transparent'
                                                : 'bg-yellow-500/10 text-yellow-500 border-transparent'}
                                        `}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
