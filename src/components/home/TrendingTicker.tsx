"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, MapPin } from "lucide-react"

const RECENT_SALES = [
    { item: "Urban Cargo Pants", location: "Mumbai", time: "2m ago" },
    { item: "Floral Summer Dress", location: "Delhi", time: "5m ago" },
    { item: "Classic Leather Loafers", location: "Bangalore", time: "12s ago" },
    { item: "Minimalist Watch", location: "Pune", time: "8m ago" },
    { item: "Oversized Hoodie", location: "Hyderabad", time: "1m ago" },
    { item: "Aviator Sunglasses", location: "Chennai", time: "15m ago" },
    { item: "Denim Jacket", location: "Kolkata", time: "45s ago" },
    { item: "Silk Saree", location: "Jaipur", time: "30m ago" },
]

export function TrendingTicker() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-black text-white py-2 overflow-hidden border-b border-white/10">
            <div className="container mx-auto px-4 flex items-center justify-center md:justify-between">
                <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    Live Trends
                </div>

                <div className="flex-1 max-w-md relative h-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center text-sm font-medium"
                        >
                            <span className="text-gray-300 mr-2">Someone in</span>
                            <span className="font-bold text-white flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-500" />
                                {RECENT_SALES[currentIndex].location}
                            </span>
                            <span className="text-gray-300 mx-2">just bought</span>
                            <span className="text-yellow-400 font-bold">{RECENT_SALES[currentIndex].item}</span>
                            <span className="text-xs text-gray-500 ml-2">({RECENT_SALES[currentIndex].time})</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hidden md:block text-xs text-gray-500 font-mono">
                    Real-time Activity
                </div>
            </div>
        </div>
    )
}
