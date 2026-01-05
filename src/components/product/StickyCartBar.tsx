"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { ShoppingBag, X } from "lucide-react"

interface StickyCartBarProps {
    productName: string
    productPrice: number
    productImage: string
    onAddToCart: () => void
}

export function StickyCartBar({ productName, productPrice, productImage, onAddToCart }: StickyCartBarProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const threshold = 600 // Show after scrolling past header/main image
            setIsVisible(scrollY > threshold)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl border rounded-full p-2 z-50 flex items-center justify-between gap-4 pr-4"
                >
                    <div className="flex items-center gap-3 pl-2">
                        <img src={productImage} alt={productName} className="w-10 h-10 rounded-full object-cover border" />
                        <div className="hidden sm:block">
                            <h4 className="font-bold text-sm truncate max-w-[200px]">{productName}</h4>
                            <p className="text-xs text-gray-500">₹{productPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={onAddToCart} size="sm" className="rounded-full bg-black text-white px-6">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
