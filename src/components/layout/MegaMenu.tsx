"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface MegaMenuProps {
    isOpen: boolean
    activeCategory: string | null
    onClose: () => void
}

// Mock data for the mega menu structure
// In a real app, this could also come from an API or CMS
const menuData: Record<string, {
    subcategories: { name: string; href: string }[]
    featured: { name: string; image: string; href: string }[]
}> = {
    "Men": {
        subcategories: [
            { name: "Shirts", href: "/men?category=mens-shirts" },
            { name: "Shoes", href: "/men?category=mens-shoes" },
            { name: "Watches", href: "/men?category=mens-watches" },
            { name: "Sunglasses", href: "/men?category=sunglasses" },
        ],
        featured: [
            { name: "Summer Collection", image: "https://images.unsplash.com/photo-1488161628813-99c974fc5bcd?w=400&q=80", href: "/men" },
            { name: "Formal Wear", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80", href: "/men" },
        ]
    },
    "Women": {
        subcategories: [
            { name: "Dresses", href: "/women?category=womens-dresses" },
            { name: "Shoes", href: "/women?category=womens-shoes" },
            { name: "Bags", href: "/women?category=womens-bags" },
            { name: "Jewellery", href: "/women?category=womens-jewellery" },
            { name: "Watches", href: "/women?category=womens-watches" },
        ],
        featured: [
            { name: "New Arrivals", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", href: "/women" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&q=80", href: "/women" },
        ]
    },
    "Accessories": {
        subcategories: [
            { name: "Sunglasses", href: "/accessories?category=sunglasses" },
            { name: "Fragrances", href: "/accessories?category=fragrances" },
            { name: "Skin Care", href: "/accessories?category=skincare" },
        ],
        featured: [
            { name: "Luxury Scents", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80", href: "/accessories" },
            { name: "Daily Essentials", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&q=80", href: "/accessories" },
        ]
    }
}

export function MegaMenu({ isOpen, activeCategory, onClose }: MegaMenuProps) {
    if (!activeCategory || !menuData[activeCategory]) return null

    const data = menuData[activeCategory]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b shadow-lg z-40"
                    onMouseLeave={onClose}
                >
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-12 gap-8">
                            {/* Subcategories */}
                            <div className="col-span-3 border-r">
                                <h3 className="font-bold text-lg mb-4 text-primary">Categories</h3>
                                <ul className="space-y-3">
                                    {data.subcategories.map((sub) => (
                                        <li key={sub.name}>
                                            <Link
                                                href={sub.href}
                                                className="text-muted-foreground hover:text-primary transition-colors block py-1"
                                                onClick={onClose}
                                            >
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Featured Images */}
                            <div className="col-span-9 grid grid-cols-2 gap-6">
                                {data.featured.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group relative h-64 rounded-xl overflow-hidden"
                                        onClick={onClose}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h4 className="text-xl font-bold">{item.name}</h4>
                                            <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Shop Now →</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
