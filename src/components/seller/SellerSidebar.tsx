"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Wallet,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Store,
    Megaphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SellerSidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuthStore()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const navItems = [
        { name: "Overview", href: "/seller/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/seller/dashboard/products", icon: Package },
        { name: "Orders", href: "/seller/dashboard/orders", icon: ShoppingBag },
        { name: "Payments", href: "/seller/dashboard/payments", icon: Wallet },
        { name: "Analytics", href: "/seller/dashboard/analytics", icon: BarChart3 },
        { name: "Promotions", href: "/seller/dashboard/promotions", icon: Megaphone },
        { name: "Settings", href: "/seller/dashboard/settings", icon: Settings },
    ]

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl sticky top-0 z-50 transition-all duration-300 ease-in-out"
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Store className="h-6 w-6 text-black" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-wide text-white">VogueX</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Seller Hub</p>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="mx-auto">
                        <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="font-bold text-black text-xl">V</span>
                        </div>
                    </div>
                )}

                {/* Collapse Toggle (Desktop only normally, but kept valid) */}
                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800 hidden lg:flex"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {isCollapsed && (
                <div className="flex justify-center py-4 border-b border-slate-800">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-400 border-l-4 border-yellow-500"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6 shrink-0 transition-colors", isActive ? "text-yellow-400" : "text-slate-500 group-hover:text-white")} />
                            {!isCollapsed && (
                                <span className={cn("font-medium text-sm tracking-wide", isActive ? "font-semibold" : "")}>
                                    {item.name}
                                </span>
                            )}

                            {/* Hover Glow Effect */}
                            {isActive && (
                                <div className="absolute inset-0 bg-yellow-400/5 pointer-events-none" />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                    <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                        {user?.profile_picture ? (
                            <img src={user.profile_picture} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-slate-400">{user?.first_name?.[0] || 'S'}</span>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 transition-opacity duration-200">
                            <p className="font-medium text-sm text-white truncate">{user?.first_name || 'Seller'} {user?.last_name}</p>
                            <button onClick={logout} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors mt-0.5">
                                <LogOut className="h-3 w-3" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    )
}
