"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Timer } from "lucide-react"
import { useState, useEffect } from "react"

interface UrgencyBadgeProps {
    show: boolean
    discount: number
}

export function UrgencyBadge({ show, discount }: UrgencyBadgeProps) {
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

    useEffect(() => {
        if (!show) return
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [show])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="absolute top-4 left-4 z-20"
                >
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-2xl shadow-lg flex flex-col items-center gap-0.5 border border-white/20">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter">
                            <Sparkles className="w-3 h-3 fill-white animate-pulse" />
                            Personalized Price
                        </div>
                        <div className="text-lg font-black leading-none py-0.5">
                            Extra {discount}% OFF
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-bold opacity-90">
                            <Timer className="w-2.5 h-2.5" />
                            Expiring in {formatTime(timeLeft)}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
