"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, Sparkles, TrendingUp } from "lucide-react"
import { useLoyalty } from "@/context/VogueXCoinsContext"
import { cn } from "@/lib/utils"

export const CoinWallet: React.FC = () => {
    const { coins, lastEarned, isLoading } = useLoyalty()
    const [displayCoins, setDisplayCoins] = useState(coins)
    const [isHighlighting, setIsHighlighting] = useState(false)

    // Smoothly animate the number update
    useEffect(() => {
        if (coins !== displayCoins) {
            const diff = coins - displayCoins
            const step = diff > 0 ? 1 : -1
            const interval = setInterval(() => {
                setDisplayCoins(prev => {
                    if (prev === coins) {
                        clearInterval(interval)
                        return prev
                    }
                    return prev + step
                })
            }, 20)
            return () => clearInterval(interval)
        }
    }, [coins, displayCoins])

    useEffect(() => {
        if (lastEarned) {
            setIsHighlighting(true)
            const timer = setTimeout(() => setIsHighlighting(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [lastEarned])

    if (isLoading && coins === 0) return null

    return (
        <div className="fixed top-20 right-4 z-[45] flex flex-col items-end gap-2 pointer-events-none">
            {/* Main Wallet Badge */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={cn(
                    "pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full",
                    "bg-black/60 backdrop-blur-md border border-amber-500/30 shadow-lg shadow-amber-500/10",
                    "group cursor-pointer hover:border-amber-500/60 transition-colors",
                    isHighlighting && "border-amber-400 shadow-amber-500/30"
                )}
            >
                <div className="relative">
                    <Coins className={cn(
                        "w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform",
                        isHighlighting && "animate-bounce"
                    )} />
                    {isHighlighting && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.5, 0] }}
                            className="absolute -top-1 -right-1"
                        >
                            <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>
                    )}
                </div>
                
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold leading-tight">
                        VogueX Coins
                    </span>
                    <span className="text-sm font-black text-white leading-none">
                        {displayCoins.toLocaleString()}
                    </span>
                </div>

                <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
            </motion.div>

            {/* Notification Toast */}
            <AnimatePresence>
                {lastEarned && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 1.2 }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-lg shadow-xl flex items-center gap-2"
                    >
                        <span className="text-white font-bold text-sm">+{lastEarned}</span>
                        <Coins className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-medium">Earned!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
