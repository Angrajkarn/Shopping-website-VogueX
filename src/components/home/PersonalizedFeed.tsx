"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAnalytics } from "@/hooks/useAnalytics"
import { ProductCard } from "@/components/product/ProductCard"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function PersonalizedFeed() {
    const { sessionId } = useAnalytics()
    const [feed, setFeed] = useState<any[]>([])
    const [affinity, setAffinity] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!sessionId) return

        const fetchFeed = async () => {
            try {
                // Get token if logged in
                let token = undefined
                if (typeof window !== 'undefined') {
                    const storage = localStorage.getItem('auth-storage')
                    if (storage) {
                        const { state } = JSON.parse(storage)
                        token = state?.token
                    }
                }

                const data = await api.getPersonalizedFeed(sessionId, token)
                setFeed(data.feed || [])
                setAffinity(data.user_affinity || {})
            } catch (error) {
                console.error("Error fetching personalized feed:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFeed()
    }, [sessionId])

    if (loading || feed.length === 0) return null

    // Determine title based on affinity
    let title = "Recommended For You"
    let subtitle = "Curated based on your style"

    if (affinity && affinity.categories) {
        const topCat = Object.keys(affinity.categories)[0]
        if (topCat) {
            title = `Because you like ${topCat}`
            subtitle = "Handpicked styles matching your vibe"
        }
    }

    return (
        <section className="py-12 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-zinc-900/50 dark:to-zinc-800/50">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            {title} <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                        </h2>
                        <p className="text-muted-foreground mt-2">{subtitle}</p>
                    </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {feed.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={String(product.id)}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={String(product.category)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
