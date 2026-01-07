"use client"

import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShieldCheck } from "lucide-react"

export function PriceDetails() {
    const { items, isGiftCardApplied, giftCardBalance } = useCartStore()
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    // Calculate Discounts
    // Assuming backend handles product discounts, here we focused on Gift Card
    // If you have product discounts, sum them up here. 
    // For now, let's stick to Gift Card as the main dynamic discount.

    // Logic: 
    // Total Price -> Gift Card -> Final

    const giftCardDiscount = isGiftCardApplied ? Math.min(giftCardBalance, total) : 0
    const deliveryCharges = 0
    const finalAmount = Math.max(0, total - giftCardDiscount + deliveryCharges)

    return (
        <div className="bg-white p-4 rounded-sm shadow-sm border sticky top-24">
            <h3 className="text-gray-500 font-medium uppercase border-b pb-3 mb-4">Price Details</h3>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span>Price ({items.length} item{items.length !== 1 && 's'})</span>
                    <span>{formatPrice(total)}</span>
                </div>

                {/* Show Gift Card Discount if applied */}
                {isGiftCardApplied && (
                    <div className="flex justify-between">
                        <span>Gift Card Discount</span>
                        <span className="text-green-600">- {formatPrice(giftCardDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">
                        {deliveryCharges === 0 ? "Free" : formatPrice(deliveryCharges)}
                    </span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t border-dashed pt-4 mt-4">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalAmount)}</span>
                </div>
            </div>

            {isGiftCardApplied && (
                <div className="mt-4 text-green-600 font-medium text-sm">
                    You will save {formatPrice(giftCardDiscount)} on this order
                </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                Safe and Secure Payments.
            </div>
        </div>
    )
}
