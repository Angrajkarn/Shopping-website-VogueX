"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Bell, CheckCheck, Package, Tag, Info, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
    const { user, token } = useAuthStore()
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) return
            try {
                const data = await api.getNotifications(token)
                setNotifications(data.notifications)
            } catch (error) {
                console.error("Failed to load notifications")
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [token])

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))) // Optimistic
        try {
            if (token) await api.markAllNotificationsRead(token)
        } catch (error) {
            console.error("Failed to mark all read")
        }
    }

    const markRead = async (id: number) => {
        // Optimistic
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        try {
            if (token) await api.markNotificationRead(token, id)
        } catch (error) {
            console.error("Failed to mark read")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="h-5 w-5 text-blue-500" />
            case 'promo': return <Tag className="h-5 w-5 text-green-500" />
            case 'coin': return <Zap className="h-5 w-5 text-yellow-500" />
            default: return <Info className="h-5 w-5 text-gray-500" />
        }
    }

    if (!user) return null

    return (
        <div className="container mx-auto py-10 max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Bell className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">Stay updated on your orders and rewards.</p>
                    </div>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <Button variant="outline" onClick={markAllRead} className="gap-2">
                        <CheckCheck className="h-4 w-4" />
                        Mark all read
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "flex gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-accent/5",
                                notification.is_read ? "bg-card" : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                            )}
                            onClick={() => !notification.is_read && markRead(notification.id)}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={cn("font-medium", !notification.is_read && "text-primary")}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>
                            {!notification.is_read && (
                                <div className="self-center">
                                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No notifications</h2>
                    <p className="text-muted-foreground">We'll notify you when something important happens.</p>
                </div>
            )}
        </div>
    )
}
