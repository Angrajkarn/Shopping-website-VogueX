"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance])
}

const collections = [
    {
        id: 1,
        title: "Urban Explorer",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
        description: "Navigate the city in style.",
    },
    {
        id: 2,
        title: "Minimalist Luxe",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
        description: "Less is always more.",
    },
    {
        id: 3,
        title: "Bohemian Rhapsody",
        image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200&q=80",
        description: "Free-spirited fashion.",
    },
]

function ImageSection({ id, title, image, description }: { id: number; title: string; image: string; description: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref })
    const y = useParallax(scrollYProgress, 300)

    return (
        <section className="h-screen flex items-center justify-center relative overflow-hidden snap-center">
            <div ref={ref} className="absolute inset-0 w-full h-full z-0">
                <motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
                    <Image src={image} alt={title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </div>
            <div className="relative z-10 text-center text-white p-8 max-w-2xl">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter"
                >
                    {title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl mb-8 font-light"
                >
                    {description}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-full">
                        Explore Collection
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

export function ParallaxSection() {
    return (
        <div className="bg-black">
            {collections.map((collection) => (
                <ImageSection key={collection.id} {...collection} />
            ))}
        </div>
    )
}
