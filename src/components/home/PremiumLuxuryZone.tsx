"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Loader2, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface Product {
    id: number
    name: string
    image: string
    price: string
    category: string
}

export function PremiumLuxuryZone() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)

    // Advanced Algorithm: "Viewport-Aware Predictive Fetching"
    // 1. Only fetch when user is close to the section (Optimization)
    // 2. Cache results per session for instant re-load (Performance)
    // 3. Staggered Entrance Animation (UX)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { rootMargin: "200px" }) // Fetch 200px before it comes into view

        const element = document.getElementById("luxe-zone-trigger")
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const CACHE_KEY = "luxe_store_v2" // Version bump to clear stale data
        const cached = sessionStorage.getItem(CACHE_KEY)

        async function fetchLuxury() {
            if (cached) {
                setProducts(JSON.parse(cached))
                setLoading(false)
                return
            }

            try {
                // "Smart Aggregation Algorithm"
                // 1. Try fetching specific luxury categories
                // 2. Fallback to general high-price items if specific categories fail
                const categories = ["mens-watches", "womens-bags", "sunglasses", "jewellery"]
                const promises = categories.map(cat => getProducts(cat, 5))
                const results = await Promise.all(promises)

                let combined = results.flatMap(r => r.products || [])

                // Fallback Strategy: If specific categories return nothing, fetch generic high-end items
                if (combined.length < 4) {
                    const genericRes = await getProducts("", 20)
                    combined = [...combined, ...genericRes.products]
                }

                // Sort: Highest Price to Lowest (Exclusivity Factor)
                const sorted = combined.sort((a, b) => (b.price || 0) - (a.price || 0))

                // Dedup & Filter
                const unique = sorted
                    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i && (v.price || 0) > 500)
                    .slice(0, 4)

                const mapped = unique.map(p => ({
                    id: p.id,
                    name: p.title,
                    // Robust Image Fallback
                    image: (p.thumbnail && p.thumbnail.trim() !== "") ? p.thumbnail : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
                    price: formatPrice(p.price),
                    category: p.category || "Premium Collection"
                }))

                // FINAL SAFETY NET: If API fails completely, use hardcoded premium data
                if (mapped.length === 0) {
                    setProducts(FALLBACK_LUXURY_ITEMS)
                } else {
                    setProducts(mapped)
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped))
                }

                setLoading(false)

            } catch (e) {
                console.error("Failed to fetch luxury items", e)
                setProducts(FALLBACK_LUXURY_ITEMS) // Fail gracefully to static data
                setLoading(false)
            }
        }

        const delay = cached ? 0 : 500
        const timer = setTimeout(fetchLuxury, delay)
        return () => clearTimeout(timer)

    }, [isVisible])

    // Failsafe Data (Never show empty section)
    const FALLBACK_LUXURY_ITEMS: Product[] = [
        { id: 901, name: "Royal Oak Chronograph", category: "Watches", price: "₹45,999", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80" },
        { id: 902, name: "Signature Leather Tote", category: "Bags", price: "₹12,499", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" },
        { id: 903, name: "Aviator Gold Edition", category: "Sunglasses", price: "₹8,999", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80" },
        { id: 904, name: "Diamond Tennis Bracelet", category: "Jewellery", price: "₹25,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb05220c?w=800&q=80" }
    ]

    return (
        <section id="luxe-zone-trigger" className="py-20 bg-slate-950 text-amber-50 relative overflow-hidden min-h-[600px]">

            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/20 blur-[150px] rounded-full animate-pulse duration-[5000ms]" />

            <div className="container mx-auto px-4 relative z-10">

                <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-serif mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500">
                                The Luxe Store
                            </h2>
                            <p className="text-amber-200/60 text-sm tracking-[0.3em] uppercase font-light">
                                Premium • Authentic • Exclusive
                            </p>
                        </motion.div>
                    </div>
                    <Link href="/shop?min_price=1000">
                        <Button className="mt-6 md:mt-0 bg-amber-100 text-slate-950 hover:bg-white border-none px-8 py-6 font-serif text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                            Enter Boutique
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        // Skeleton Loaders
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-[450px] bg-slate-900/50 rounded-lg animate-pulse border border-slate-800" />
                        ))
                    ) : (
                        products.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/products/${item.id}`}>
                                    <div className="group relative h-[450px] cursor-pointer overflow-hidden rounded-md border border-white/5 bg-slate-900/20 hover:border-amber-500/30 transition-colors">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                                        {/* Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-amber-400 text-xs tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-75 transform -translate-y-2 group-hover:translate-y-0">
                                                {item.category}
                                            </p>
                                            <h3 className="text-2xl font-serif text-white mb-2 leading-tight">{item.name}</h3>
                                            <p className="text-amber-100 font-light text-lg mb-4">{item.price}</p>

                                            <div className="flex items-center gap-2 text-amber-300 group/link">
                                                <span className="text-xs uppercase tracking-widest font-bold group-hover/link:underline decoration-amber-500 underline-offset-4">
                                                    View Details
                                                </span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

            </div>
        </section>
    )
}
