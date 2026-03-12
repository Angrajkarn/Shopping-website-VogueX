"use client"

/**
 * The Affinity Engine: A Client-Side "Neural" Tracker
 * Tracks user micro-interactions to determine category preferences in real-time.
 */

type CategoryScore = Record<string, number>

interface UserProfile {
    scores: CategoryScore
    lastActive: number
    preferredPriceRange: [number, number]
}

const STORAGE_KEY = "voguex_affinity_brain"

class AffinityEngine {
    private profile: UserProfile

    private listeners: (() => void)[] = []

    constructor() {
        this.profile = this.loadProfile()
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notify() {
        this.listeners.forEach(l => l())
    }

    private loadProfile(): UserProfile {
        if (typeof window === "undefined") return { scores: {}, lastActive: Date.now(), preferredPriceRange: [0, 100000] }

        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : { scores: {}, lastActive: Date.now(), preferredPriceRange: [0, 100000] }
        } catch (e) {
            return { scores: {}, lastActive: Date.now(), preferredPriceRange: [0, 100000] }
        }
    }

    private saveProfile() {
        if (typeof window === "undefined") return
        this.profile.lastActive = Date.now()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile))
        this.notify()
    }

    /**
     * Track an interaction with a category
     * @param category The category slug (e.g., 'mens-shirts')
     * @param type 'view' | 'hover' | 'click' | 'cart' | 'time_30s' | 'deep_scroll' | 'ignore'
     */
    track(category: string, type: 'view' | 'hover' | 'click' | 'cart' | 'time_30s' | 'deep_scroll' | 'ignore') {
        const weights = {
            view: 1,      // Passive view
            ignore: -1,   // Negative signal (viewed but ignored)
            hover: 3,     // Interest
            click: 10,    // Intent
            time_30s: 15, // Engagement (reading/comparing)
            deep_scroll: 5, // Researching
            cart: 50      // Commitment
        }

        const score = weights[type] || 1

        this.profile.scores[category] = (this.profile.scores[category] || 0) + score
        
        // Floor the score at 0 to avoid massive negative debt
        if (this.profile.scores[category] < 0) this.profile.scores[category] = 0

        this.saveProfile()

        console.log(`🧠 Affinity Update: ${category} (${type}) ${score > 0 ? '+' : ''}${score} = ${this.profile.scores[category]}`)
    }

    /**
     * Re-ranks an array of items based on accumulated category affinity scores.
     * Items from higher-scoring categories move to the front.
     */
    reRank<T>(items: T[], getCategory: (item: T) => string): T[] {
        return [...items].sort((a, b) => {
            const catA = getCategory(a)
            const catB = getCategory(b)
            const scoreA = this.profile.scores[catA] || 0
            const scoreB = this.profile.scores[catB] || 0
            return scoreB - scoreA
        })
    }

    /**
     * Get sorted list of preferred categories
     */
    getTopCategories(): string[] {
        return Object.entries(this.profile.scores)
            .sort(([, a], [, b]) => b - a)
            .map(([cat]) => cat)
    }

    /**
     * Get the #1 top category
     */
    getDominantCategory(): string | null {
        const top = this.getTopCategories()
        return top.length > 0 ? top[0] : null
    }

    /**
     * Reset profile (for debugging)
     */
    reset() {
        this.profile = { scores: {}, lastActive: Date.now(), preferredPriceRange: [0, 100000] }
        this.saveProfile()
    }
}

export const affinityEngine = new AffinityEngine()
