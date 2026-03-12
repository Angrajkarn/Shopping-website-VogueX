"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, ShoppingBag, User, Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: LayoutGrid },
    { name: "Orders", href: "/profile/orders", icon: Package },
    { name: "Cart", href: "#cart", icon: ShoppingBag, isCart: true },
    { name: "Account", href: "/profile", icon: User },
]

export function MobileNav() {
    const pathname = usePathname()
    const { items, toggleCart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Hide mobile nav on seller or admin paths
    if (pathname?.startsWith("/seller") || pathname?.startsWith("/admin")) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
            {/* Elegant Gradient Shadow */}
            <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            
            <nav className="bg-background/95 backdrop-blur-xl border-t border-border/50 pb-safe pt-2 px-2 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        const content = (
                            <div className="flex flex-col items-center justify-center gap-1">
                                <div className="relative">
                                    <Icon className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        isActive ? "text-primary scale-110" : "text-muted-foreground"
                                    )} />
                                    {item.isCart && items.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center ring-2 ring-background shadow-lg"
                                        >
                                            {items.length}
                                        </motion.span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold transition-colors duration-300",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-active"
                                        className="absolute -bottom-2 h-1 w-1 rounded-full bg-primary"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </div>
                        )

                        if (item.isCart) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={toggleCart}
                                    className="relative flex-1 py-1 flex flex-col items-center group touch-none"
                                >
                                    {content}
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative flex-1 py-1 flex flex-col items-center group"
                            >
                                {content}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
