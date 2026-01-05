"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getProducts, Product } from "@/lib/api"

export function DealOfTheDay() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [deals, setDeals] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDeals() {
            try {
                // Fetch products sorted by something relevant, e.g., electronics or just random deals
                // For now fetching electronics as a 'deal' category or just first 10
                const data = await getProducts('laptops', 10)
                setDeals(data.products)
            } catch (error) {
                console.error("Failed to fetch deals", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDeals()
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = 300
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount
            } else {
                current.scrollLeft += scrollAmount
            }
        }
    }

    if (loading) return (
        <section className="py-6 bg-blue-50/50 my-4 h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </section>
    )

    if (deals.length === 0) return null

    return (
        <section className="py-6 bg-blue-50/50 my-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">Deals of the Day</h2>
                        <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-sm text-xs font-bold shadow-sm animate-pulse">
                            <Clock className="w-3 h-3" />
                            20h : 15m : 30s Remaining
                        </div>
                    </div>
                    <Link href="/products?sort=discount">
                        <Button variant="outline" className="h-9 bg-blue-600 text-white hover:bg-blue-700 border-none">View All</Button>
                    </Link>
                </div>

                <div className="relative group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
                    >
                        {deals.map((deal, i) => (
                            <Link href={`/product/${deal.id}`} key={deal.id} className="min-w-[200px] md:min-w-[240px] snap-start shrink-0 block">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="h-full bg-white p-3 rounded-xl border hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image src={deal.thumbnail} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                            {Math.round(deal.discountPercentage || 20)}% OFF
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-slate-900 truncate text-sm">{deal.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-green-600 font-bold text-lg">₹{deal.price.toLocaleString()}</span>
                                        <span className="text-slate-400 text-xs line-through">₹{Math.round(deal.price * 1.2).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">Ends in 05h 20m</p>
                                </motion.div>
                            </Link>
                        ))}

                        {/* "View All" Card */}
                        <Link href="/products?sort=discount" className="min-w-[150px] flex items-center justify-center bg-white rounded-xl border cursor-pointer hover:bg-gray-50 snap-start shrink-0">
                            <div className="text-center">
                                <h4 className="font-bold text-slate-600 text-sm">View All</h4>
                                <ChevronRight className="w-5 h-5 mx-auto text-slate-400 mt-1" />
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
