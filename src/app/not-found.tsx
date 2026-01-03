"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[150px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent leading-none select-none"
                >
                    404
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 -mt-10 md:-mt-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Lost in the Metaverse?</h2>
                    <p className="text-xl text-gray-400 max-w-md mx-auto">
                        The page you are looking for seems to have drifted into another dimension.
                    </p>
                    <Link href="/">
                        <Button className="h-12 px-8 text-lg bg-white text-black hover:bg-gray-200 transition-all rounded-full">
                            Return Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
