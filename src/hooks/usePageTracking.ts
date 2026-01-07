import { useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { affinityEngine } from '@/lib/affinity-engine'
import { useAnalytics } from '@/hooks/useAnalytics'

interface PageTrackingOptions {
    category?: string
    brand?: string
}

export function usePageTracking(productId?: number, options?: PageTrackingOptions) {
    const { track } = useAnalytics()

    // Refs to prevent duplicate tracking for one-time events
    const trackedDwell = useRef(false)
    const trackedDeepScroll = useRef(false)

    useEffect(() => {
        if (!productId) return

        const startTime = Date.now()
        let maxScroll = 0
        const category = options?.category

        // 1. Time on Page Tracker (30s Dwell Time) - ONE TIME TRIGGER
        const dwellTimer = setTimeout(() => {
            if (!trackedDwell.current) {
                console.log("⏱️ User dwelled > 30s on product")

                // Frontend Brain
                if (category) affinityEngine.track(category, 'time_30s')

                // Backend Analytics
                track('VIEW', {
                    product_id: productId,
                    metadata: { type: 'dwell_time_30s', category, duration: 30 }
                })

                trackedDwell.current = true
            }
        }, 30000)

        // 2. Scroll Logic
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.body.scrollHeight - window.innerHeight
            const percent = Math.round((scrollTop / docHeight) * 100)

            if (percent > maxScroll) maxScroll = percent

            // Deep Scroll Trigger (>60%)
            if (percent > 60 && !trackedDeepScroll.current) {
                console.log("📜 User scrolled deep (>60%)")
                if (category) affinityEngine.track(category, 'deep_scroll')
                trackedDeepScroll.current = true
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            clearTimeout(dwellTimer)
            const duration = Math.round((Date.now() - startTime) / 1000)
            window.removeEventListener('scroll', handleScroll)

            // Send tracking data on unmount/change (Legacy Exit Tracking)
            if (duration > 2) {
                api.trackPageExit({
                    product_id: productId,
                    duration_seconds: duration,
                    scroll_depth_percent: maxScroll,
                    ...options
                })
            }
        }
    }, [productId, options?.category])
}
