"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { cn, formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    category: string
}

import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useAnalytics } from "@/hooks/useAnalytics"
import { useRef } from "react"
import { affinityEngine } from "@/lib/affinity-engine"

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    const { token, isAuthenticated } = useAuthStore()
    const { track } = useAnalytics()
    const hoverTimer = useRef<NodeJS.Timeout | null>(null)

    const onMouseEnter = () => {
        hoverTimer.current = setTimeout(() => {
            // Track for Backend
            track('HOVER', {
                product_id: id,
                metadata: { source: 'card', category, title: name, image, price }
            })
            // Track for Frontend Neural Engine
            if (category) affinityEngine.track(category, 'hover')
        }, 2000) // 2 seconds threshold
    }

    const onMouseLeave = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current)
    }

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation
        e.stopPropagation()

        if (!isAuthenticated || !token) {
            // alert("Please login to use wishlist");
            // Better: redirect or show toast
            window.location.href = '/login'
            return
        }

        try {
            await api.addToWishlist(token, {
                id: id,
                title: name,
                thumbnail: image || "https://dummyjson.com/image/400x400/008080/ffffff?text=No+Image",
                price
            })
            toast.success("Added to wishlist")
        } catch (error) {
            console.error("Wishlist error", error)
            toast.error("Failed to add to wishlist")
        }
    }

    return (
        <div
            className="group relative bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Link href={`/products/${id}`} onClick={() => {
                track('VIEW', {
                    product_id: id,
                    metadata: { source: 'card_click', title: name, image, price }
                })
                if (category) affinityEngine.track(category, 'click')
            }} className="absolute inset-0 z-0" aria-label={`View ${name}`} />

            <div className="aspect-[3/4] relative overflow-hidden pointer-events-none">
                <Image
                    src={image || "https://dummyjson.com/image/400x400/008080/ffffff?text=No+Image"}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 pointer-events-auto">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-8 w-8 hover:text-red-500 hover:bg-red-50 relative z-10"
                        onClick={handleWishlist}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="p-4 relative z-10 pointer-events-none">
                <div className="mb-2">
                    <p className="text-xs text-muted-foreground capitalize">{category}</p>
                    <h3 className="font-medium truncate hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg">{formatPrice(price)}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors pointer-events-auto relative z-10"
                        onClick={() => {
                            addItem({ id, name, price, image, category, quantity: 1 })
                            track('CART_ADD', { product_id: id, metadata: { price, currency: 'INR' } })
                        }}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}
