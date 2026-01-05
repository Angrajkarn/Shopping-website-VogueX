"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/MagneticButton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "Summer Collection 2026",
        subtitle: "Discover the hottest trends for the season.",
        cta: "Shop Women",
        link: "/products?category=Women"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        title: "Exclusive Designer Wear",
        subtitle: "Elevate your style with premium brands.",
        cta: "Explore Luxury",
        link: "/products?sort=price_desc"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2071&auto=format&fit=crop",
        title: "Urban Explorer",
        subtitle: "Navigate the city in style.",
        cta: "Shop Men",
        link: "/products?category=Men"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1618932260643-2b6795a23390?q=80&w=2070&auto=format&fit=crop",
        title: "Modern Minimalist",
        subtitle: "Essentials for the contemporary wardrobe.",
        cta: "Shop All",
        link: "/products"
    }
]

export function HeroCarousel() {
    const [current, setCurrent] = React.useState(0)
    const router = useRouter()

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    }

    React.useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-black group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover opacity-70"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="max-w-4xl px-4 z-20">
                    <motion.h1
                        key={`title-${current}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-4 text-5xl font-black tracking-tighter text-white md:text-8xl drop-shadow-lg"
                    >
                        {slides[current].title}
                    </motion.h1>
                    <motion.p
                        key={`subtitle-${current}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-8 text-xl text-gray-100 md:text-3xl font-light tracking-wide drop-shadow-md"
                    >
                        {slides[current].subtitle}
                    </motion.p>
                    <motion.div
                        key={`cta-${current}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link href={slides[current].link}>
                            <Button
                                size="lg"
                                className="bg-black text-white hover:bg-black/90 hover:scale-105 transition-all rounded-full px-12 h-16 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/20"
                            >
                                {slides[current].cta}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-30 h-12 w-12 rounded-full backdrop-blur-sm border border-white/20"
                onClick={prevSlide}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-30 h-12 w-12 rounded-full backdrop-blur-sm border border-white/20"
                onClick={nextSlide}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-12 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
                            }`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    )
}
