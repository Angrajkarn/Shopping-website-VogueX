"use client"

import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"

interface OrderSummaryProps {
    onContinue: () => void
}

export function OrderSummary({ onContinue }: OrderSummaryProps) {
    const { items, updateQuantity, removeItem } = useCartStore()
    const { user } = useAuthStore()

    if (items.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white">
                <p>Your cart is empty.</p>
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="divide-y">
                {items.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 border rounded-sm">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.size && <span className="ml-2">Size: {item.size}</span>}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                                <span className="text-xs text-green-600 font-medium">10% Off</span>
                                <span className="text-xs text-gray-400 line-through">{formatPrice(Math.round(item.price * 1.1))}</span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-7 h-7 rounded-full border flex items-center justify-center disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                        <button
                                            className="w-7 h-7 rounded-full border flex items-center justify-center"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button
                                        className="text-sm font-semibold uppercase hover:text-red-500"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500">
                            Delivery by <span className="font-medium text-black">Sat, Aug 19</span>
                            <br />
                            <span className="text-green-600">Free</span> <span className="line-through text-gray-400">{formatPrice(40)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-between items-center z-10">
                <div className="text-sm text-gray-600">
                    Order confirmation email will be sent to <span className="font-bold text-black">{user?.email || 'registered email'}</span>
                </div>
                <Button
                    onClick={onContinue}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase w-48 h-12 rounded-sm shadow-sm"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
