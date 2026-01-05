import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function useAnalytics() {
    const [token, setToken] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string>('')

    useEffect(() => {
        // Get Auth Token from Zustand persist storage
        try {
            const stored = localStorage.getItem('auth-storage')
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed.state?.token) {
                    setToken(parsed.state.token)
                }
            }
        } catch (e) {
            console.error("Error parsing auth token for analytics:", e)
        }

        // Get or Create Anonymous Session ID
        try {
            let sid = localStorage.getItem('analytics-session-id') // Changed to localStorage for persistence across tabs
            if (!sid) {
                // If not in local, check session just in case
                sid = sessionStorage.getItem('analytics-session-id')
            }

            if (!sid) {
                sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
                localStorage.setItem('analytics-session-id', sid)
            }

            // Sync session storage
            sessionStorage.setItem('analytics-session-id', sid)

            console.log("Analytics: Initialized with Session ID:", sid)
            setSessionId(sid)
        } catch (e) {
            console.error("Error setting session ID:", e)
        }
    }, [])

    const track = (type: 'VIEW' | 'HOVER' | 'SEARCH' | 'CART_ADD' | 'PURCHASE' | 'EXIT', data: { product_id?: string | number, metadata?: any } = {}) => {
        // Don't track if session ID isn't ready yet (slight race condition on mount)
        if (!sessionId) return

        api.trackEvent({
            interaction_type: type,
            session_id: sessionId,
            product_id: data.product_id,
            metadata: data.metadata || {}
        }, token || undefined)
    }

    return { track, sessionId }
}
