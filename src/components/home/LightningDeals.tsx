"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Zap, ChevronRight, ChevronLeft, Flame, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { api, Product } from "@/lib/api"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"

export function LightningDeals() {
    const [timeLeft, setTimeLeft] = useState({ h: 4, m: 23, s: 15 })
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [deals, setDeals] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const addItem = useCartStore(state => state.addItem)

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch random products to simulate "Deals"
                const data = await api.getProducts(undefined, 8, 10)
                setDeals(data.products)
            } catch (error) {
                console.error("Failed to fetch lightning deals", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDeals()
    }, [])

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

    if (loading) return null

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
                        {deals.map((deal, i) => {
                            const claimed = Math.floor(Math.random() * (95 - 40) + 40) // Random claimed % for demo
                            return (
                                <motion.div
                                    key={deal.id}
                                    whileHover={{ y: -8 }}
                                    className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative snap-center shrink-0 hover:shadow-xl transition-all"
                                >
                                    <Link href={`/products/${deal.id}`} className="absolute inset-0 z-0" aria-label={deal.title} />

                                    <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 pointer-events-none">
                                        <Flame className="w-3 h-3 fill-current" />
                                        {claimed}% Claimed
                                    </div>

                                    <div className="relative aspect-square mb-4 bg-slate-50 rounded-lg overflow-hidden pointer-events-none">
                                        <Image
                                            src={(deal.thumbnail && deal.thumbnail.trim() !== "") ? deal.thumbnail : "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop"}
                                            alt={deal.title}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px] mb-2 leading-tight relative z-10 pointer-events-none">
                                        {deal.title}
                                    </h3>

                                    <div className="flex items-end gap-2 mb-3 relative z-10 pointer-events-none">
                                        <span className="text-2xl font-black text-slate-900">₹{deal.price}</span>
                                        <span className="text-sm text-slate-400 line-through mb-1 font-medium">₹{Math.floor((Number(deal.price) || 0) * 1.4)}</span>
                                    </div>

                                    {/* Stock Bar */}
                                    <div className="mb-4 relative z-10 pointer-events-none">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                            <span>Available</span>
                                            <span className="text-red-500">Fast Selling</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                                                style={{ width: `${claimed}%` }}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            if (!deal) return
                                            const price = Number(deal.price) || 0
                                            addItem({
                                                id: String(deal.id),
                                                name: deal.title,
                                                price: price,
                                                image: deal.thumbnail || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop",
                                                quantity: 1
                                            })
                                            toast.success("Added to cart!")
                                        }}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold relative z-10 pointer-events-auto"
                                    >
                                        Add to Cart
                                    </Button>
                                </motion.div>
                            )
                        })}

                        {/* View All Card */}
                        <motion.div
                            whileHover={{ scale: 0.98 }}
                            className="min-w-[200px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col items-center justify-center gap-4 text-center snap-center shrink-0 cursor-pointer relative overflow-hidden"
                        >
                            <Link href="/shop" className="absolute inset-0 z-20" />
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <ArrowRight className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">View All</h3>
                                <p className="text-slate-300 text-sm">Explore all deals</p>
                            </div>
                            <Button variant="outline" className="mt-2 border-white/20 text-white hover:bg-white hover:text-black z-10">
                                See More
                            </Button>
                        </motion.div>

                    </div>

                    {/* Nav Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -ml-2 z-20"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -mr-2 z-20"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>

            </div>
        </section>
    )
}
