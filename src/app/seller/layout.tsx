"use client"

import { SellerNavbar } from "@/components/seller/seller-navbar"
import { SellerFooter } from "@/components/seller/seller-footer"
import { usePathname } from "next/navigation"

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isDashboard = pathname?.startsWith('/seller/dashboard')

    if (isDashboard) {
        return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SellerNavbar />
            {children}
            <SellerFooter />
        </div>
    )
}
