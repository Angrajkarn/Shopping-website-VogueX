"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { api } from "@/lib/api"
import { ProductCard } from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalytics } from "@/hooks/useAnalytics"

interface RelatedProductsProps {
    type: "similar" | "history"
    categoryId?: string
    currentProductId?: number
}

export function RelatedProducts({ type, categoryId, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { sessionId } = useAnalytics()

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true)
            try {
                let data;
                if (type === "similar") {
                    // 1. Try AI/ML Recommendation first
                    // const mlData = await api.getRecommendations(currentProductId || 0)
                    // if (mlData && mlData.length > 0) {
                    //    data = { products: mlData }
                    // } else {
                    // 2. Fallback to Category match
                    data = await api.getProducts(categoryId || "clothing", 8)
                    // }

                    // Fallback to "Top Rated" if generic query returns nothing
                    if (!data.products || data.products.length < 2) {
                        data = await api.getProducts("top", 4)
                    }

                } else {
                    // History: Uses Session ID to get recently viewed
                    try {
                        data = await api.getHistory(sessionId)
                    } catch (err) {
                        console.log("History fetch failed", err)
                        data = { products: [] }
                    }
                }

                // Filter out current product
                const filtered = (data.products || [])
                    .filter((p: Product) => String(p.id) !== String(currentProductId))
                    .slice(0, 4)

                setProducts(filtered)
            } catch (error) {
                console.error("Failed to fetch related products", error)
            } finally {
                setLoading(false)
            }
        }

        if (sessionId) {
            fetchRelated()
        }
    }, [type, categoryId, currentProductId, sessionId])

    if (!loading && products.length === 0) return null

    const title = type === "history" ? "Recently Viewed" : "You Might Also Like"

    return (
        <div className="py-8">
            <h3 className="text-2xl font-bold mb-6">{title}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={String(product.id)}
                            name={product.name || "Product"}
                            price={parseFloat(product.variants[0]?.price_selling || "0")}
                            image={product.images[0]?.url || ""}
                            category={
                                typeof product.category === 'string'
                                    ? product.category
                                    : (product.category?.level2 || product.category?.level1 || "Category")
                            }
                        />
                    ))
                )}
            </div>
        </div>
    )
}
