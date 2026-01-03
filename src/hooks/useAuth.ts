import { useAuthStore } from "@/lib/auth-store"
import { useEffect } from "react"

export function useAuth() {
    const store = useAuthStore()

    // Hydration fix helper
    useEffect(() => {
        useAuthStore.persist.rehydrate()
    }, [])

    return store
}
