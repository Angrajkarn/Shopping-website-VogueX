"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ShoppingBag } from "lucide-react"

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"]
const PRODUCTS = [
    { name: "Nike Air Max", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" },
    { name: "Zara Summer Dress", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=100&q=80" },
    { name: "Sony Headphones", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&q=80" },
    { name: "Rolex Submariner", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&q=80" },
    { name: "RayBan Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&q=80" }
]

export function LiveFOMOTicker() {
    const [notification, setNotification] = useState<{ city: string, product: typeof PRODUCTS[0], time: string } | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Initial delay
        const initialTimer = setTimeout(() => {
            triggerNotification()
        }, 5000)

        // Loop
        const interval = setInterval(() => {
            triggerNotification()
        }, Math.random() * 8000 + 12000) // Random interval between 12-20s

        return () => {
            clearTimeout(initialTimer)
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

        // Auto hide after 5s
        setTimeout(() => setIsVisible(false), 5000)
    }

    if (!notification) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -20, opacity: 0, y: 20 }}
                    animate={{ x: 0, opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-4 left-4 z-50 max-w-[320px]"
                >
                    <div className="bg-white rounded-lg shadow-2xl shadow-slate-200/50 border border-slate-100 p-3 flex items-start gap-3 relative overflow-hidden">

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-purple-500"
                        />

                        <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-slate-100">
                            <Image
                                src={notification.product.image}
                                alt={notification.product.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Real-time Purchase</p>
                            </div>
                            <p className="text-sm font-medium text-slate-700 leading-tight">
                                Someone in <span className="font-bold text-slate-900">{notification.city}</span> purchased <span className="text-purple-600 font-semibold">{notification.product.name}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">{notification.time}</p>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-1 right-1 p-1 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
