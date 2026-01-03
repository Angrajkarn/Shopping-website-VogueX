"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const products = [
    {
        id: 1,
        title: "Printers",
        offer: "From ₹3999",
        image: "https://cdn.dummyjson.com/product-images/laptops/hp-pavilion-15-dk1056wm/thumbnail.png"
    },
    {
        id: 2,
        title: "Monitors",
        offer: "From ₹6599",
        image: "https://cdn.dummyjson.com/product-images/laptops/macbook-pro/thumbnail.png"
    },
    {
        id: 3,
        title: "Power Banks",
        offer: "From ₹499",
        image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.jpg"
    },
    {
        id: 4,
        title: "Tablets",
        offer: "Upto 40% Off",
        image: "https://cdn.dummyjson.com/product-images/smartphones/samsung-universe-9/thumbnail.jpg"
    },
    {
        id: 5,
        title: "Smart Watches",
        offer: "From ₹1299",
        image: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini/thumbnail.jpg"
    },
    {
        id: 6,
        title: "Cameras",
        offer: "Shop Now!",
        image: "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19/thumbnail.jpg"
    }
]

export function TopSelection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = 300
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount
            } else {
                current.scrollLeft += scrollAmount
            }
        }
    }
    return (
        <section className="py-8 bg-white my-4 shadow-sm border-y">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                        <h2 className="text-2xl font-bold text-slate-800">Best of Electronics</h2>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full opacity-0 animate-in fade-in slide-in-from-left-4 duration-1000"></div>
                    </div>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                        View All <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                <div className="relative group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth"
                    >
                        {products.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="min-w-[200px] border rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg transition-all bg-white snap-start shrink-0"
                            >
                                <div className="relative w-32 h-32">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-medium text-slate-900">{item.title}</h3>
                                    <p className="text-green-600 font-bold text-sm mt-1">{item.offer}</p>
                                    <p className="text-slate-400 text-xs mt-1">Grab Now</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Navigation Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
