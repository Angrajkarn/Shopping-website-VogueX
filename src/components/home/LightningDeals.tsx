"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Zap, ChevronRight, ChevronLeft, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import Link from "next/link"

export function LightningDeals() {
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState({ h: 4, m: 23, s: 15 })
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Fetch Real Deals (Simulated by fetching 'Electronics' or random items)
        const fetchDeals = async () => {
            try {
                // Fetching distinct items to simulate "Deals"
                const res = await api.getProducts("Electronics", 10)
                const products = res.products.map(p => ({
                    id: p.id,
                    title: p.title,
                    price: `₹${p.price.toLocaleString()}`,
                    original: `₹${(p.price * 1.4).toLocaleString()}`, // Mock original price
                    claimed: Math.floor(Math.random() * 80) + 10, // Mock claimed %
                    image: p.thumbnail,
                    category: p.category
                }))
                setDeals(products)
            } catch (err) {
                console.error("Failed to fetch deals", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDeals()

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

    if (loading) return null // Or skeleton

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

                    <div className="flex items-center gap-4">
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
                        <Button variant="default" className="hidden md:flex bg-slate-900 text-white" asChild>
                            <Link href="/products?category=Electronics">View All Deals</Link>
                        </Button>
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

                                <Link href={`/products/${deal.id}`} className="block relative aspect-square mb-4 bg-slate-50 rounded-lg overflow-hidden cursor-pointer">
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>

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

                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold" asChild>
                                    <Link href={`/products/${deal.id}`}>View Deal</Link>
                                </Button>
                            </motion.div>
                        ))}
                        {/* View All Card at End of Carousel */}
                        <motion.div
                            whileHover={{ scale: 0.98 }}
                            className="min-w-[200px] flex items-center justify-center bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-300 p-4 shrink-0 snap-center cursor-pointer hover:border-slate-900 group/viewall"
                        >
                            <Link href="/products?category=Electronics" className="flex flex-col items-center gap-2 text-center">
                                <div className="bg-slate-100 p-4 rounded-full group-hover/viewall:bg-slate-900 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-slate-900 group-hover/viewall:text-white" />
                                </div>
                                <span className="font-bold text-slate-900">View All Deals</span>
                            </Link>
                        </motion.div>
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

                <div className="mt-6 md:hidden text-center">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/products?category=Electronics">View All Lightning Deals</Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}
