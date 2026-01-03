"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const occasions = [
    {
        id: 1,
        title: "Party Wear",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop",
        description: "Shine all night"
    },
    {
        id: 2,
        title: "Office Chic",
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2626&auto=format&fit=crop",
        description: "Professional & Sharp"
    },
    {
        id: 3,
        title: "Vacation Vibes",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop",
        description: "Relax in style"
    },
    {
        id: 4,
        title: "Active Life",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop",
        description: "Move freely"
    }
]

export function ShopByOccasion() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">SHOP BY OCCASION</h2>
                        <p className="text-slate-500 font-medium">Curated edits for every moment of your life.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {occasions.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white/80 text-sm font-medium mb-1 tracking-wider uppercase">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowRight className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
