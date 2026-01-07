"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { MegaMenu } from "./MegaMenu"
import { UserMenu } from "./UserMenu"
import { SearchModal } from "./SearchModal"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

const navItems = [
    { name: "New Arrivals", href: "/shop" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Accessories", href: "/accessories" },
    { name: "Collections", href: "/shop" },
]

export function Navbar() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleMouseEnter = (category: string) => {
        if (["Men", "Women", "Accessories"].includes(category)) {
            setActiveCategory(category)
        } else {
            setActiveCategory(null)
        }
    }

    const handleMouseLeave = () => {
        setActiveCategory(null)
    }

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled || activeCategory
                    ? "bg-background/80 backdrop-blur-md border-b"
                    : "bg-transparent"
            )}
            onMouseLeave={handleMouseLeave}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-50">
                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader className="text-left border-b pb-4 mb-4">
                            <SheetTitle>
                                <Link href="/" className="text-2xl font-bold tracking-tighter" onClick={() => setMobileMenuOpen(false)}>
                                    VOGUE<span className="text-primary/50">X</span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "block px-2 py-3 text-lg font-medium transition-colors hover:bg-muted rounded-md",
                                        pathname === item.href ? "text-primary" : "text-foreground"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter">
                    VOGUE<span className="text-primary/50">X</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 h-full">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative py-2 h-full flex items-center",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                            onMouseEnter={() => handleMouseEnter(item.name)}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.span
                                    layoutId="navbar-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary block"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <SearchModal>
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                    </SearchModal>
                    <UserMenu />
                    <CartButton />
                </div>
            </div>

            {/* Mega Menu */}
            <MegaMenu
                isOpen={!!activeCategory}
                activeCategory={activeCategory}
                onClose={() => setActiveCategory(null)}
            />
        </header>
    )
}

function CartButton() {
    const { toggleCart, items } = useCartStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            )}
        </Button>
    )
}
