"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FilterSidebar } from "@/components/product/FilterSidebar"
import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { getProducts, Product } from "@/lib/api"
import { Suspense } from "react"

interface ProductListingProps {
    initialCategory?: string
}

function ProductListingContent({ initialCategory }: ProductListingProps) {
    const searchParams = useSearchParams()
    // Prioritize search params, fallback to initialCategory
    const category = searchParams.get("category") || initialCategory

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchingMore, setFetchingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [offset, setOffset] = useState(0)
    const [sortBy, setSortBy] = useState("featured")

    // Reset when category changes
    useEffect(() => {
        setProducts([])
        setOffset(0)
        setHasMore(true)
        setLoading(true)

        // Initial Fetch
        fetchProducts(0, true)
    }, [category])

    const fetchProducts = async (currentOffset: number, isInitial: boolean) => {
        try {
            const LIMIT = 40
            const data = await getProducts(category || undefined, LIMIT, currentOffset)

            if (data.products.length < LIMIT) {
                setHasMore(false)
            }

            if (isInitial) {
                setProducts(data.products)
            } else {
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const newProducts = data.products.filter(p => !existingIds.has(p.id))
                    return [...prev, ...newProducts]
                })
            }
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
            setFetchingMore(false)
        }
    }

    // Infinite Scroll Observer
    useEffect(() => {
        if (loading) return

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !fetchingMore) {
                    setFetchingMore(true)
                    setOffset(prev => {
                        const newOffset = prev + 40
                        fetchProducts(newOffset, false)
                        return newOffset
                    })
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the loader is visible
        )

        const sentinel = document.getElementById("sentinel")
        if (sentinel) observer.observe(sentinel)

        return () => {
            if (sentinel) observer.unobserve(sentinel)
        }
    }, [loading, hasMore, fetchingMore, products]) // Re-attach when products change to stay at bottom

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        return 0
    })

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold capitalize">
                                {category ? category.replace("-", " ") : "All Products"}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {products.length} items found
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Mobile Filter Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden gap-2">
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <FilterSidebar />
                                </SheetContent>
                            </Sheet>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id.toString()}
                                name={product.title}
                                price={product.price}
                                image={product.thumbnail || ""}
                                category={product.category}
                            />
                        ))}
                    </div>

                    {/* Infinite Scroll Sentinel / Loader */}
                    <div id="sentinel" className="h-24 flex items-center justify-center w-full mt-8">
                        {(loading || fetchingMore) && (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-sm font-medium">Loading more products...</span>
                            </div>
                        )}
                        {!hasMore && products.length > 0 && (
                            <p className="text-muted-foreground text-sm">You've reached the end!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ProductListing(props: ProductListingProps) {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8 pt-24 text-center">Loading Products...</div>}>
            <ProductListingContent {...props} />
        </Suspense>
    )
}
