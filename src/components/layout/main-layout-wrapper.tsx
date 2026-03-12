"use client"

import { usePathname } from "next/navigation"
import { MobileNav } from "./MobileNav"

interface MainLayoutWrapperProps {
    children: React.ReactNode
    navbar: React.ReactNode
    footer: React.ReactNode
    sidebar: React.ReactNode
}

import { useState, useEffect } from "react"
import { securityGuardian } from "@/lib/security-guardian"
import { AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MainLayoutWrapper({ children, navbar, footer, sidebar }: MainLayoutWrapperProps) {
    const pathname = usePathname()
    const [isBot, setIsBot] = useState(false)
    const isExcluded = pathname?.startsWith("/seller") || pathname?.startsWith("/admin")

    useEffect(() => {
        const unsubscribe = securityGuardian.subscribe((flagged) => {
            setIsBot(flagged)
        })
        return unsubscribe
    }, [])

    const handleGlobalClick = () => {
        securityGuardian.recordInteraction()
    }

    if (isExcluded) {
        return <main className="flex-1" onClick={handleGlobalClick}>{children}</main>
    }

    return (
        <div onClick={handleGlobalClick} className="relative min-h-screen flex flex-col">
            {navbar}
            {sidebar}
            <main className="flex-1 pt-16 pb-20 md:pb-0">
                {children}
            </main>
            <MobileNav />
            {footer}

            {/* BOT DETECTION OVERLAY */}
            {isBot && (
                <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl border border-red-100 scale-in-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Security Verification</h2>
                        <p className="text-slate-500 mb-8 font-medium">
                            Our Real-time Guardian detected inhuman interaction rhythms. To protect our inventory, we've temporarily paused your session.
                        </p>
                        <div className="space-y-3">
                            <Button 
                                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 gap-2"
                                onClick={() => securityGuardian.reset()}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                I am Human
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full text-slate-400 text-xs gap-1 hover:bg-transparent"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="w-3 h-3" />
                                Refresh Session
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
