"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function VideoBanner() {
    return (
        <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-70"
                        src="https://www.youtube.com/embed/OyE8bIP8Ruk?autoplay=1&mute=1&controls=0&loop=1&playlist=OyE8bIP8Ruk&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&vq=hd1080"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ pointerEvents: 'none' }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 text-center text-white space-y-8 max-w-5xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="inline-block text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                        Spring / Summer 2026
                    </p>
                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-2 mix-blend-overlay">
                        THE NEW VOGUE
                    </h2>
                    <p className="text-xl md:text-2xl font-light tracking-widest uppercase opacity-90">
                        Cinematic Collection
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-4 justify-center items-center"
                >
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-16 font-bold text-lg gap-2 shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all hover:scale-105">
                        <Play className="w-5 h-5 fill-current" /> Watch Campaign
                    </Button>
                    <Button
                        size="lg"
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-full px-10 h-16 font-medium text-lg backdrop-blur-sm transition-all"
                    >
                        Explore Collection
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
