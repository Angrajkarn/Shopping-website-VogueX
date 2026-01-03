import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from './api'

interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    phone_number?: string
    super_coins?: number
    is_plus_member?: boolean
    profile_picture?: string | null
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    _hasHydrated: boolean
    login: (token: string) => Promise<void>
    logout: () => void
    fetchUser: () => Promise<void>
    setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setHasHydrated: (state) => {
                set({ _hasHydrated: state })
            },

            login: async (token: string) => {
                set({ token, isAuthenticated: true })
                // Sync to cookie for Middleware
                if (typeof document !== 'undefined') {
                    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Strict; Secure`
                }
                try {
                    const user = await api.getProfile(token)
                    set({ user })
                } catch (error) {
                    console.error("Failed to fetch profile during login:", error)
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
                localStorage.removeItem("auth-storage")
                // Remove cookie
                if (typeof document !== 'undefined') {
                    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict; Secure"
                    window.location.href = '/'
                }
            },

            fetchUser: async () => {
                const { token } = get()
                if (!token) return

                try {
                    const user = await api.getProfile(token)
                    set({ user })
                } catch (error) {
                    console.error("Failed to fetch profile:", error)
                    get().logout()
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
                // Recovery: If token exists in storage but cookie is missing, restore it.
                if (state?.token && typeof document !== 'undefined') {
                    if (!document.cookie.includes('auth_token=')) {
                        console.log("Restoring Auth Cookie from Storage")
                        document.cookie = `auth_token=${state.token}; path=/; max-age=604800; SameSite=Strict; Secure`
                    }
                }
            }
        }
    )
)
