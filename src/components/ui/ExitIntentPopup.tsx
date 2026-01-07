"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasBeenShown, setHasBeenShown] = useState(false)

    useEffect(() => {
        // Only run on desktop technically (mouse events)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 0 && !hasBeenShown) {
                // User is moving mouse to top of browser (tabs/close button)
                const alreadyShownSession = sessionStorage.getItem("exit_intent_shown")

                if (!alreadyShownSession) {
                    setIsVisible(true)
                    setHasBeenShown(true)
                    sessionStorage.setItem("exit_intent_shown", "true")
                }
            }
        }

        document.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [hasBeenShown])

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                    {/* Header Image/Gradient */}
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        </div>
                        <Gift className="w-16 h-16 text-white animate-bounce" />
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                            Wait! Don't Go Empty Handed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We noticed you're heading out. Here's a special gift just for you to complete your style upgrade.
                        </p>

                        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6">
                            <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-1">Use Code</p>
                            <p className="text-3xl font-black text-purple-700 tracking-widest font-mono">EXIT10</p>
                            <p className="text-xs text-purple-400 mt-1">For Flat 10% OFF</p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsVisible(false)}
                            >
                                No thanks
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                                onClick={() => {
                                    setIsVisible(false)
                                    // Logic to auto-apply coupon could go here
                                    window.location.href = "/shop"
                                }}
                            >
                                Shop w/ 10% OFF
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
