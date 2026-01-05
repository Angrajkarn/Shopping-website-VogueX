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
    // Duplicate array for seamless infinite scroll
    const marqueeBrands = [...brands, ...brands, ...brands] // Triple it for safety

    return (
        <section className="py-12 bg-white overflow-hidden border-t">
            <div className="container mx-auto px-4 text-center mb-8">
                <span className="text-sm font-bold tracking-widest text-[#B88E2F] uppercase">Trusted Partners</span>
                <h2 className="text-3xl font-bold mt-2 text-slate-900 tracking-tight">PREMIUM BRANDS</h2>
            </div>

            <div className="relative w-full flex overflow-hidden mask-gradient-x">
                {/* Gradient Masks for fade effect at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex items-center gap-16 pr-16"
                    animate={{
                        x: ["0%", "-50%"]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30, // Adjust speed: higher = slower
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeBrands.map((brand, idx) => (
                        <div key={`${brand.name}-${idx}`} className="relative w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0 cursor-pointer">
                            {/* Use text fallback if image fails or use simple styled text */}
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="text-2xl font-serif font-bold text-slate-800">{brand.name}</span>
                                {/* If you want images, uncomment below and ensure URLs are valid */}
                                {/* <Image src={brand.logo} alt={brand.name} fill className="object-contain" /> */}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
