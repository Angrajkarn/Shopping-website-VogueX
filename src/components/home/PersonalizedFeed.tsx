"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { api } from "@/lib/api"
import { ProductCard } from "../product/ProductCard"
import { Sparkles } from "lucide-react"

export function PersonalizedFeed() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.getPersonalizedFeed()
                if (res.results) setProducts(res.results)
            } catch (e) {
                console.error("Feed error", e)
            }
        }
        load()
    }, [])

    if (products.length === 0) return null

    return (
        <div className="py-12 bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        Picked Just For You
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.slice(0, 4).map(p => (
                        <ProductCard key={p.id} {...p} id={String(p.id)} price={parseFloat(p.variants[0]?.price_selling)} image={p.images[0]?.url} category={p.category?.name || "Fashion"} />
                    ))}
                </div>
            </div>
        </div>
    )
}
