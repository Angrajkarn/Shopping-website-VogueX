"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

interface CoinsContextType {
    coins: number
    awardCoins: (action: string, amount: number, description: string) => Promise<boolean>
    isLoading: boolean
    lastEarned: number | null
}

const VogueXCoinsContext = createContext<CoinsContextType | undefined>(undefined)

export const VogueXCoinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore()
    const [coins, setCoins] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [lastEarned, setLastEarned] = useState<number | null>(null)

    // Load initial balance
    useEffect(() => {
        const loadBalance = async () => {
            if (isAuthenticated) {
                try {
                    const res = await api.getLoyaltyDashboard()
                    setCoins(res.coins)
                } catch (error) {
                    console.error("Failed to load loyalty dashboard:", error)
                }
            } else {
                // Guest persistence
                const saved = localStorage.getItem("voguex_guest_coins")
                if (saved) setCoins(parseInt(saved))
            }
            setIsLoading(false)
        }

        loadBalance()
    }, [isAuthenticated])

    const awardCoins = useCallback(async (action: string, amount: number, description: string) => {
        try {
            // Check if already awarded in this session to prevent spam
            const sessionStorageKey = `awarded_${action}`
            if (sessionStorage.getItem(sessionStorageKey)) return false

            const res = await api.awardCoins(action, amount, description)
            
            if (res.status === "success" || res.status === "guest_tracked") {
                const newTotal = coins + amount
                setCoins(newTotal)
                setLastEarned(amount)
                
                if (!isAuthenticated) {
                    localStorage.setItem("voguex_guest_coins", newTotal.toString())
                }

                sessionStorage.setItem(sessionStorageKey, "true")
                
                // Clear "last earned" after 3 seconds (for animations)
                setTimeout(() => setLastEarned(null), 3000)
                return true
            }
            return false
        } catch (error) {
            console.error("Error awarding coins:", error)
            return false
        }
    }, [coins, isAuthenticated])

    return (
        <VogueXCoinsContext.Provider value={{ coins, awardCoins, isLoading, lastEarned }}>
            {children}
            {/* Global Session Reward Tracker */}
            <SessionRewardTracker onReward={() => awardCoins('session_duration', 100, '5 Minute Session Reward')} />
        </VogueXCoinsContext.Provider>
    )
}

const SessionRewardTracker: React.FC<{ onReward: () => void }> = ({ onReward }) => {
    useEffect(() => {
        const FIVE_MINUTES = 5 * 60 * 1000
        const timer = setTimeout(() => {
            onReward()
        }, FIVE_MINUTES)

        return () => clearTimeout(timer)
    }, [onReward])

    return null
}

export const useLoyalty = () => {
    const context = useContext(VogueXCoinsContext)
    if (!context) throw new Error("useLoyalty must be used within a VogueXCoinsProvider")
    return context
}
