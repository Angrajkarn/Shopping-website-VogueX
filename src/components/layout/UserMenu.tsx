"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Package,
    Heart,
    Gift,
    Bell,
    LogOut,
    ChevronDown,
    CreditCard,
    Ticket,
    Zap,
    Star,
    MapPin,
    Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"



export function UserMenu() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { user, logout, isAuthenticated, token } = useAuthStore()
    const [counts, setCounts] = React.useState({ wishlist: 0, notifications: 0 })
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Fetch dynamic counts
    React.useEffect(() => {
        const fetchCounts = async () => {
            if (!token) return
            try {
                const [wishlist, notifications] = await Promise.all([
                    api.getWishlist(token), // Using list length as count
                    api.getNotifications(token)
                ])
                setCounts({
                    wishlist: wishlist.length || 0,
                    notifications: notifications.unread_count || 0
                })
            } catch (e) {
                console.error("Failed to fetch menu counts", e)
            }
        }
        if (isOpen && token) {
            fetchCounts()
        }
    }, [isOpen, token])

    const menuItems = React.useMemo(() => {
        if (!user) return []
        return [
            { name: "My Profile", icon: User, href: "/profile" },
            {
                name: `SuperCoin Zone (${user.super_coins || 0})`,
                icon: Zap,
                href: "/supercoin",
                className: "text-yellow-600",
                badge: null
            },
            {
                name: user.is_plus_member ? "Plus Member" : "Plus Zone",
                icon: Star,
                href: "/plus",
                className: user.is_plus_member ? "text-blue-600 font-bold" : "text-blue-600",
                badge: user.is_plus_member ? "PLUS" : null
            },
            { name: "Orders", icon: Package, href: "/profile/orders" },
            { name: "Addresses", icon: MapPin, href: "/profile/addresses" },
            { name: "Settings", icon: Settings, href: "/profile/settings" },
            { name: "Wishlist", icon: Heart, href: "/wishlist", badge: counts.wishlist > 0 ? counts.wishlist : null },
            //{ name: "Coupons", icon: Ticket, href: "/coupons" },
            //{ name: "Gift Cards", icon: Gift, href: "/gift-cards" },
            { name: "Notifications", icon: Bell, href: "/notifications", badge: counts.notifications > 0 ? counts.notifications : null },
        ]
    }, [user, counts])

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, 150)
    }

    // Hydration check
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => { setMounted(true) }, [])

    if (!mounted) return null

    if (!isAuthenticated || !user) {
        return (
            <Link href="/login">
                <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Login
                </Button>
            </Link>
        )
    }

    const displayName = user.first_name || user.email.split('@')[0]

    return (
        <div
            className="relative z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Button
                variant="ghost"
                className={cn(
                    "flex items-center gap-1 hover:bg-transparent h-10 px-3 transition-colors",
                    isOpen && "bg-accent/5"
                )}
            >
                <div className="bg-primary/10 p-1.5 rounded-full mr-1 relative">
                    <User className="h-4 w-4 text-primary" />
                    {counts.notifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
                    )}
                </div>
                <span className="font-medium text-sm capitalize">{displayName}</span>
                <ChevronDown className={cn(
                    "h-3 w-3 ml-1 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-1 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-border/50 overflow-hidden ring-1 ring-black/5"
                    >
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white dark:bg-zinc-900 rotate-45 border-l border-t border-border/50" />

                        <div className="py-2 relative z-10 bg-white dark:bg-zinc-900">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group relative"
                                >
                                    <item.icon className={cn(
                                        "h-4 w-4 text-gray-500 group-hover:text-primary transition-colors",
                                        item.className
                                    )} />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            <div className="my-1 border-t border-gray-100 dark:border-zinc-800" />

                            <button
                                onClick={() => logout()}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"
                            >
                                <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
