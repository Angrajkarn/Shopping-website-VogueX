"use client"

import { useRef, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "../product/ProductCard"

interface Product {
    id: string | number
    name: string
    price: number
    offer: string
    image: string
    source?: "local" | "global"
}

interface CategoryRowSectionProps {
    title: string
    bgImage?: string
    products: Product[]
    textColor?: string
    category?: string
    badge?: ReactNode
}

export function CategoryRowSection({ title, bgImage, products, textColor = "text-slate-800", category, badge }: CategoryRowSectionProps) {
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
                        {badge && (
                            <div className="flex justify-center mb-2">
                                {badge}
                            </div>
                        )}
                        <h3 className={`text-3xl font-light tracking-tight ${textColor}`}>{title}</h3>
                        <Link href={category ? `/shop?category=${category}` : '/shop'}>
                            <Button className="bg-primary text-white hover:shadow-lg shadow-md">
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scrollable Products */}
                <div className="relative flex-1 group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth min-h-[400px]"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[220px] shrink-0">
                                <ProductCard
                                    id={product.id.toString()}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    category={category || "Product"}
                                    isExternal={product.source === "global"}
                                />
                            </div>
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
