"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const categories = [
    {
        id: "men",
        title: "Men's Fashion",
        image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
        cols: "col-span-2",
        rows: "row-span-2",
        color: "bg-blue-900",
        items: ["T-Shirts", "Jeans", "Sneakers", "Watches"]
    },
    {
        id: "women",
        title: "Women's Collection",
        image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&q=80",
        cols: "col-span-1",
        rows: "row-span-1",
        color: "bg-pink-900",
        items: ["Dresses", "Tops", "Heels"]
    },
    {
        id: "kids",
        title: "Kids",
        image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80",
        cols: "col-span-1",
        rows: "row-span-1",
        color: "bg-yellow-600",
        items: ["Boys", "Girls", "Toys"]
    },
    {
        id: "footwear",
        title: "Footwear",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
        cols: "col-span-1",
        rows: "row-span-1",
        color: "bg-slate-900",
        items: ["Sports", "Formal", "Casual"]
    },
    {
        id: "accessories",
        title: "Accessories",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
        cols: "col-span-1",
        rows: "row-span-1",
        color: "bg-purple-900",
        items: ["Bags", "Jewelry", "Belts"]
    }
]

export function ModernCategoryGrid() {
    return (
        <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">EXPLORE CATEGORIES</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
                    {categories.map((cat, idx) => (
                        <Link href={`/products?category=${encodeURIComponent(cat.title.split("'")[0])}`} key={cat.id} className={`${cat.cols} ${cat.rows}`}>
                            <motion.div
                                className={`relative rounded-2xl overflow-hidden group cursor-pointer w-full h-full`}
                                whileHover={{ scale: 0.98 }}
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowUpRight className="w-6 h-6 text-white" />
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{cat.title}</h3>
                                    <div className="flex flex-wrap gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {cat.items.map((tag) => (
                                            <span key={tag} className="text-xs font-bold bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
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
