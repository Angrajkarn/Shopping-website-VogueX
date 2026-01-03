"use client"

import { usePathname } from "next/navigation"

interface MainLayoutWrapperProps {
    children: React.ReactNode
    navbar: React.ReactNode
    footer: React.ReactNode
    sidebar: React.ReactNode
}

export function MainLayoutWrapper({ children, navbar, footer, sidebar }: MainLayoutWrapperProps) {
    const pathname = usePathname()
    // Check if we are on the seller or admin page or any sub-route of it
    const isExcluded = pathname?.startsWith("/seller") || pathname?.startsWith("/admin")

    if (isExcluded) {
        return <main className="flex-1">{children}</main>
    }

    return (
        <>
            {navbar}
            {sidebar}
            <main className="flex-1 pt-16">
                {children}
            </main>
            {footer}
        </>
    )
}
