/**
 * Multi-Armed Bandit (MAB) Engine
 * Implements an Epsilon-Greedy strategy to optimize UI layouts.
 * Epsilon (exploration rate) determines how often we try a sub-optimal variant to find "new winners".
 */

const STORAGE_KEY = 'voguex_mab_stats'
const EPSILON = 0.1 // 10% of users see random variation

interface VariantStats {
    variant: string
    views: number
    clicks: number
}

class MABEngine {
    private stats: Record<string, VariantStats> = {}

    constructor() {
        this.loadStats()
    }

    private loadStats() {
        if (typeof window === 'undefined') return
        const saved = localStorage.getItem(STORAGE_KEY)
        this.stats = saved ? JSON.parse(saved) : {}
    }

    private saveStats() {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats))
    }

    /**
     * Choose the best variant using Epsilon-Greedy logic.
     * @param component The name of the UI component (e.g., 'bento-grid')
     * @param variants Array of variant IDs
     */
    selectVariant(component: string, variants: string[]): string {
        // Initialize stats if missing
        variants.forEach(v => {
            const key = `${component}:${v}`
            if (!this.stats[key]) {
                this.stats[key] = { variant: v, views: 0, clicks: 0 }
            }
        })

        let selection: string

        // Exploration: Choose random
        if (Math.random() < EPSILON) {
            selection = variants[Math.floor(Math.random() * variants.length)]
            console.log(`🎰 MAB Explore: Choosing random variant ${selection} for ${component}`)
        } 
        // Exploitation: Choose winner by CTR
        else {
            let bestCTR = -1
            selection = variants[0]

            variants.forEach(v => {
                const s = this.stats[`${component}:${v}`]
                const ctr = s.views === 0 ? 0 : s.clicks / s.views
                if (ctr > bestCTR) {
                    bestCTR = ctr
                    selection = v
                }
            })
            console.log(`🎯 MAB Exploit: Choosing winning variant ${selection} (CTR: ${(bestCTR * 100).toFixed(2)}%) for ${component}`)
        }

        // Track the view
        this.stats[`${component}:${selection}`].views++
        this.saveStats()

        return selection
    }

    /**
     * Track a click on a specific variant
     */
    trackClick(component: string, variant: string) {
        const key = `${component}:${variant}`
        if (this.stats[key]) {
            this.stats[key].clicks++
            this.saveStats()
            console.log(`📈 MAB Profit: Variant ${variant} clicked! Total clicks: ${this.stats[key].clicks}`)
        }
    }
}

export const mabEngine = new MABEngine()
