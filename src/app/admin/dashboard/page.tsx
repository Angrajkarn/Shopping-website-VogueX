"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "@/app/admin/components/revenue-chart"
import { RecentActivityFeed } from "@/app/admin/components/recent-activity"
import { RevenueSourceDistribution } from "@/app/admin/components/category-distribution"
import { SellerGrowthFunnel } from "@/app/admin/components/sales-funnel"
import { UserDemographics } from "@/app/admin/components/user-demographics"
import { TopPerformingSellers } from "@/app/admin/components/top-products"
import { LiveUserCounter } from "@/app/admin/components/live-user-counter"
import { TrafficSources } from "@/app/admin/components/traffic-sources"
import { SessionAnalytics } from "@/app/admin/components/session-analytics"
import { Users, Store, DollarSign, ShoppingCart, TrendingUp, Loader2 } from "lucide-react"
import useInterval from "@/hooks/use-interval"

export default function AdminDashboard() {
    const { token } = useAuthStore()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadStats = async () => {
        // MOCK DATA FOR DEMO
        setStats({
            users: { total: 12543, new_today: 145 },
            sellers: { total: 856, pending: 12 },
            financials: { revenue: 4502300, orders: 3421 }
        })
        setLoading(false)
    }

    useEffect(() => { loadStats() }, [])

    // Poll every 10 seconds for main stats
    useInterval(() => { loadStats() }, 10000)

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>

    if (!stats) return null

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Live Traffic Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <LiveUserCounter />
                <SessionAnalytics />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.financials.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12%"
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    strokeColor="stroke-emerald-500"
                />
                <StatCard
                    title="Total Users"
                    value={stats.users.total}
                    subValue={`+${stats.users.new_today} today`}
                    icon={Users}
                    trend="+5%"
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    strokeColor="stroke-blue-500"
                />
                <StatCard
                    title="Active Sellers"
                    value={stats.sellers.total}
                    subValue={`${stats.sellers.pending} pending`}
                    icon={Store}
                    trend="+2"
                    color="text-violet-400"
                    bg="bg-violet-500/10"
                    strokeColor="stroke-violet-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.financials.orders}
                    icon={ShoppingCart}
                    trend="+8%"
                    color="text-orange-400"
                    bg="bg-orange-500/10"
                    strokeColor="stroke-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <RevenueChart />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RevenueSourceDistribution />
                        <UserDemographics />
                        <TrafficSources />
                    </div>
                </div>
                <div className="lg:col-span-3 space-y-6">
                    <RecentActivityFeed />
                    <SellerGrowthFunnel />
                    <TopPerformingSellers />
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, subValue, icon: Icon, trend, color, bg, strokeColor }: any) {
    return (
        <Card className="border border-white/5 shadow-2xl bg-slate-900/40 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`p-3 rounded-xl ${bg} backdrop-blur-sm border border-white/5`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 ${color} shadow-lg`}>
                        {trend}
                    </span>
                </div>
                <div className="relative z-10">
                    <h3 className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</h3>
                    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                    {subValue && <div className="text-xs text-slate-500 mt-2 font-mono">{subValue}</div>}
                </div>

                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${color.replace('text-', '')} opacity-5 rounded-bl-[100px] pointer-events-none`} />
            </CardContent>
        </Card>
    )
}
