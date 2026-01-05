"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

const deals = [
    { id: 1, name: "Zara Summer Dress", price: "₹1,299", oldPrice: "₹2,599", discount: "50% OFF", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80" },
    { id: 2, name: "Urban Jacket", price: "₹2,499", oldPrice: "₹5,999", discount: "58% OFF", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" },
    { id: 3, name: "Nike Air Max", price: "₹4,999", oldPrice: "₹8,999", discount: "45% OFF", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
    { id: 4, name: "Denim Jacket", price: "₹1,499", oldPrice: "₹2,999", discount: "50% OFF", image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&q=80" },
    { id: 5, name: "Classic Watch", price: "₹999", oldPrice: "₹3,999", discount: "75% OFF", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80" },
    { id: 6, name: "Leather Bag", price: "₹3,499", oldPrice: "₹6,999", discount: "50% OFF", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80" },
]

export function HourlyFashionDeals() {
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number }>({ h: 2, m: 14, s: 55 })

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

    return (
        <section className="py-8 bg-blue-50/50">
            <div className="container mx-auto px-4">

                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <Clock className="w-6 h-6 text-red-600 animate-pulse" />
                            Hourly Fashion Deals
                        </h2>
                        <span className="text-sm font-medium text-slate-500 hidden md:inline-block">Grab them before they're gone!</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-4 py-2 rounded shadow-sm border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase mr-2">Ending In</span>
                        <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded font-bold">{String(timeLeft.h).padStart(2, '0')}</div>
                        <span className="font-bold">:</span>
                        <div className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded font-bold">{String(timeLeft.m).padStart(2, '0')}</div>
                        <span className="font-bold">:</span>
                        <div className="bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded font-bold text-sm animate-pulse">{String(timeLeft.s).padStart(2, '0')}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {deals.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-lg p-2 border border-slate-100 hover:shadow-md cursor-pointer group"
                        >
                            <div className="relative aspect-[3/4] mb-2 rounded overflow-hidden bg-slate-100">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
                                    {item.discount}
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-900 truncate">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-base font-bold text-slate-900">{item.price}</span>
                                <span className="text-xs text-slate-400 line-through">{item.oldPrice}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-white hover:text-slate-900">View All Deals</Button>
                </div>

            </div>
        </section>
    )
}
