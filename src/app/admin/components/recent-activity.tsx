import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"
import useInterval from "@/hooks/use-interval"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function RecentActivityFeed() {
    const { token } = useAuthStore()
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchActivities = async () => {
        // MOCK DATA FOR DEMO
        setActivities([
            {
                type: 'order',
                user: 'Olivia Martin',
                action: 'placed an order',
                amount: '₹1,999',
                time: new Date().toISOString()
            },
            {
                type: 'seller',
                user: 'Jackson Lee',
                action: 'registered as seller',
                amount: null,
                time: new Date(Date.now() - 1000 * 60 * 5).toISOString()
            },
            {
                type: 'user',
                user: 'Isabella Nguyen',
                action: 'joined the platform',
                amount: null,
                time: new Date(Date.now() - 1000 * 60 * 12).toISOString()
            },
            {
                type: 'order',
                user: 'Sofia Davis',
                action: 'placed an order',
                amount: '₹3,200',
                time: new Date(Date.now() - 1000 * 60 * 60).toISOString()
            },
            {
                type: 'seller',
                user: 'Global Trends',
                action: 'verified documents',
                amount: null,
                time: new Date(Date.now() - 1000 * 60 * 120).toISOString()
            }
        ])
        setLoading(false)
    }

    // Initial load
    useEffect(() => { fetchActivities() }, [])

    // Poll every 5 seconds
    useInterval(() => { fetchActivities() }, 5000)

    return (
        <Card className="col-span-3 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                    Live Operations
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activities.length === 0 && !loading && (
                        <p className="text-center text-slate-400 text-sm">No recent activity.</p>
                    )}
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center animate-in slide-in-from-right-5 fade-in duration-500 group">
                            <Avatar className="h-9 w-9 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                <AvatarFallback className="text-xs uppercase font-bold">
                                    {activity.type === 'order' ? 'OR' : activity.type === 'user' ? 'US' : 'SE'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-200 group-hover:text-indigo-400 transition-colors">
                                    {activity.user}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {activity.action}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-slate-200 text-right">
                                {activity.amount && (
                                    <span className="text-emerald-400 block shadow-emerald-500/20 drop-shadow-sm">
                                        {activity.amount}
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 font-normal">
                                    {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
