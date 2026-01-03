"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price)
}

const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0)
}

import { Suspense } from "react"

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { token } = useAuthStore()
    const [order, setOrder] = useState<any>(null)
    const orderId = searchParams.get("order_id")

    useEffect(() => {
        if (!orderId || !token) return

        api.getOrder(token, orderId).then(setOrder).catch(console.error)
    }, [orderId, token])

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
            <div className="container max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        >
                            <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
                        </motion.div>
                    </div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-bold text-gray-900"
                        >
                            Order Confirmed!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-600"
                        >
                            Thank you for your purchase. Your order has been received and is being processed.
                        </motion.p>
                    </div>

                    {order && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white border boundary-gray-200 rounded-2xl p-6 shadow-xl text-left"
                        >
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Order Number</span>
                                <span className="font-mono font-medium text-gray-900">#{order.id}</span>
                            </div>

                            <div className="py-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Item Total</span>
                                    {/* Use order.items if available to sum, else fallback */}
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(calculateTotal(order.items || []))}
                                    </span>
                                </div>
                                {order.gift_card_discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Gift Card Discount</span>
                                        <span>-{formatPrice(order.gift_card_discount)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total Paid</span>
                                <span className="text-xl font-bold text-gray-900">
                                    {/* Calculated Total Paid */}
                                    {formatPrice(
                                        (calculateTotal(order.items || []) - (order.gift_card_discount || 0))
                                    )}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="grid gap-4"
                    >
                        <Link href="/products">
                            <Button className="w-full h-12 text-lg bg-black text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                                Continue Shopping
                            </Button>
                        </Link>
                        {orderId && (
                            <Link href={`/profile/orders/${orderId}`}>
                                <Button variant="outline" className="w-full h-12 text-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                                    View full Order Details
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    )
}
