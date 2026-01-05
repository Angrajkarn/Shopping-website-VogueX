"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Plus, Sparkles } from "lucide-react"
import { api } from "@/lib/api"

export function ExploreMore() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // algorithmic fetch
                const { products, term } = await api.getInspiredProducts()
                setSearchTerm(term || "Trending Now")

                // Fallback if no history or limited results
                let displayProducts = products
                if (!products || products.length < 4) {
                    const fallback = await api.getProducts(undefined, 12, 0, undefined, "random")
                    displayProducts = fallback.products
                }

                // Inject Ads / Promos into the feed (algorithmically placed)
                const mixedFeed = []
                const promoCards = [
                    { id: 'ad-1', type: 'ad', title: "FLASH SALE", price: "50% OFF", bg: "bg-gradient-to-br from-yellow-400 to-orange-500", text: "text-slate-900", link: "/products?sort=price_asc" },
                    { id: 'ad-2', type: 'ad', title: "NEW SEASON", price: "EXPLORE", bg: "bg-slate-900", text: "text-white", link: "/products?sort=newest" }
                ]

                let promoIndex = 0
                for (let i = 0; i < displayProducts.length; i++) {
                    mixedFeed.push({ ...displayProducts[i], type: 'product' })
                    // Insert promo every 6 items
                    if ((i + 1) % 6 === 0 && promoCards[promoIndex]) {
                        mixedFeed.push(promoCards[promoIndex])
                        promoIndex = (promoIndex + 1) % promoCards.length
                    }
                }

                setItems(mixedFeed)
            } catch (error) {
                console.error("Feed error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeed()
    }, [])

    if (loading) return null

    return (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4">

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-slate-300" />
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Explore More
                        </h2>
                        {searchTerm && <p className="text-xs text-slate-500">Inspired by your interest in <span className="font-bold text-slate-700">{searchTerm}</span></p>}
                    </div>
                    <div className="h-[1px] flex-1 bg-slate-300" />
                </div>

                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    {items.map((item, idx) => {
                        if (item.type === 'ad') {
                            return (
                                <Link href={item.link || "/products"} key={item.id} className="block break-inside-avoid mb-4 group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className={`relative rounded-xl overflow-hidden shadow-md p-6 flex flex-col items-center justify-center text-center min-h-[250px] ${item.bg}`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h3 className={`font-black text-3xl mb-2 ${item.text}`}>{item.title}</h3>
                                        <p className={`font-bold tracking-widest ${item.text} opacity-80`}>{item.price}</p>
                                        <Button size="sm" variant="secondary" className="mt-4 rounded-full group-hover:scale-105 transition-transform">Shop Now</Button>
                                    </motion.div>
                                </Link>
                            )
                        }

                        return (
                            <Link href={`/products/${item.id}`} key={item.id} className="block break-inside-avoid">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-white mb-4"
                                >
                                    <div className="relative w-full">
                                        <Image
                                            src={item.thumbnail || (item.images && item.images[0]) || "/placeholder.png"}
                                            alt={item.title}
                                            width={500}
                                            height={600}
                                            className="w-full h-auto object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <p className="text-xs text-slate-400 font-bold mb-1 uppercase bg-slate-50 inline-block px-1 rounded">{item.category}</p>
                                        <h3 className="font-medium text-slate-900 text-sm truncate leading-tight">{item.title}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-slate-900">₹{item.price.toLocaleString()}</span>
                                            <div className="border border-slate-200 rounded p-1 hover:bg-slate-900 hover:text-white transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/products">
                        <Button variant="outline" size="lg" className="px-12 rounded-full font-bold text-slate-600 border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            Load More Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
