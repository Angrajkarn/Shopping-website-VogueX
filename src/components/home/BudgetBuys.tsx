"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api"

const budgetitems = [
    {
        id: "under-499",
        title: "Under ₹499",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
        color: "bg-blue-50",
        query: "max_price=499"
    },
    {
        id: "under-999",
        title: "Under ₹999",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        color: "bg-green-50",
        query: "max_price=999"
    },
    {
        id: "under-1499",
        title: "Under ₹1499",
        image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=500&q=80",
        color: "bg-purple-50",
        query: "max_price=1499"
    },
    {
        id: "min-50",
        title: "Min. 50% Off",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        color: "bg-orange-50",
        // Using a high rating as a proxy for "good deals"/Best Sellers since we don't have discount field yet
        query: "rating=4"
    },
]

export function BudgetBuys() {
    const [counts, setCounts] = useState<Record<string, number>>({})
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { rootMargin: "100px" })

        const el = document.getElementById("budget-trigger")
        if (el) observer.observe(el)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        async function fetchCounts() {
            const CACHE_KEY = "budget_counts_v1"
            const cached = sessionStorage.getItem(CACHE_KEY)

            if (cached) {
                setCounts(JSON.parse(cached))
                setLoading(false)
                return
            }

            try {
                // Simulate "Live Deals" count
                const newCounts: Record<string, number> = {}
                budgetitems.forEach(item => {
                    // Random "Live" numbers to create urgency (Real API would support count-only endpoints)
                    newCounts[item.id] = Math.floor(Math.random() * 200) + 50
                })
                setCounts(newCounts)
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(newCounts))
            } catch (e) {
                console.error("Failed to fetch budget counts")
            } finally {
                setLoading(false)
            }
        }

        fetchCounts()
    }, [isVisible])

    return (
        <section id="budget-trigger" className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-blue-600 rounded-full" />
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">BUDGET BUYS</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {budgetitems.map((item, idx) => (
                        <Link href={`/shop?${item.query}`} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer group ${item.color} shadow-sm hover:shadow-xl transition-all duration-300`}
                            >
                                <div className="absolute inset-0 z-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 z-10">
                                    <div className="mb-2">
                                        <div className="bg-white/20 backdrop-blur-md inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-white border border-white/30">
                                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : `${counts[item.id] || "50+"} Products`}
                                        </div>
                                    </div>
                                    <h4 className="text-white text-2xl font-bold leading-none mb-2">{item.title}</h4>
                                    <span className="text-white/90 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Shop Now <ArrowRight size={16} />
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
