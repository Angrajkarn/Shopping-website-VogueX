"use client"

import { useVoice } from "@/context/VoiceControlContext"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Radio } from "lucide-react"
import { useEffect, useState } from "react"

export function VoiceOrb() {
    const { isListening, isProcessing, toggleListening, transcript, isSupported } = useVoice()
    const [showTranscript, setShowTranscript] = useState(false)

    // Hide interface if unsupported
    if (!isSupported) return null

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

            {/* Transcript Bubble */}
            <AnimatePresence>
                {(isListening || isProcessing || transcript) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-3xl shadow-2xl border border-white/10 max-w-xs mb-3 ring-1 ring-white/5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {isListening ? (
                                <span className="flex gap-1 h-3 items-center">
                                    <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-amber-400 rounded-full" />
                                    <motion.span animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-amber-400 rounded-full" />
                                    <motion.span animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-amber-400 rounded-full" />
                                </span>
                            ) : isProcessing ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <Radio className="w-4 h-4 text-amber-400" />
                                </motion.div>
                            ) : (
                                <Radio className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {isListening ? "Listening" : isProcessing ? "Thinking" : "Heard"}
                            </span>
                        </div>
                        <p className={`font-medium text-lg leading-tight transition-opacity duration-300 ${isProcessing ? "opacity-50" : "opacity-100"}`}>
                            {isProcessing ? "Processing command..." : (transcript || "How can I help?")}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Orb Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${isListening
                        ? "bg-amber-500 text-black shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                        : isProcessing
                            ? "bg-slate-800 text-amber-400"
                            : "bg-slate-950 text-white border border-white/10 hover:border-white/20"
                    }`}
            >
                {/* Ripples when active */}
                {isListening && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                        />
                        <motion.div
                            animate={{ scale: [1, 3], opacity: [0.15, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                            className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                        />
                    </>
                )}

                {isProcessing ? (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <Radio className="w-8 h-8" />
                    </motion.div>
                ) : isListening ? (
                    <Mic className="w-8 h-8" />
                ) : (
                    <MicOff className="w-6 h-6 opacity-60" />
                )}
            </motion.button>
        </div>
    )
}
