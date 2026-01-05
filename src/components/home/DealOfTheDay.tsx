"use client"

import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const deals = [
    {
        id: 1,
        name: "Apple Watch Series 8",
        price: 32999,
        originalPrice: 45900,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2564&auto=format&fit=crop",
        discount: "28% OFF",
        timeLeft: "10h : 15m"
    },
    {
        id: 2,
        name: "Nike Air Jordan 1",
        price: 11999,
        originalPrice: 18999,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop",
        discount: "35% OFF",
        timeLeft: "04h : 22m"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 24990,
        originalPrice: 29990,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2588&auto=format&fit=crop",
        discount: "16% OFF",
        timeLeft: "08h : 12m"
    },
    {
        id: 4,
        name: "Marshall Stanmore II",
        price: 24999,
        originalPrice: 31999,
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=2626&auto=format&fit=crop",
        discount: "21% OFF",
        timeLeft: "12h : 00m"
    },
    {
        id: 5,
        name: "Ray-Ban Aviator",
        price: 6590,
        originalPrice: 8990,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2670&auto=format&fit=crop",
        discount: "26% OFF",
        timeLeft: "06h : 45m"
    }
]

export function DealOfTheDay() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

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
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="min-w-[200px] md:min-w-[240px] bg-white p-3 rounded-xl border hover:shadow-lg transition-all cursor-pointer snap-start group shrink-0"
                            >
                                <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                        {deal.discount}
                                    </div>
                                </div>
                                <h3 className="font-medium text-slate-900 truncate text-sm">{deal.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-green-600 font-bold text-lg">₹{deal.price.toLocaleString()}</span>
                                    <span className="text-slate-400 text-xs line-through">₹{deal.originalPrice.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">Ends in {deal.timeLeft}</p>
                            </motion.div>
                        ))}

                        {/* "View All" Card */}
                        <div className="min-w-[150px] flex items-center justify-center bg-white rounded-xl border cursor-pointer hover:bg-gray-50 snap-start shrink-0">
                            <div className="text-center">
                                <h4 className="font-bold text-slate-600 text-sm">View All</h4>
                                <ChevronRight className="w-5 h-5 mx-auto text-slate-400 mt-1" />
                            </div>
                        </div>
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
