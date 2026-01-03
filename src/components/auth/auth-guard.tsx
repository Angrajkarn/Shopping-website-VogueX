"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, _hasHydrated } = useAuthStore()

    useEffect(() => {
        // Only redirect if hydration is complete AND user is not authenticated
        if (_hasHydrated && !isAuthenticated) {
            router.push(`/login?redirect=${pathname}`)
        }
    }, [isAuthenticated, _hasHydrated, router, pathname])

    // Show loader while hydrating OR while authenticated check is processed (if not auth)
    if (!_hasHydrated || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return <>{children}</>
}
