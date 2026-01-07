"use client"

import { useVoice } from "@/context/VoiceControlContext"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Radio } from "lucide-react"
import { useEffect, useState } from "react"

export function VoiceOrb() {
    const { isListening, toggleListening, transcript, isSupported } = useVoice()
    const [showTranscript, setShowTranscript] = useState(false)

    // Hide interface if unsupported
    if (!isSupported) return null

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

            {/* Transcript Bubble */}
            <AnimatePresence>
                {(isListening || transcript) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-xs mb-2"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {isListening ? (
                                <span className="flex gap-1 h-3 items-center">
                                    <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-amber-400 rounded-full" />
                                    <motion.span animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-amber-400 rounded-full" />
                                    <motion.span animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-amber-400 rounded-full" />
                                </span>
                            ) : (
                                <Radio className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {isListening ? "Listening..." : "Heard"}
                            </span>
                        </div>
                        <p className="font-medium text-lg leading-tight">
                            {transcript || "Say 'Go to Men'..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Orb Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-500 ${isListening
                        ? "bg-amber-500 text-black shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                        : "bg-slate-900 text-white border border-slate-700"
                    }`}
            >
                {/* Ripples when active */}
                {isListening && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                        />
                        <motion.div
                            animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                            className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                        />
                    </>
                )}

                {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-6 h-6" />}
            </motion.button>
        </div>
    )
}
