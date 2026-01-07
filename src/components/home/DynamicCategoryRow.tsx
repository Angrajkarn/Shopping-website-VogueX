"use client"

import { useEffect, useState } from "react"
import { CategoryRowSection } from "./CategoryRowSection"
import { getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

interface DynamicCategoryRowProps {
    title: string
    category: string // The exact category string to filter by on backend
    bgImage?: string
    textColor?: string
}

export function DynamicCategoryRow({ title, category, bgImage, textColor }: DynamicCategoryRowProps) {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch 10 items for the row
                const data = await getProducts(category, 10)

                // Map API product to UI Product format
                const mapped = data.products.map(p => ({
                    id: p.id,
                    name: p.title,
                    price: formatPrice(p.price), // Format price
                    offer: p.stock < 5 ? "Only a few left!" : "Best Seller", // Simple logic for now
                    image: p.thumbnail || "https://dummyjson.com/image/400x400/008080/ffffff?text=No+Image"
                }))
                setProducts(mapped)
            } catch (e) {
                console.error(`Failed to fetch category ${category}`, e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [category])

    if (loading) {
        // Return a skeleton or null while loading. 
        // For now, keeping it simple to not break layout shift too much.
        return <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-md my-4" />
    }

    if (products.length === 0) return null

    return (
        <CategoryRowSection
            title={title}
            bgImage={bgImage}
            products={products}
            category={category}
            textColor={textColor}
        />
    )
}
