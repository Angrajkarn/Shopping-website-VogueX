"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const categories = [
    { name: "Top Offers", icon: "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp" },
    { name: "Mobiles", icon: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp" },
    { name: "Men", icon: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp" },
    { name: "Women", icon: "https://img.freepik.com/free-photo/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-isolated_158538-8586.jpg" },
    { name: "Electronics", icon: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp" },
    { name: "Home & Furniture", icon: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp" },
    { name: "Appliances", icon: "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp" },
    { name: "Travel", icon: "https://cdn.dummyjson.com/product-images/vehicle/300-touring/thumbnail.webp" },
    { name: "Beauty, Toys & More", icon: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp" },
    { name: "Two Wheelers", icon: "https://cdn.dummyjson.com/product-images/motorcycle/generic-motorcycle/thumbnail.webp" },
]

export function TopCategoryNavbar() {
    return (
        <div className="bg-white border-b py-4 overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-4 min-w-max">
                <div className="flex items-center justify-between gap-8 md:gap-12">
                    {categories.map((cat, idx) => (
                        <Link
                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                            key={idx}
                        >
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-[64px] lg:h-[64px]">
                                    <Image
                                        src={cat.icon}
                                        alt={cat.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors whitespace-nowrap">
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
