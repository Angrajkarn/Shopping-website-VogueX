"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function FeaturedBentoGrid() {
    return (
        <section className="py-12 container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Curated Collections</h2>
                    <p className="text-slate-500 font-medium">Handpicked styles for the season</p>
                </div>
                <Button variant="link" className="text-blue-600 font-bold hidden md:flex">View All Collections <ArrowUpRight className="ml-1 w-4 h-4" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">

                {/* Large/Tall item */}
                <Link href="/products?category=Men&subcategory=Topwear" className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer block">
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="h-full w-full"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop"
                            alt="Streetwear"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Trending Now</span>
                            <h3 className="text-4xl font-black mb-2">Urban Streetwear</h3>
                            <p className="text-gray-200 mb-4 max-w-sm">Discover the latest drops in oversize tees, cargo pants, and sneakers.</p>
                            <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-full">Shop The Look</Button>
                        </div>
                    </motion.div>
                </Link>

                {/* Top Right Landscape */}
                <Link href="/products?category=Women&subcategory=Bags" className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="h-full w-full"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
                            alt="Luxury"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-bold">Luxury Essentials</h3>
                            <p className="text-sm text-gray-200">Premium fabrics for everyday wear.</p>
                        </div>
                    </motion.div>
                </Link>

                {/* Bottom Center */}
                <Link href="/products?category=Men&subcategory=Footwear" className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="h-full w-full"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop"
                            alt="Sport"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">Sportswear</h3>
                            <p className="text-xs font-bold text-yellow-400 mt-1">UP TO 50% OFF</p>
                        </div>
                    </motion.div>
                </Link>

                {/* Bottom Right */}
                <Link href="/products?category=Accessories&subcategory=Watches" className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="h-full w-full"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2670&auto=format&fit=crop"
                            alt="Accessories"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold">Accessories</h3>
                            <p className="text-xs font-bold text-white/80 mt-1">Watches, Bags & More</p>
                        </div>
                    </motion.div>
                </Link>

            </div>
        </section>
    )
}
