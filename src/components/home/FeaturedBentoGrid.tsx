import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { mabEngine } from "@/lib/mab-engine"

const LAYOUTS = ["classic", "mosaic", "focus"]

export function FeaturedBentoGrid() {
    const [variant, setVariant] = useState<string>("classic")

    useEffect(() => {
        const selected = mabEngine.selectVariant("bento-grid", LAYOUTS)
        setVariant(selected)
    }, [])

    const handleItemClick = (v: string) => {
        mabEngine.trackClick("bento-grid", v)
    }

    return (
        <section className="py-12 container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 underline decoration-blue-500/30 decoration-8 underline-offset-4">
                        {variant === "classic" ? "Curated Collections" : variant === "mosaic" ? "The New Vanguard" : "Premium Picks"}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {variant === "classic" ? "Handpicked styles for the season" : "Artisanal drops from our global collective"}
                    </p>
                </div>
                <Button variant="link" className="text-blue-600 font-bold hidden md:flex">View All Collections <ArrowUpRight className="ml-1 w-4 h-4" /></Button>
            </div>

            {/* VARIANT: CLASSIC (User's Original 4-item grid) */}
            {variant === "classic" && (
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
                    <Link onClick={() => handleItemClick("classic")} href="/products?category=streetwear" className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer block">
                        <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" alt="Streetwear" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Trending Now</span>
                            <h3 className="text-4xl font-black mb-2">Urban Streetwear</h3>
                            <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-full">Shop The Look</Button>
                        </div>
                    </Link>
                    <Link onClick={() => handleItemClick("classic")} href="/products?category=fragrances" className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                        <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop" alt="Luxury" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-6 left-6 text-white"><h3 className="text-2xl font-bold">Luxury Essentials</h3></div>
                    </Link>
                    <Link onClick={() => handleItemClick("classic")} href="/products?category=mens-shoes" className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                        <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop" alt="Sport" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white"><h3 className="text-xl font-bold">Sportswear</h3></div>
                    </Link>
                    <Link onClick={() => handleItemClick("classic")} href="/products?category=womens-bags" className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[250px] block">
                        <Image src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2670&auto=format&fit=crop" alt="Accessories" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white"><h3 className="text-xl font-bold">Accessories</h3></div>
                    </Link>
                </div>
            )}

            {/* VARIANT: MOSAIC (Experimental Layout) */}
            {variant !== "classic" && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 h-auto md:h-[600px]">
                    <Link onClick={() => handleItemClick(variant)} href="/products?category=mens-shirts" className="col-span-2 md:col-span-3 md:row-span-2 relative rounded-3xl overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop" alt="Fashion" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full text-black font-black text-xs">VOGUEX NEW GEN</div>
                    </Link>
                    <Link onClick={() => handleItemClick(variant)} href="/products?category=fragrances" className="col-span-1 md:col-span-3 relative rounded-3xl overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1594132225292-a135ca1ca33b?q=80&w=2674&auto=format&fit=crop" alt="Fragrances" fill className="object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute bottom-4 left-4 text-white font-bold">THE ODYSSEY SERIES</div>
                    </Link>
                    <Link onClick={() => handleItemClick(variant)} href="/products?category=womens-dresses" className="col-span-1 md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden bg-slate-900 text-white flex items-center justify-center p-4 text-center">
                        <span className="font-bold text-lg leading-tight uppercase tracking-widest italic">Floral<br/>Recharge</span>
                    </Link>
                    <Link onClick={() => handleItemClick(variant)} href="/products?category=watches" className="col-span-2 md:col-span-2 relative rounded-3xl overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2598&auto=format&fit=crop" alt="Watches" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white font-black text-xl italic">PRECISION</span></div>
                    </Link>
                </div>
            )}
        </section>
    )
}
