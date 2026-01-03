"use client"

import { motion } from "framer-motion"

interface InfiniteMarqueeProps {
  items: string[]
  direction?: "left" | "right"
  speed?: number
}

export function InfiniteMarquee({ items, direction = "left", speed = 20 }: InfiniteMarqueeProps) {
  return (
    <div className="relative flex overflow-hidden bg-black py-4 border-y border-white/10">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="mx-8 text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/20 uppercase tracking-widest"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
