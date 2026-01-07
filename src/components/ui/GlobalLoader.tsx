"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function GlobalLoader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Trigger loading on route change
        setIsLoading(true)

        // Artificial "Minimum Load Time" simulation for "weighty" feel
        // or just to show the bar. In real Next.js, useTransition is better,
        // but for a global router listener effect:
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800) // 800ms "page load" effect

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed top-0 left-0 right-0 h-1 bg-black z-[9999] origin-left"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full animate-shimmer" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
