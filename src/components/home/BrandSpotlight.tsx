"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const brands = [
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { name: "Puma", logo: "/puma_logo.svg" },
    { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
    { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
    { name: "Levi's", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg" },
    { name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg" },
    { name: "Calvin Klein", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Calvin_klein_logo.svg" },
]

export function BrandSpotlight() {
    return (
        <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">PREMIUM BRANDS</h2>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
                    {brands.map((brand, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.1, opacity: 1, filter: "grayscale(0%)" }}
                            className="w-24 h-12 relative grayscale hover:grayscale-0 transition-all cursor-pointer"
                        >
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
