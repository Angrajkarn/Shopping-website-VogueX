"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingBag, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

const tabs = ["Best Sellers", "New Arrivals", "Top Rated"]

export function TabbedBestSellers() {
    const [activeTab, setActiveTab] = useState("Best Sellers")
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTabProducts = async () => {
            setLoading(true)
            try {
                let sortParam = undefined
                let categoryParam = undefined
                
                // Logic to map tabs to backend filters
                if (activeTab === "Best Sellers") {
                    // Assuming empty sort defaults to popular or we pick a popular category
                    sortParam = "rating" 
                } else if (activeTab === "New Arrivals") {
                    sortParam = "newest"
                } else if (activeTab === "Top Rated") {
                    sortParam = "rating"
                }

                // Fetch real data
                const data = await api.getProducts(categoryParam, 8, 0, undefined, sortParam)
                
                // Transform to match UI if needed (api.getProducts already normalizes mostly)
                setProducts(data.products)
            } catch (error) {
                console.error("Failed to fetch tabbed products", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTabProducts()
    }, [activeTab])

    const getViewAllLink = () => {
        switch (activeTab) {
            case "Best Sellers": return "/products?sort=rating"
            case "New Arrivals": return "/products?sort=newest"
            case "Top Rated": return "/products?sort=rating"
            default: return "/products"
        }
    }

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">WEEKLY HIGHLIGHTS</h2>
                        <p className="text-slate-500">Top products making waves this week</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-full border shadow-sm self-start">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                    ? "bg-black text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-h-[400px]">
                     {loading ? (
                        <div className="flex h-full items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {products.map((product) => (
                                    <Link href={`/products/${product.id}`} key={product.id} className="block group">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white rounded-2xl p-3 border group-hover:border-blue-200 group-hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                                        >
                                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-100">
                                                <Image
                                                    src={product.thumbnail || product.images[0] || "/placeholder.png"}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-red-500 transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    {product.rating?.toFixed(1) || "4.5"}
                                                </div>
                                            </div>

                                            <div className="px-2 pb-2 mt-auto">
                                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">{product.title}</h3>
                                                <p className="font-black text-lg">₹{product.price.toLocaleString()}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Link href={getViewAllLink()}>
                        <Button variant="outline" size="lg" className="rounded-full px-8 font-bold border-2 hover:bg-black hover:text-white transition-all h-12">
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
