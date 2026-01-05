"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Check, Plus, Loader2 } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import Image from "next/image"

interface ProductBundleProps {
    mainProduct: {
        id: number
        name: string
        price: number
        image: string
        category: any
    }
}

export function ProductBundle({ mainProduct }: ProductBundleProps) {
    const [bundleProducts, setBundleProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { addItem } = useCartStore()

    useEffect(() => {
        const fetchBundleItems = async () => {
            try {
                // 1. Try to find "Frequently Bought Together" using simple Category match for now
                // (In future, this can be an advanced API call)
                const categoryTerm = typeof mainProduct.category === 'string'
                    ? mainProduct.category
                    : (mainProduct.category?.slug || mainProduct.category?.name || "clothing")

                const data = await api.getProducts(categoryTerm, 4) // Fetch a few
                const others = (data.products || [])
                    .filter((p: Product) => p.id !== mainProduct.id)
                    .slice(0, 1) // Take top 1 for a "Perfect Pair" (Total 2 items) 

                setBundleProducts(others)
                // Select all by default
                setSelectedIds(others.map((p: Product) => p.id))
            } catch (e) {
                console.error("Bundle fetch error", e)
            } finally {
                setLoading(false)
            }
        }

        fetchBundleItems()
    }, [mainProduct.id])

    if (loading || bundleProducts.length === 0) return null

    // Calculate Totals
    const bundleItems = bundleProducts.filter(p => selectedIds.includes(p.id))
    const totalBundlePrice = bundleItems.reduce((sum, p) => sum + parseFloat(p.variants[0]?.price_selling || "0"), 0) + mainProduct.price
    const originalPrice = bundleItems.reduce((sum, p) => sum + parseFloat(p.variants[0]?.price_mrp || p.variants[0]?.price_selling || "0"), 0) + (mainProduct.price * 1.2) // Fake MRP for main

    // 15% Bundle Discount Logic
    const bundleDiscount = 0.15
    const finalPrice = totalBundlePrice * (1 - bundleDiscount)
    const savedAmount = totalBundlePrice - finalPrice

    const handleAddBundle = () => {
        // Add Main Product
        addItem({
            id: mainProduct.id.toString(),
            name: mainProduct.name,
            price: mainProduct.price,
            image: mainProduct.image,
            quantity: 1,
            size: 'M', // Default
            color: 'Default'
        }, true)

        // Add Selected Bundle Items
        bundleItems.forEach(p => {
            addItem({
                id: p.id.toString(),
                name: p.name,
                price: parseFloat(p.variants[0]?.price_selling || "0"),
                image: p.images[0]?.url || "",
                quantity: 1,
                size: 'M',
                color: 'Default'
            }, true)
        })

        toast.success(`Added ${bundleItems.length + 1} items to cart!`)
    }

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 my-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
                <span className="bg-indigo-600 text-white p-1 rounded">
                    <Plus className="h-4 w-4" />
                </span>
                Frequently Bought Together
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Images Chain */}
                <div className="flex items-center">
                    {/* Main Product */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-white rounded-lg border p-2 relative">
                            <Image src={mainProduct.image} fill alt={mainProduct.name} className="object-contain" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5">
                            <Check className="h-3 w-3" />
                        </div>
                    </div>

                    {/* Plus Sign */}
                    <div className="mx-2 text-gray-400">
                        <Plus className="h-6 w-6" />
                    </div>

                    {/* Bundle Items */}
                    {bundleProducts.map((p) => (
                        <div key={p.id} className="relative cursor-pointer" onClick={() => toggleSelection(p.id)}>
                            <div className={`w-24 h-24 bg-white rounded-lg border p-2 relative transition-all ${selectedIds.includes(p.id) ? 'ring-2 ring-indigo-500' : 'opacity-75 grayscale'}`}>
                                <Image src={p.images[0]?.url || ""} fill alt={p.name} className="object-contain" />
                            </div>
                            {selectedIds.includes(p.id) && (
                                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-0.5">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">Total Price for {selectedIds.length + 1} items:</div>
                        <div className="flex items-baseline justify-center md:justify-start gap-3">
                            <span className="text-2xl font-bold text-gray-900">₹{finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            <span className="text-sm text-gray-500 line-through">₹{totalBundlePrice.toLocaleString()}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                Save ₹{savedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>

                    <Button onClick={handleAddBundle} className="w-full md:w-auto bg-indigo-900 hover:bg-black text-white">
                        Add All to Cart
                    </Button>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold">This item:</span> {mainProduct.name}
                </div>
                {bundleProducts.map(p => (
                    <div key={p.id} className={`flex items-center gap-2 text-sm ${selectedIds.includes(p.id) ? 'text-gray-600' : 'text-gray-400 line-through'}`}>
                        <div
                            className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${selectedIds.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white'}`}
                            onClick={() => toggleSelection(p.id)}
                        >
                            {selectedIds.includes(p.id) && <Check className="h-3 w-3" />}
                        </div>
                        <span>{p.name}</span>
                        <span className="font-bold text-gray-900">₹{parseFloat(p.variants[0]?.price_selling || "0").toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
