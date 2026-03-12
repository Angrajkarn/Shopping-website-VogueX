import { useEffect, useRef } from 'react'
import { affinityEngine } from '@/lib/affinity-engine'

/**
 * useImpressionTracker Hook
 * Monitors a product's visibility. If viewed for > 2s without interaction,
 * it sends an 'ignore' signal to the affinity engine.
 */
export function useImpressionTracker(id: string, category: string) {
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const hasBeenIgnored = useRef(false)

    useEffect(() => {
        // We only care about tracking impressions on the client
        if (typeof window === 'undefined') return

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start timer when product enters view
                    timerRef.current = setTimeout(() => {
                        if (!hasBeenIgnored.current) {
                            affinityEngine.track(category, 'ignore')
                            hasBeenIgnored.current = true
                        }
                    }, 2000) // 2 seconds threshold for "ignored"
                } else {
                    // Reset if product leaves view before 2s
                    if (timerRef.current) {
                        clearTimeout(timerRef.current)
                        timerRef.current = null
                    }
                }
            })
        }, { threshold: 0.5 }) // Must be 50% visible

        const element = document.getElementById(`product-${id}`)
        if (element) {
            observerRef.current.observe(element)
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (observerRef.current) observerRef.current.disconnect()
        }
    }, [id, category])

    // Call this if the user actually interacts (to cancel 'ignore')
    const markAsEngaged = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        hasBeenIgnored.current = true // Prevent 'ignore' signal if they click/hover
    }

    return { markAsEngaged }
}
