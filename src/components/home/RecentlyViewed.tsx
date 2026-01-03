"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAnalytics } from "@/hooks/useAnalytics"
import { ProductCard } from "@/components/product/ProductCard"
import { motion } from "framer-motion"

export function RecentlyViewed() {
    const { sessionId } = useAnalytics()
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!sessionId) return

        const fetchHistory = async () => {
            try {
                // Fetch using session ID
                const data = await api.getHistory(sessionId)
                setHistory(data)
            } catch (error) {
                console.error("Failed to load history", error)
            } finally {
                setLoading(false)
            }
        }

        // Slight delay to ensure backend has synced recent view if we navigated fast
        const timer = setTimeout(fetchHistory, 500)
        return () => clearTimeout(timer)
    }, [sessionId])

    if (history.length === 0) return null

    return (
        <section className="py-12 bg-slate-50/50 border-y border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Pick Up Where You Left Off</h2>
                        <p className="text-muted-foreground mt-1">Based on your recent browsing</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {history.map((item, i) => (
                        <motion.div
                            key={`${item.id}-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                image={item.image}
                                category={item.category || "Recently Viewed"}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
