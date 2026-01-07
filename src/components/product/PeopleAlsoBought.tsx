"use client"

import { useEffect, useState } from "react"
import { matrixEngine } from "@/lib/matrix-engine"
import { ProductCard } from "@/components/product/ProductCard"
import { Users } from "lucide-react"

export function PeopleAlsoBought({ currentProductId, currentCategory }: { currentProductId: string, currentCategory: string }) {
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            // Build the "Session Vector"
            // 1. Get History from LocalStorage (from RecentlyViewed component logic ideally, or direct read)
            // We'll simplisticly read the same key likely used by api.getHistory if it was local, 
            // but since we don't have direct access to that internal state easily without a store,
            // we will construct a vector using: [Current Category, Current ID] 
            // This simulates "User who is looking at THIS ITEM and THIS CATEGORY"

            const vector = [currentCategory, currentProductId]

            // Try to add a few random history items if available in storage to make it richer
            // (Mocking history read for demo purposes if real storage isn't easily accessible here)
            // In a real integration, we'd pluck this from useAnalytics() or a global store.

            const recs = await matrixEngine.getRecommendations(vector)
            setRecommendations(recs)
            setLoading(false)
        }

        load()
    }, [currentProductId, currentCategory])

    if (loading || recommendations.length === 0) return null

    return (
        <div className="py-8 border-t">
            <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold">People who viewed this also viewed</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendations.map(p => (
                    <ProductCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={parseFloat(p.price || p.variants?.[0]?.price_selling || "0")}
                        image={p.images?.[0]?.url || p.thumbnail}
                        category={p.category?.name || "Recommended"}
                    />
                ))}
            </div>
        </div>
    )
}
