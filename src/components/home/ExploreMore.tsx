"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Plus, Loader2 } from "lucide-react"
import { getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

interface ExploreItem {
    id: number | string
    type: "product" | "ad"
    image: string
    title: string
    price?: string
    brand?: string
    isNew?: boolean
}

// Static Ads to inject mix
const STATIC_ADS: ExploreItem[] = [
    { id: "ad-1", type: "ad", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80", title: "MEGA SALE", price: "MIN 60% OFF", brand: "Sponsored" },
    { id: "ad-2", type: "ad", image: "https://images.unsplash.com/photo-1556742046-548bee6d57c7?w=500&q=80", title: "FLAT ₹500 OFF", price: "Code: NEW500", brand: "Bank Offer" },
]

export function ExploreMore() {
    const [items, setItems] = useState<ExploreItem[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [isVisible, setIsVisible] = useState(false)

    // Advanced Algorithm: Viewport Trigger
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { rootMargin: "300px" }) // Fetch early

        const el = document.getElementById("explore-more-trigger")
        if (el) observer.observe(el)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const fetchMore = async () => {
            // Cache Strategy suitable for "Infinite Scroll" type lists
            // We cache the *initial* load (page 1) to make return visits snappy
            const CACHE_KEY = `explore_feed_v1_p${page}`
            if (page === 1) {
                const cached = sessionStorage.getItem(CACHE_KEY)
                if (cached) {
                    setItems(JSON.parse(cached))
                    return
                }
            }

            setLoading(true)
            try {
                // Algorithm: Fetch Generic products, Randomize Order, Inject Ads
                // We'll fetch different categories based on page to keep it "fresh"
                const categorySeed = page % 2 === 0 ? "mens-shirts" : ""
                const res = await getProducts(categorySeed, 12)

                const products: ExploreItem[] = res.products.map((p: any) => ({
                    id: p.id,
                    type: "product",
                    // Robust Image Fallback
                    image: (p.thumbnail && p.thumbnail.trim() !== "") ? p.thumbnail : "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop",
                    title: p.title,
                    price: formatPrice(p.price),
                    brand: p.brand || "VogueX Choice",
                    isNew: Math.random() > 0.7
                }))

                // Inject 1 Ad for every 6 products
                const mixedFeed = [...products]
                if (products.length > 0) {
                    mixedFeed.splice(3, 0, STATIC_ADS[(page - 1) % STATIC_ADS.length])
                }

                if (page === 1) {
                    setItems(mixedFeed)
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(mixedFeed))
                } else {
                    setItems(prev => [...prev, ...mixedFeed])
                }

            } catch (e) {
                console.error("Explore fetch error", e)
            } finally {
                setLoading(false)
            }
        }

        fetchMore()
    }, [isVisible, page])

    return (
        <section id="explore-more-trigger" className="py-16 bg-slate-50 border-t border-slate-200 min-h-[500px]">
            <div className="container mx-auto px-4">

                <div className="flex items-center gap-4 mb-10">
                    <div className="h-[1px] flex-1 bg-slate-300" />
                    <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Explore More</h2>
                    <div className="h-[1px] flex-1 bg-slate-300" />
                </div>

                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    <AnimatePresence>
                        {items.map((item, idx) => (
                            <motion.div
                                key={`${item.id}-${idx}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 4) * 0.1 }} // Staggered entrance
                                className={`break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 ${item.type === 'ad' ? 'bg-slate-900 text-white' : 'bg-white'}`}
                            >
                                {item.type === 'product' ? (
                                    <Link href={`/products/${item.id}`}>
                                        <div className="relative aspect-[3/4] md:aspect-auto">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={500}
                                                height={600}
                                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                                            </div>
                                            {item.isNew && (
                                                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">NEW</span>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wide">{item.brand}</p>
                                            <h3 className="font-bold text-slate-900 text-sm truncate leading-tight mb-1">{item.title}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-black text-slate-900 text-lg">{item.price}</span>
                                                <div className="bg-slate-100 rounded-full p-2 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    // AD CARD
                                    <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                                        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden opacity-60 mix-blend-overlay">
                                            <Image src={item.image} alt="Ad" fill className="object-cover" />
                                        </div>
                                        <h3 className="font-black text-3xl text-yellow-400 mb-1 leading-none">{item.title}</h3>
                                        <p className="font-bold tracking-widest text-white/80">{item.price}</p>
                                        <Button size="sm" variant="secondary" className="mt-4 w-full font-bold">Shop Offer</Button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-16 text-center">
                    <Button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        variant="outline"
                        size="lg"
                        className="px-12 h-12 rounded-full font-bold text-slate-600 border-slate-300 hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {loading ? "Loading..." : "Load More Products"}
                    </Button>
                </div>
            </div>
        </section>
    )
}
