"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/lib/store"

export default function WishlistPage() {
    const { user, token } = useAuthStore()
    const addItem = useCartStore((state) => state.addItem)
    const [wishlist, setWishlist] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!token) return
            try {
                const data = await api.getWishlist(token)
                setWishlist(data)
            } catch (error) {
                console.error("Failed to load wishlist")
            } finally {
                setLoading(false)
            }
        }
        fetchWishlist()
    }, [token])

    const removeFromWishlist = async (productId: number) => {
        // Optimistic update
        setWishlist(prev => prev.filter(item => item.product_id !== productId))
        try {
            if (token) await api.removeFromWishlist(token, productId)
        } catch (error) {
            // Revert on error (optional, but good practice)
            console.error("Failed to remove")
        }
    }

    if (!user) return null

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                    <Heart className="h-8 w-8 text-red-600 fill-red-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-muted-foreground">{wishlist.length} Items</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group relative bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300">
                            <Link href={`/products/${item.product_id}`}>
                                <div className="aspect-[3/4] relative overflow-hidden">
                                    <Image
                                        src={item.product_image}
                                        alt={item.product_name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link href={`/products/${item.product_id}`}>
                                    <h3 className="font-medium truncate hover:text-primary transition-colors mb-2">
                                        {item.product_name}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg">${parseFloat(item.product_price).toFixed(2)}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeFromWishlist(item.product_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => addItem({
                                                id: item.product_id.toString(),
                                                name: item.product_name,
                                                price: parseFloat(item.product_price),
                                                image: item.product_image,
                                                category: 'Fashion', // Fallback
                                                quantity: 1
                                            })}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6">Save items you love to buy them later.</p>
                    <Link href="/">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
