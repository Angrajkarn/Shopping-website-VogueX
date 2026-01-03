"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, MapPin } from "lucide-react"

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Ahmedabad"]
const PRODUCTS = [
    "Red Silk Saree", "Blue Denim Jacket", "Cotton Kurta Set",
    "Wireless Headphones", "Running Shoes", "Golden Necklace",
    "Smart Watch", "Designer Handbag", "Sunglasses"
]

import { useAnalytics } from "@/hooks/useAnalytics"

export function LiveFOMOTicker() {
    const { track } = useAnalytics()
    const [notification, setNotification] = useState<{ city: string, product: string, time: string } | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Initial delay
        const initTimeout = setTimeout(() => {
            triggerNotification()
        }, 5000)

        // Random intervals
        const interval = setInterval(() => {
            triggerNotification()
        }, 15000) // Every 15s

        return () => {
            clearTimeout(initTimeout)
            clearInterval(interval)
        }
    }, [])

    const triggerNotification = () => {
        const city = CITIES[Math.floor(Math.random() * CITIES.length)]
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]

        setNotification({
            city,
            product,
            time: "Just now"
        })
        setIsVisible(true)

        // Hide after 5s
        setTimeout(() => setIsVisible(false), 5000)
    }

    return (
        <AnimatePresence>
            {isVisible && notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 left-6 z-50 max-w-sm"
                >
                    <div
                        className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg p-3 flex items-center gap-3 pr-6 cursor-pointer hover:bg-white transition-colors"
                        onClick={() => {
                            track('VIEW', { metadata: { source: 'fomo_ticker', product: notification.product } })
                            setIsVisible(false)
                        }}
                    >
                        <div className="bg-green-100 p-2 rounded-full">
                            <ShoppingBag className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Someone in <span className="font-bold text-slate-900">{notification.city}</span>
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                purchased <span className="font-semibold text-primary">{notification.product}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-green-600 font-medium">{notification.time}</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
