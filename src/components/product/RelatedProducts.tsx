"use client"

import { useEffect, useState } from "react"
import { api, Product } from "@/lib/api"
import { ProductCard } from "@/components/product/ProductCard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { useAnalytics } from "@/hooks/useAnalytics"

interface RelatedProductsProps {
    type: "similar" | "history"
    categoryId?: string
    currentProductId?: number
    tags?: string[]
}

export function RelatedProducts({ type, categoryId, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { sessionId } = useAnalytics()

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                let data: any = { products: [] }

                if (type === "similar" && currentProductId) {
                    // 1. Try AI Collaborative Filtering First
                    try {
                        const recs = await api.getRecommendations(currentProductId)
                        if (Array.isArray(recs) && recs.length > 0) {
                            console.log("RelatedProducts: Using AI Recommendations")
                            data = { products: recs }
                        }
                    } catch (e) {
                        console.warn("AI Recs failed, falling back to Category")
                    }

                    // 2. Fallback to Category if AI returned empty or failed
                    if ((!data.products || data.products.length === 0) && categoryId) {
                        console.log("RelatedProducts: Using Category Fallback")
                        data = await api.getProducts(categoryId, 10)
                    }
                } else if (type === "history") {
                    // Fetch history using session ID from hook
                    if (sessionId) {
                        try {
                            const history = await api.getHistory(sessionId)
                            if (Array.isArray(history)) {
                                data = { products: history }
                            }
                        } catch (e) {
                            console.error("History fetch error:", e)
                        }
                    }
                }

                // Filter out current product
                const list = data.products || []
                const filtered = list
                    .filter((p: Product) => String(p.id) !== String(currentProductId))
                    .slice(0, 8)

                setProducts(filtered)
            } catch (error) {
                console.error("Failed to load related products", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRelated()
    }, [type, categoryId, currentProductId, sessionId])

    if (loading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
    if (products.length === 0) return null

    return (
        <section className="py-8 border-t">
            <h3 className="text-2xl font-bold mb-6">
                {type === "history"
                    ? "Recently Viewed"
                    : (products.length > 0 && categoryId ? "Similar Products" : "You Might Also Like")
                }
            </h3>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex w-max space-x-4">
                    {products.map((product) => (
                        <div key={product.id} className="w-[250px] shrink-0">
                            <ProductCard
                                id={product.id.toString()}
                                name={product.title || "Product"}
                                price={product.price}
                                image={product.thumbnail}
                                category={
                                    typeof product.category === 'object' && product.category !== null
                                        ? (product.category as any).level2 || (product.category as any).level1 || "Category"
                                        : String(product.category || "Category")
                                }
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    )
}
