"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAnalytics } from "@/hooks/useAnalytics"
import { ProductCard } from "@/components/product/ProductCard"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function InspiredBySearch() {
    const { sessionId } = useAnalytics()
    const [data, setData] = useState<{ term: string, products: any[] }>({ term: "", products: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!sessionId) return

        const fetchInspired = async () => {
            try {
                const res = await api.getInspiredProducts(sessionId)
                setData(res)
            } catch (error) {
                console.error("Failed to load inspired products", error)
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(fetchInspired, 800)
        return () => clearTimeout(timer)
    }, [sessionId])

    if (!data?.products || data.products.length === 0) return null

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Inspired by your search for <span className="text-purple-600">"{data.term}"</span></h2>
                        <p className="text-muted-foreground mt-1">We found more styles you might love</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data.products.map((item, i) => (
                        <motion.div
                            key={`${item.id}-${i}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                image={item.image}
                                category={item.category || "Recommended"}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
