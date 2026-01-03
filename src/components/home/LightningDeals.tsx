"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Zap, Clock, ChevronRight, ChevronLeft, Flame } from "lucide-react"
import { motion } from "framer-motion"

const deals = [
    {
        id: 1,
        title: "Sony Noise Cancelling Headphones",
        price: "₹14,990",
        original: "₹24,990",
        claimed: 87,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
    },
    {
        id: 2,
        title: "Samsung Gaming Monitor 27\"",
        price: "₹18,499",
        original: "₹32,000",
        claimed: 65,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
    },
    {
        id: 3,
        title: "Logitech Mechanical Keyboard",
        price: "₹8,999",
        original: "₹12,499",
        claimed: 92,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"
    },
    {
        id: 4,
        title: "GoPro Hero 11 Black",
        price: "₹34,990",
        original: "₹45,000",
        claimed: 45,
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80"
    },
    {
        id: 5,
        title: "Instant Pot Duo 7-in-1",
        price: "₹7,999",
        original: "₹11,999",
        claimed: 78,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80"
    }
]

export function LightningDeals() {
    const [timeLeft, setTimeLeft] = useState({ h: 4, m: 23, s: 15 })
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 }
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 }
                return prev
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = 350
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount
            } else {
                current.scrollLeft += scrollAmount
            }
        }
    }

    return (
        <section className="py-8 bg-gradient-to-r from-yellow-50 to-orange-50 my-4 border-y border-orange-100">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 p-2 rounded-full animate-bounce shadow-sm">
                            <Zap className="w-6 h-6 text-black fill-current" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Lightning Deals</h2>
                            <p className="text-sm text-slate-500 font-medium">Limited time offers. Lowest prices of the month.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase mr-1">Ends in</p>
                        <div className="flex items-center gap-1 font-mono font-bold text-lg text-slate-800">
                            <span className="bg-slate-800 text-white px-1.5 rounded">{String(timeLeft.h).padStart(2, '0')}</span>
                            <span>:</span>
                            <span className="bg-slate-800 text-white px-1.5 rounded">{String(timeLeft.m).padStart(2, '0')}</span>
                            <span>:</span>
                            <span className="bg-red-500 text-white px-1.5 rounded animate-pulse">{String(timeLeft.s).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-8 pt-2 px-1 scrollbar-hide snap-x scroll-smooth"
                    >
                        {deals.map((deal, i) => (
                            <motion.div
                                key={deal.id}
                                whileHover={{ y: -8 }}
                                className="min-w-[280px] bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative snap-center shrink-0 hover:shadow-xl transition-all"
                            >
                                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                    <Flame className="w-3 h-3 fill-current" />
                                    {deal.claimed}% Claimed
                                </div>

                                <div className="relative aspect-square mb-4 bg-slate-50 rounded-lg overflow-hidden">
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px] mb-2 leading-tight">
                                    {deal.title}
                                </h3>

                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-2xl font-black text-slate-900">{deal.price}</span>
                                    <span className="text-sm text-slate-400 line-through mb-1 font-medium">{deal.original}</span>
                                </div>

                                {/* Stock Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                        <span>Available</span>
                                        <span className="text-red-500">Fast Selling</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                                            style={{ width: `${deal.claimed}%` }}
                                        />
                                    </div>
                                </div>

                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold">
                                    Add to Cart
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Nav Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -ml-2"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -mr-2"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>

            </div>
        </section>
    )
}
