"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Store, Settings, LogOut, Menu, X as PanelLeftClose, User as UserIcon } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuthStore()

    const navItems = [
        { height: "h-5", width: "w-5", icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { height: "h-5", width: "w-5", icon: Users, label: "Users", href: "/admin/users" },
        { height: "h-5", width: "w-5", icon: Store, label: "Sellers", href: "/admin/sellers" },
    ]

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const isAuthPage = pathname.includes('/login') || pathname.includes('/signup')

    // Force background to be dark
    return (
        <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-violet-500/30 flex relative overflow-hidden">

            {/* AMBIENT BACKGROUND GLOW */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            {/* SIDEBAR */}
            <aside
                className={`fixed z-50 top-4 bottom-4 left-4 rounded-2xl bg-[#0f172a]/90 backdrop-blur-2xl border border-white/5 shadow-2xl transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-72" : "w-20"}`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30">V</div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight text-white leading-none">VogueX</span>
                                <span className="text-violet-400 font-medium text-[10px] uppercase tracking-wider">Admin Panel</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">V</div>
                    )}
                    {!isAuthPage && (
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                {/* Navigation - HIDDEN ON AUTH PAGES */}
                {!isAuthPage && (
                    <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-violet-300"}`} />
                                    {isSidebarOpen && <span className="font-medium text-sm tracking-wide">{item.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                )}

                {/* User Profile / Logout - HIDDEN ON AUTH PAGES */}
                {!isAuthPage && (
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${isSidebarOpen ? "" : "justify-center"}`}
                        >
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
                        </button>
                    </div>
                )}
            </aside>

            {/* MAIN CONTENT AREA */}
            <main
                className={`flex-1 transition-all duration-300 relative z-10 ${isSidebarOpen ? "ml-80" : "ml-28"} mr-6 my-6`}
            >
                {/* Global Header - HIDDEN ON AUTH PAGES */}
                {!isAuthPage && (
                    <header className="flex items-center justify-between mb-8 backdrop-blur-xl bg-[#0f172a]/50 p-4 rounded-2xl border border-white/5 sticky top-0 z-40 shadow-xl">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {pathname === '/admin/dashboard' ? 'Overview' : (pathname.split('/').pop() || '').charAt(0).toUpperCase() + (pathname.split('/').pop() || '').slice(1)}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                System Operational
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-[#020617] shadow-lg flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </header>
                )}

                {children}
            </main>
        </div>
    )
}
