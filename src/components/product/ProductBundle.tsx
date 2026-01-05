"use client"

import { useState, useEffect } from "react"
import { api, Product } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, ShoppingBag, Check } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const { addItem } = useCartStore()

    // 15% Discount for the bundle
    const DISCOUNT_PERCENT = 15

    useEffect(() => {
        const fetchBundleItems = async () => {
            try {
                // Logic: Fetch adjacent products from same category or "Accessories" if possible
                // For now, we fetch from the same category but exclude the current one
                const categoryTerm = typeof mainProduct.category === 'string'
                    ? mainProduct.category
                    : (mainProduct.category?.slug || "accessories")

                const data = await api.getProducts(categoryTerm, 4) // Fetch a few
                const others = (data.products || [])
                    .filter((p: Product) => p.id !== mainProduct.id)
                    .slice(0, 1) // Take top 1 for a "Perfect Pair" (Total 2 items)

                setBundleProducts(others)
                // Select all by default
                setSelectedIds(others.map((p: Product) => p.id))
            } catch (error) {
                console.error("Failed to load bundle", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBundleItems()
    }, [mainProduct])

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleAddBundle = () => {
        const itemsToAdd = [
            mainProduct,
            ...bundleProducts.filter(p => selectedIds.includes(p.id))
        ]

        itemsToAdd.forEach(item => {
            addItem({
                id: item.id.toString(),
                name: item.name || (item as any).title,
                price: (item as any).price || item.price,
                image: (item as any).thumbnail || item.image,
                quantity: 1,
                size: "Standard", // Default for bundle
                color: "Standard"
            }, true) // Silent add
        })

        toast.success(`Broadcasting ${itemsToAdd.length} items to cart!`, {
            description: `You saved ₹${calculateSavings()}`,
            icon: <Check className="text-green-500" />
        })
    }

    // Calculations
    const mainPrice = mainProduct.price
    const selectedBundleItems = bundleProducts.filter(p => selectedIds.includes(p.id))
    const bundleTotal = selectedBundleItems.reduce((acc, curr) => acc + curr.price, 0)

    const totalPrice = mainPrice + bundleTotal
    const finalPrice = Math.round(totalPrice * (1 - DISCOUNT_PERCENT / 100))
    const savings = Math.round(totalPrice - finalPrice)

    const calculateSavings = () => savings

    if (loading) return null
    if (bundleProducts.length === 0) return null

    return (
        <section className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-6 border border-indigo-100 my-8">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                Frequently Bought Together
            </h3>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Visual Chain */}
                <div className="flex items-center gap-4 flex-1 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto">
                    {/* Main Product */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-xl border-2 border-indigo-200 p-1 bg-white relative">
                            <Image
                                src={mainProduct.image}
                                alt={mainProduct.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                THIS
                            </div>
                        </div>
                        <p className="text-xs font-medium w-24 truncate mt-2 text-center">{mainProduct.name}</p>
                    </div>

                    {/* Plus Icon */}
                    <div className="text-gray-400">
                        <Plus className="w-5 h-5" />
                    </div>

                    {/* Bundle Items */}
                    {bundleProducts.map((product, idx) => (
                        <div key={product.id} className="flex items-center gap-4">
                            <div className="relative shrink-0 group">
                                <div className="w-24 h-24 rounded-xl border border-gray-200 p-1 bg-white relative transition-all group-hover:border-indigo-300 group-hover:shadow-md">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <Checkbox
                                        checked={selectedIds.includes(product.id)}
                                        onCheckedChange={() => toggleSelection(product.id)}
                                        className="absolute top-1 right-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                </div>
                                <p className="text-xs font-medium w-24 truncate mt-2 text-center text-gray-600">{product.title}</p>
                                <p className="text-xs font-bold w-24 text-center text-gray-900">₹{product.price.toLocaleString()}</p>
                            </div>

                            {idx < bundleProducts.length - 1 && (
                                <div className="text-gray-300">
                                    <Plus className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Card */}
                <div className="w-full lg:w-72 bg-white rounded-xl p-5 shadow-sm border border-gray-200 shrink-0">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Total Price:</span>
                            <span className="line-through decoration-red-500 decoration-2">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600 font-bold">
                            <span>Bundle Discount:</span>
                            <span>- ₹{savings.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-end">
                            <span className="text-sm font-medium text-gray-700">Total:</span>
                            <span className="text-2xl font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleAddBundle}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                    >
                        Add All {selectedIds.length + 1} Items
                    </Button>
                    <p className="text-[10px] text-center text-gray-400 mt-3">
                        Save {DISCOUNT_PERCENT}%  when you match these styles together!
                    </p>
                </div>
            </div>
        </section>
    )
}
