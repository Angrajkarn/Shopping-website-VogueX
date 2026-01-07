"use client"

import { useEffect, useRef } from "react"
import { affinityEngine } from "@/lib/affinity-engine"
import { useAnalytics } from "@/hooks/useAnalytics"

export function usePageTracker(category?: string, productId?: string | number) {
    const { track } = useAnalytics()
    const trackedTime = useRef(false)
    const trackedScroll = useRef(false)

    useEffect(() => {
        if (!category) return

        // 1. Time on Page Tracker (30s Dwell Time)
        const timer = setTimeout(() => {
            if (!trackedTime.current) {
                console.log("⏱️ User dwelled > 30s on product")
                affinityEngine.track(category, 'time_30s')

                // Also send to backend
                track('VIEW', {
                    product_id: productId,
                    metadata: { type: 'dwell_time_30s', category }
                })

                trackedTime.current = true
            }
        }, 30000)

        // 2. Scroll Depth Tracker
        const handleScroll = () => {
            if (trackedScroll.current) return

            const scrollHeight = document.documentElement.scrollHeight
            const scrollTop = window.scrollY
            const clientHeight = document.documentElement.clientHeight

            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

            // If scrolled more than 60% of the page
            if (scrollPercentage > 0.6) {
                console.log("📜 User scrolled deep (>60%)")
                affinityEngine.track(category, 'deep_scroll')
                trackedScroll.current = true
                window.removeEventListener('scroll', handleScroll)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [category, productId])
}
