"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
    id: number
    name: string
    price: string
    offer: string
    image: string
}

interface CategoryRowSectionProps {
    title: string
    bgImage?: string
    products: Product[]
    textColor?: string
    category: string // Added to support links
}

export function CategoryRowSection({ title, bgImage, products, textColor = "text-slate-800", category }: CategoryRowSectionProps) {
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
        <section className="py-4 bg-white border-b-4 border-slate-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4">

                {/* Banner / Title Card */}
                <div className="w-full md:w-1/4 lg:w-1/5 shrink-0 relative min-h-[250px] md:h-auto rounded-md overflow-hidden flex flex-col items-center justify-end p-6 text-center shadow-sm">
                    {bgImage ? (
                        <Image src={bgImage} alt={title} fill className="object-cover z-0" />
                    ) : (
                        <div className="absolute inset-0 bg-blue-50 z-0 bg-grid-slate-200/50" />
                    )}
                    <div className="relative z-10 space-y-4 mb-8">
                        <h3 className={`text-3xl font-light tracking-tight ${textColor}`}>{title}</h3>
                        <Button className="bg-primary text-white hover:shadow-lg shadow-md" asChild>
                            <Link href={`/products?category=${encodeURIComponent(category)}`}>View All</Link>
                        </Button>
                    </div>
                </div>

                {/* Scrollable Products */}
                <div className="relative flex-1 group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -5 }}
                                className="min-w-[180px] w-[180px] md:min-w-[200px] md:w-[200px] border rounded-lg p-3 hover:shadow-lg transition-shadow bg-white cursor-pointer group shrink-0"
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="relative w-full aspect-square mb-3 bg-slate-50 rounded-md overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h4 className="font-medium text-slate-800 text-sm truncate">{product.name}</h4>
                                        <p className="text-green-600 font-bold text-sm">{product.offer}</p>
                                        <p className="text-slate-500 text-xs">{product.price}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* View All Card at End */}
                        <motion.div
                            whileHover={{ scale: 0.98 }}
                            className="min-w-[150px] md:min-w-[180px] flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 shrink-0 cursor-pointer hover:border-slate-900 group/viewall"
                        >
                            <Link href={`/products?category=${encodeURIComponent(category)}`} className="flex flex-col items-center gap-2 text-center w-full h-full justify-center">
                                <div className="bg-slate-100 p-3 rounded-full group-hover/viewall:bg-slate-900 transition-colors">
                                    <ChevronRight className="w-5 h-5 text-slate-900 group-hover/viewall:text-white" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm">View All</span>
                            </Link>
                        </motion.div>
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
