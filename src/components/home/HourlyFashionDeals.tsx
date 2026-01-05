"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

export function HourlyFashionDeals() {
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number }>({ h: 2, m: 14, s: 55 })

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch "Fashion" category products
                const res = await api.getProducts("Women", 10)
                const products = res.products.slice(0, 5).map(p => ({
                    id: p.id,
                    name: p.title,
                    price: `₹${p.price.toLocaleString()}`,
                    oldPrice: `₹${(p.price * 1.5).toLocaleString()}`,
                    discount: "UP TO 60% OFF",
                    image: p.thumbnail,
                }))
                setDeals(products)
            } catch (err) {
                console.error("Failed to fetch hourly deals", err)
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

    if (loading) return null

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
                            <Link href={`/products/${item.id}`}>
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
                            </Link>
                        </motion.div>
                    ))}

                    {/* View All Card */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-lg p-2 border border-dashed border-slate-300 hover:border-slate-900 hover:shadow-md cursor-pointer group flex flex-col items-center justify-center min-h-[250px]"
                    >
                        <Link href="/products?category=Women" className="w-full h-full flex flex-col items-center justify-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-3 group-hover:bg-slate-900 transition-colors">
                                <ChevronRight className="w-6 h-6 text-slate-900 group-hover:text-white" />
                            </div>
                            <span className="font-bold text-slate-900">View All</span>
                            <span className="text-xs text-slate-500 mt-1">Hourly Deals</span>
                        </Link>
                    </motion.div>
                </div>

                <div className="mt-6 text-center">
                    <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-white hover:text-slate-900" asChild>
                        <Link href="/products?category=Women">View All Deals</Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}
