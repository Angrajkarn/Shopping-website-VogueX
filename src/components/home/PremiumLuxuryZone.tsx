"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

const luxuryItems = [
    { name: "Gucci Handbag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800" },
    { name: "Rolex Submariner", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800" },
    { name: "Prada Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800" },
    { name: "Louis Vuitton Belt", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800" },
]

export function PremiumLuxuryZone() {
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
                    <Button className="mt-4 md:mt-0 bg-amber-100 text-slate-950 hover:bg-white border-none px-8 font-serif">
                        Enter Boutique
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {luxuryItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="group relative h-[400px] cursor-pointer overflow-hidden rounded-sm"
                            whileHover={{ y: -5 }}
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl font-serif text-white">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <span className="text-xs text-amber-300 uppercase tracking-widest">View Details</span>
                                    <div className="h-[1px] w-8 bg-amber-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
