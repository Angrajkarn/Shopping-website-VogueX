"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

// Flipkart-style categories matching user request
const categories = [
    {
        name: "Top Offers",
        slug: "deals",
        icon: "https://img.icons8.com/3d-fluency/94/discount.png"
    },
    {
        name: "Mobiles",
        slug: "smartphones",
        icon: "https://img.icons8.com/3d-fluency/94/smartphone.png"
    },
    {
        name: "Fashion",
        slug: "mens-shirts",
        icon: "https://img.icons8.com/3d-fluency/94/clothes.png"
    },
    {
        name: "Electronics",
        slug: "laptops",
        icon: "https://img.icons8.com/3d-fluency/94/laptop.png"
    },
    {
        name: "Home & Furniture",
        slug: "furniture",
        icon: "https://img.icons8.com/3d-fluency/94/sofa.png"
    },
    {
        name: "Appliances",
        slug: "kitchen-accessories",
        icon: "https://img.icons8.com/3d-fluency/94/washing-machine.png"
    },
    {
        name: "Travel",
        slug: "sunglasses",
        icon: "https://img.icons8.com/3d-fluency/94/airplane-take-off.png"
    },
    {
        name: "Beauty, Toys & More",
        slug: "beauty",
        icon: "https://img.icons8.com/3d-fluency/94/lipstick.png"
    },
    {
        name: "Two Wheelers",
        slug: "motorcycle",
        icon: "https://img.icons8.com/3d-fluency/94/motorcycle.png"
    },
]

export function TopCategoryNavbar() {
    return (
        <div className="bg-white border-b shadow-sm py-3 overflow-x-auto scrollbar-hide z-40 relative">
            <div className="container mx-auto px-2 md:px-4 min-w-max">
                <div className="flex items-start justify-between gap-6 md:gap-10">
                    {categories.map((cat, idx) => (
                        <Link
                            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                            key={idx}
                            className="group"
                        >
                            <motion.div
                                whileHover={{ y: -3 }}
                                className="flex flex-col items-center gap-1.5 cursor-pointer"
                            >
                                <div className="relative w-14 h-14 md:w-[64px] md:h-[64px] overflow-hidden rounded-md transition-all">
                                    <Image
                                        src={cat.icon}
                                        alt={cat.name}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                        unoptimized // Allow external URLs
                                    />
                                </div>
                                <span className="text-[11px] md:text-[13px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors whitespace-nowrap leading-tight">
                                    {cat.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
