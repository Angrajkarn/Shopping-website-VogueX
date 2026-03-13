"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useCollaboration } from "@/context/CollaborationContext"

export const CollaborationOverlays: React.FC = () => {
    const { lastEvent } = useCollaboration()
    const [notifications, setNotifications] = useState<any[]>([])

    useEffect(() => {
        if (lastEvent?.type === 'product_like') {
            const id = Date.now()
            setNotifications(prev => [...prev, { id, ...lastEvent }])
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id))
            }, 5000)
        }
    }, [lastEvent])

    return (
        <div className="fixed inset-0 pointer-events-none z-[47] flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {notifications.map(notif => (
                    <motion.div
                        key={notif.id}
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: 1, 
                            y: [50, -200],
                            x: Math.random() * 200 - 100 
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="absolute flex flex-col items-center gap-2"
                    >
                        <div className="relative">
                            <Heart className="w-12 h-12 text-red-500 fill-red-500 shadow-xl" />
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute inset-0 bg-red-400 rounded-full blur-xl"
                            />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border">
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                                {notif.user} liked {notif.product_name || "a product"}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
