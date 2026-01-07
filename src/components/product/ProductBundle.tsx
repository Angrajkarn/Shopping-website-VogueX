"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Check, Plus, Loader2 } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
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
                // Smart Bundle Logic:
                // 1. Get Category
                const categoryTerm = typeof mainProduct.category === 'string'
                    ? mainProduct.category
                    : (mainProduct.category?.slug || mainProduct.category?.name || "clothing")

                // 2. Fetch 8 items to ensure variety
                const data = await api.getProducts(categoryTerm, 8)

                // 3. Filter out current product and maybe same-name variants
                const others = (data.products || [])
                    .filter((p: Product) => p.id !== mainProduct.id && !p.title.includes(mainProduct.name))
                    .slice(0, 2) // Take top 2 for a "Trio Bundle" (Main + 2)

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
    }, [mainProduct.id, mainProduct.category, mainProduct.name])

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

                    {/* Bundle Items Chain */}
                    {bundleProducts.map((p) => (
                        <div key={p.id} className="flex items-center">
                            <div className="mx-1 text-gray-300">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div className="relative cursor-pointer group" onClick={() => toggleSelection(p.id)}>
                                <div className={`w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl border p-2 relative transition-all duration-300 ${selectedIds.includes(p.id) ? 'ring-2 ring-indigo-500 shadow-md scale-105' : 'opacity-60 grayscale scale-95'}`}>
                                    <Image src={p.images[0]?.url || ""} fill alt={p.name} className="object-contain" />
                                </div>
                                <div className={`absolute -top-2 -right-2 transition-transform duration-300 ${selectedIds.includes(p.id) ? 'scale-100' : 'scale-0'}`}>
                                    <div className="bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                                        <Check className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">Total Price for {selectedIds.length + 1} items:</div>
                        <div className="flex items-baseline justify-center md:justify-start gap-3">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                            <span className="text-sm text-gray-500 line-through">{formatPrice(totalBundlePrice)}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                Save {formatPrice(savedAmount)}
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
                        <span className="font-bold text-gray-900">{formatPrice(parseFloat(p.variants[0]?.price_selling || "0"))}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
