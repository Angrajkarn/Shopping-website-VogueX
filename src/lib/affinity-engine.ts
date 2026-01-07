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

    constructor() {
        this.profile = this.loadProfile()
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
    }

    /**
     * Track an interaction with a category
     * @param category The category slug (e.g., 'mens-shirts')
     * @param type 'view' | 'hover' | 'click' | 'cart' | 'time_30s' | 'deep_scroll'
     */
    track(category: string, type: 'view' | 'hover' | 'click' | 'cart' | 'time_30s' | 'deep_scroll') {
        const weights = {
            view: 1,      // Passive view
            hover: 3,     // Interest
            click: 10,    // Intent
            time_30s: 15, // Engagement (reading/comparing)
            deep_scroll: 5, // Researching
            cart: 50      // Commitment
        }

        const score = weights[type] || 1

        // Decay logic: Reduce other categories slightly to keep focus sharp
        // Object.keys(this.profile.scores).forEach(key => {
        //     if (key !== category) this.profile.scores[key] *= 0.99
        // })

        this.profile.scores[category] = (this.profile.scores[category] || 0) + score
        this.saveProfile()

        console.log(`🧠 Affinity Update: ${category} (${type}) +${score} = ${this.profile.scores[category]}`)
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
