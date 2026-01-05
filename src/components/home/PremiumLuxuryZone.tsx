"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function PremiumLuxuryZone() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLuxury = async () => {
            try {
                // Fetch a mix of high-end categories
                // In a real app, this would be a curated "Luxury" tag or collection
                const [bags, watches] = await Promise.all([
                    api.getProducts("Women"), // Simulating Bags/Luxury
                    api.getProducts("Accessories") // Simulating Watches
                ])

                // Simply picking the most expensive looking ones or just mixing them
                // For demo, we take top 2 from each
                const luxuryPicks = [
                    ...bags.products.slice(0, 2),
                    ...watches.products.slice(0, 2)
                ].map(p => ({
                    id: p.id,
                    name: p.title,
                    image: p.thumbnail,
                    price: `₹${p.price.toLocaleString()}`
                }))

                setItems(luxuryPicks)
            } catch (error) {
                console.error("Failed to fetch luxury items", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLuxury()
    }, [])

    if (loading) return null

    return (
        <section className="py-12 bg-slate-950 text-amber-50 relative overflow-hidden">

            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">

                <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-serif mb-2 tracking-tight text-amber-100">The Luxe Store</h2>
                        <p className="text-amber-200/60 text-sm tracking-widest uppercase">Premium • Authentic • Exclusive</p>
                    </div>
                    <Link href="/products?sort=price-desc">
                        <Button className="mt-4 md:mt-0 bg-amber-100 text-slate-950 hover:bg-white border-none px-8 font-serif">
                            Enter Boutique
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, idx) => (
                        <Link href={`/products/${item.id}`} key={idx} className="block">
                            <motion.div
                                className="group relative h-[400px] cursor-pointer overflow-hidden rounded-sm bg-slate-900"
                                whileHover={{ y: -5 }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl font-serif text-white truncate">{item.name}</h3>
                                    <p className="text-amber-400 font-medium mt-1">{item.price}</p>
                                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span className="text-xs text-amber-300 uppercase tracking-widest">View Details</span>
                                        <div className="h-[1px] w-8 bg-amber-300" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    )
}
