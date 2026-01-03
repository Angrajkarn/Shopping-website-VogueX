"use client"

import { SellerSidebar } from "@/components/seller/SellerSidebar"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, user, _hasHydrated } = useAuthStore()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted && _hasHydrated) {
            if (!isAuthenticated) {
                router.push('/seller/login')
            }
            // Optional: Check if user.is_seller is true? 
            // For now assuming login implies access or we add a check page.
        }
    }, [isMounted, _hasHydrated, isAuthenticated, router])

    if (!isMounted || !_hasHydrated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            </div>
        )
    }

    if (!isAuthenticated) return null

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SellerSidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                <div className="container mx-auto px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
