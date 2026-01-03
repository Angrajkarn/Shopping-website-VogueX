"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Suspense } from "react"

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                <p className="text-gray-600 mb-8">
                    Your payment was successful and your order has been confirmed. You will receive an email shortly.
                </p>

                <div className="space-y-3">
                    <Link href={orderId ? `/profile/orders/${orderId}` : "/profile/orders"}>
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 h-12">
                            View Order Details
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full h-12">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
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
