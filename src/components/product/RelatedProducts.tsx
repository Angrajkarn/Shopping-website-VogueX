"use client"

import { useEffect, useState, useRef } from "react"
import { Product } from "@/types"
import { api } from "@/lib/api"
import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = direction === 'left' ? -300 : 300
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (!loading && products.length === 0) return null

    const title = type === "history" ? "Recently Viewed" : "You Might Also Like"

    return (
        <div className="py-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-2xl font-bold">{title}</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full hidden md:flex">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full hidden md:flex">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="min-w-[180px] md:min-w-[220px] space-y-4 snap-start">
                            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="min-w-[180px] md:min-w-[220px] snap-start">
                            <ProductCard
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
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
