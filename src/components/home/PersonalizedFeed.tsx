"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { api } from "@/lib/api"
import { affinityEngine } from "@/lib/affinity-engine"
import { formatPrice } from "@/lib/utils"

interface Product {
    id: number
    title: string
    price: number | string
    thumbnail: string
    category: { name: string }
}

export function PersonalizedFeed() {
    const [products, setProducts] = useState<Product[]>([])
    const [interest, setInterest] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Algorithm: "Neural Intention Detection"
        // 1. Check local neural weights (affinity engine)
        // 2. Determine dominant interest
        // 3. Fetch hyper-relevant results
        const dominant = affinityEngine.getDominantCategory()

        if (dominant) {
            setInterest(dominant.replace(/-/g, " ")) // Format "mens-shirts" -> "mens shirts"
            loadPersonalized(dominant)
        }
    }, [])

    const loadPersonalized = async (category: string) => {
        try {
            const res = await api.getPersonalizedFeed(category)
            // Filter out items without images to maintain premium feel
            const valid = (res.products || []).filter((p: any) => p.thumbnail).slice(0, 4)
            setProducts(valid)
            if (valid.length > 0) setIsVisible(true)
        } catch (e) {
            console.error("Personalized feed failed", e)
        }
    }

    if (!isVisible) return null

    return (
        <section className="py-12 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 border-y border-slate-100/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full text-white shadow-lg shadow-violet-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Picked For You
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Based on your interest in <span className="text-violet-600 font-bold capitalize">{interest}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p, idx) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white rounded-2xl p-3 border border-slate-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500"
                        >
                            <Link href={`/products/${p.id}`} className="absolute inset-0 z-10" />

                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 mb-3">
                                <Image
                                    src={p.thumbnail}
                                    alt={p.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span>MATCH 98%</span>
                                </div>
                            </div>

                            <div className="px-1">
                                <h3 className="font-bold text-slate-900 truncate mb-1 text-sm group-hover:text-violet-700 transition-colors">
                                    {p.title}
                                </h3>
                                <p className="font-black text-slate-900 text-lg">
                                    {typeof p.price === 'number' ? formatPrice(p.price) : p.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
