"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    User,
    Package,
    MapPin,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

interface ProfileLayoutProps {
    children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { name: 'Overview', href: '/profile', icon: LayoutDashboard },
        { name: 'My Orders', href: '/profile/orders', icon: Package },
        { name: 'Saved Addresses', href: '/profile/addresses', icon: MapPin },
        { name: 'Profile Settings', href: '/profile/settings', icon: Settings },
    ]

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            {/* User Profile Snippet */}
            <div className="p-6 border-b flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-primary/10 bg-primary/5 flex items-center justify-center overflow-hidden">
                    {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-primary font-bold text-lg">{user?.first_name?.[0] || 'U'}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-0.5">Hello,</p>
                    <p className="font-bold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/5 text-primary"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="w-4 h-4 text-primary opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
                    onClick={() => {
                        logout()
                        router.push('/login')
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-80 shrink-0">
                        <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* Mobile Sidebar Trigger */}
                    <div className="lg:hidden mb-4 bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                                {user?.first_name?.[0] || 'U'}
                            </div>
                            <span className="font-bold">My Account</span>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <SheetTitle className="hidden">Navigation</SheetTitle>
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
