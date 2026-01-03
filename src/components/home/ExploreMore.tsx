"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Plus } from "lucide-react"

// Mixed grid of products and ads, mimicking an "infinite feed"
const feedItems = [
    { id: 1, type: "product", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", title: "Premium Cotton Tee", price: "₹499", brand: "Roadster" },
    { id: 2, type: "product", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80", title: "Urban Chinos", price: "₹1,299", brand: "Highlander" },
    { id: 3, type: "ad", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80", title: "MEGA SALE", price: "MIN 60% OFF", brand: "Sponsored" },
    { id: 4, type: "product", image: "https://cdn.dummyjson.com/product-images/mens-shirts/man-blue-shirt/thumbnail.webp", title: "Oxford Shirt", price: "₹999", brand: "Peter England" },
    { id: 5, type: "product", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80", title: "Canvas Sneakers", price: "₹1,999", brand: "Converse" },
    { id: 6, type: "product", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80", title: "Sports Shades", price: "₹799", brand: "Fastrack" },
    { id: 7, type: "product", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80", title: "Winter Puffer", price: "₹2,499", brand: "Puma" },
    { id: 8, type: "product", image: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp", title: "Leather Wallet", price: "₹899", brand: "Woodland" },
    { id: 9, type: "ad", image: "https://images.unsplash.com/photo-1556742046-548bee6d57c7?w=500&q=80", title: "FLAT ₹500 OFF", price: "USE CODE: NEW500", brand: "Bank Offer" },
    { id: 10, type: "product", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", title: "Denim Jeans", price: "₹1,499", brand: "Levis" },
    { id: 11, type: "product", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", title: "Air Jordans", price: "₹11,999", brand: "Nike" },
    { id: 12, type: "product", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80", title: "Silk Scarf", price: "₹3,999", brand: "H&M" },
]

export function ExploreMore() {
    return (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4">

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-slate-300" />
                    <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Explore More</h2>
                    <div className="h-[1px] flex-1 bg-slate-300" />
                </div>

                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    {feedItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-lg transition-all ${item.type === 'ad' ? 'bg-slate-900 text-white' : 'bg-white'}`}
                        >
                            <div className="relative aspect-[3/4] md:aspect-auto">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={500}
                                    height={500}
                                    className={`w-full h-auto object-cover ${item.type === 'ad' ? 'opacity-60' : ''}`}
                                />
                                {item.type === 'product' && (
                                    <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                                    </div>
                                )}
                            </div>

                            <div className="p-3">
                                {item.type === 'ad' ? (
                                    <div className="text-center py-4">
                                        <h3 className="font-black text-2xl text-yellow-400">{item.title}</h3>
                                        <p className="font-bold tracking-widest">{item.price}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-slate-400 font-bold mb-1 uppercase">{item.brand}</p>
                                        <h3 className="font-medium text-slate-900 text-sm truncate">{item.title}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-slate-900">{item.price}</span>
                                            <div className="border border-slate-200 rounded p-1 hover:bg-slate-900 hover:text-white transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" className="px-12 rounded-full font-bold text-slate-600 border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                        Load More Products
                    </Button>
                </div>
            </div>
        </section>
    )
}
