import { useEffect, useRef } from 'react'
import { useAnalytics } from './useAnalytics'
import { usePathname } from 'next/navigation'

export const usePageTracking = (product_id?: string | number, metadata: any = {}) => {
    const { track } = useAnalytics()
    const pathname = usePathname()

    // Refs to store state without triggering re-renders
    const startTime = useRef<number>(Date.now())
    const maxScroll = useRef<number>(0)
    const tracked = useRef<boolean>(false)

    useEffect(() => {
        // Reset on mount / path change
        startTime.current = Date.now()
        maxScroll.current = 0
        tracked.current = false

        const handleScroll = () => {
            const scrollPercent = Math.min(
                100,
                Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                )
            )
            if (scrollPercent > maxScroll.current) {
                maxScroll.current = scrollPercent
            }
        }

        window.addEventListener('scroll', handleScroll)

        // Cleanup: Send "EXIT" or "PageSummary" event
        return () => {
            if (tracked.current) return
            tracked.current = true

            const duration = (Date.now() - startTime.current) / 1000 // Seconds

            // Only track meaningful visits (> 2 seconds)
            if (duration > 2) {
                // Use Navigator.sendBeacon for reliable exit tracking if available, 
                // but since api.trackEvent is async fetch, we might miss it on tab close.
                // However, for single page navigation (Component Unmount), fetch is fine.

                track('EXIT', {
                    product_id,
                    metadata: {
                        ...metadata,
                        duration_seconds: duration,
                        scroll_depth_percent: maxScroll.current,
                        path: pathname
                    }
                })
            }

            window.removeEventListener('scroll', handleScroll)
        }
    }, [pathname, product_id]) // Dependency on pathname allows reset
}
