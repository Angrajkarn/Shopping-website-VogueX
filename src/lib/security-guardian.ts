/**
 * Security Guardian (Bot & Fraud Detection)
 * Monitors "Session Rhythm" to distinguish between high-speed bots
 * and natural human shoppers.
 */

const CLICK_THRESHOLD_MS = 100 // Average click speed < 100ms is inhuman
const SAMPLE_SIZE = 5

class SecurityGuardian {
    private lastClickTime: number = 0
    private clickIntervals: number[] = []
    private isFlagged: boolean = false
    private listeners: ((flagged: boolean) => void)[] = []

    /**
     * Call this on every global click/interaction
     */
    recordInteraction() {
        if (this.isFlagged) return

        const now = Date.now()
        if (this.lastClickTime > 0) {
            const interval = now - this.lastClickTime
            this.clickIntervals.push(interval)

            if (this.clickIntervals.length > SAMPLE_SIZE) {
                this.clickIntervals.shift()
                this.analyzeRhythm()
            }
        }
        this.lastClickTime = now
    }

    private analyzeRhythm() {
        const average = this.clickIntervals.reduce((a, b) => a + b, 0) / this.clickIntervals.length
        
        if (average < CLICK_THRESHOLD_MS) {
            console.warn(`🛡️ Security Alert: Bot-like rhythm detected (${average.toFixed(1)}ms average)`)
            this.isFlagged = true
            this.notify()
        }
    }

    private notify() {
        this.listeners.forEach(l => l(this.isFlagged))
    }

    subscribe(callback: (flagged: boolean) => void) {
        this.listeners.push(callback)
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback)
        }
    }

    reset() {
        this.isFlagged = false
        this.clickIntervals = []
        this.notify()
    }

    flaggedStatus() {
        return this.isFlagged
    }
}

export const securityGuardian = new SecurityGuardian()
