"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingBag } from "lucide-react"

const tabs = ["Best Sellers", "New Arrivals", "Top Rated"]

const products = {
    "Best Sellers": [
        { id: 1, name: "Oversized Cotton Tee", price: 1299, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop", rating: 4.8 },
        { id: 2, name: "Slim Fit Chinos", price: 2499, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2000&auto=format&fit=crop", rating: 4.5 },
        { id: 3, name: "Classic Denim Jacket", price: 3999, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2000&auto=format&fit=crop", rating: 4.7 },
        { id: 4, name: "White Sneakers", price: 2999, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2000&auto=format&fit=crop", rating: 4.9 },
    ],
    "New Arrivals": [
        { id: 5, name: "Summer Floral Dress", price: 2299, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2000&auto=format&fit=crop", rating: 4.6 },
        { id: 6, name: "Linen Shirt", price: 1899, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2000&auto=format&fit=crop", rating: 4.4 },
        { id: 7, name: "Cargo Pants", price: 2199, image: "https://images.unsplash.com/photo-1517445312882-5660682fa7e5?q=80&w=2000&auto=format&fit=crop", rating: 4.7 },
        { id: 8, name: "Striped Polo", price: 1499, image: "https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2000&auto=format&fit=crop", rating: 4.5 },
    ],
    "Top Rated": [
        { id: 9, name: "Premium Leather Belt", price: 999, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2000&auto=format&fit=crop", rating: 5.0 },
        { id: 10, name: "Designer Sunglasses", price: 4999, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop", rating: 4.9 },
        { id: 11, name: "Smart Watch Series 5", price: 15999, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2000&auto=format&fit=crop", rating: 4.8 },
        { id: 12, name: "Running Shoes Pro", price: 8999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop", rating: 4.9 },
    ]
}

export function TabbedBestSellers() {
    const [activeTab, setActiveTab] = useState("Best Sellers")

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {products[activeTab as keyof typeof products].map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-2xl p-3 border hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-red-500 transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
                                            <ShoppingBag className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        {product.rating}
                                    </div>
                                </div>

                                <div className="px-2 pb-2">
                                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                    <p className="font-black text-lg">₹{product.price.toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-8 font-bold border-2 hover:bg-black hover:text-white transition-all h-12">
                        View All Products
                    </Button>
                </div>
            </div>
        </section>
    )
}
