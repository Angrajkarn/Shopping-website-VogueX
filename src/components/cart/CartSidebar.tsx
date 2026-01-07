"use client"

import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export function CartSidebar() {
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()
    const { isOpen, toggleCart, items, removeItem, updateQuantity } = useCartStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Your Cart ({items.length})
                            </h2>
                            <Button variant="ghost" size="icon" onClick={toggleCart}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                    <ShoppingBag className="w-12 h-12 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <Button variant="link" onClick={toggleCart}>Continue Shopping</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {item.color} / {item.size}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        className="p-1 hover:bg-accent"
                                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button
                                                        className="p-1 hover:bg-accent"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 border-t bg-accent/5 space-y-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => {
                                        toggleCart()
                                        if (isAuthenticated) {
                                            router.push('/checkout')
                                        } else {
                                            router.push('/login?redirect=/checkout')
                                        }
                                    }}
                                >
                                    Checkout
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
