"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"

interface StickyCartBarProps {
    productName: string
    productPrice: number
    productImage: string
    onAddToCart: () => void
    isAdded?: boolean
}

export const StickyCartBar = ({ productName, productPrice, productImage, onAddToCart, isAdded = false }: StickyCartBarProps) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling past 600px (approx height of main hero)
            if (window.scrollY > 600) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
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
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] py-3 px-4 md:px-8"
                >
                    <div className="container mx-auto flex items-center justify-between max-w-7xl">
                        {/* Left: Product Info (Hidden on mobile used for minimal view) */}
                        <div className="flex items-center gap-4">
                            <img
                                src={productImage}
                                alt={productName}
                                className="w-10 h-10 rounded-md object-cover hidden sm:block border dark:border-zinc-700"
                            />
                            <div className="hidden sm:block">
                                <h3 className="text-sm font-semibold truncate max-w-[200px]">{productName}</h3>
                                <p className="text-xs text-muted-foreground">₹{productPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="sm:hidden">
                                <p className="text-sm font-bold">₹{productPrice.toLocaleString()}</p>
                                <p className="text-xs text-green-600">In Stock</p>
                            </div>

                            <Button
                                onClick={onAddToCart}
                                size="lg"
                                className={`rounded-full px-8 shadow-lg transition-all active:scale-95 ${isAdded
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black"
                                    }`}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                {isAdded ? "Added to Cart" : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
