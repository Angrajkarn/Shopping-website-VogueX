import { useEffect } from 'react'
import { api } from '@/lib/api'

interface PageTrackingOptions {
    category?: string
    brand?: string
}

export function usePageTracking(productId?: number, options?: PageTrackingOptions) {
    useEffect(() => {
        if (!productId) return

        const startTime = Date.now()
        let maxScroll = 0

        const handleScroll = () => {
            const percent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
            if (percent > maxScroll) maxScroll = percent
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            const duration = Math.round((Date.now() - startTime) / 1000)
            window.removeEventListener('scroll', handleScroll)

            // Send tracking data on unmount/change
            if (duration > 2) { // Only track meaningful views
                api.trackPageExit({
                    product_id: productId,
                    duration_seconds: duration,
                    scroll_depth_percent: maxScroll,
                    ...options
                })
            }
        }
    }, [productId, options?.category]) // tracking deps
}
