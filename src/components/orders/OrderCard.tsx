"use client"

import Link from "next/link"
import { Package, ChevronRight, Star, Truck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OrderCardProps {
    order: any
}

export function OrderCard({ order }: OrderCardProps) {
    // Determine main item for thumbnail (usually first item)
    const mainItem = order.items && order.items.length > 0 ? order.items[0] : null

    // Status Logic
    const isDelivered = order.status === 'Delivered'
    const isCancelled = order.status === 'Cancelled'

    // Status Color
    const isPending = order.status === 'Pending'
    const statusColor = isDelivered ? 'bg-green-500' : isCancelled ? 'bg-red-500' : isPending ? 'bg-orange-500' : 'bg-green-500'
    const statusText = isDelivered ? 'Delivered' : isCancelled ? 'Cancelled' : order.status
    const statusSubtext = isDelivered ? `on ${new Date(order.created_at).toLocaleDateString()}` : 'Your item is on the way'

    return (
        <div className="bg-white border rounded-sm p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group relative">
            {/* Image Section - Link to PRODUCT */}
            <div className="w-24 h-24 shrink-0 flex items-center justify-center p-2 relative z-10">
                {mainItem ? (
                    <Link href={`/profile/orders/${order.order_id}`} className="block w-full h-full">
                        {mainItem.product_image ? (
                            <img
                                src={mainItem.product_image}
                                alt={mainItem.product_name}
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="bg-gray-100 rounded-full w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </Link>
                ) : (
                    <div className="bg-gray-100 rounded-full p-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Info Section - Link to ORDER DETAILS */}
            <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                <Link href={`/profile/orders/${order.order_id}`} className="block w-fit">
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 truncate transition-colors">
                        {mainItem?.product_name || `Order #${order.order_id}`}
                    </h3>
                </Link>
                {order.items.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                        + {order.items.length - 1} more items
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    Color: {mainItem?.color || 'N/A'}
                </p>
            </div>

            {/* Link wrapper for the rest of the card to go to ORDER DETAILS */}
            <Link href={`/profile/orders/${order.order_id}`} className="absolute inset-0 z-0" aria-label="View Order Details" />

            {/* Price Section */}
            <div className="w-32 flex flex-col justify-center relative z-0 pointer-events-none">
                <span className="font-medium text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>

            {/* Status Section */}
            <div className="md:w-64 flex flex-col justify-center pl-4 md:border-l relative z-0 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
                    <span className="font-medium text-gray-900">{statusText}</span>
                </div>
                <p className="text-xs text-gray-500 ml-4.5">
                    {statusSubtext}
                </p>
                {isDelivered && (
                    <div className="ml-4.5 mt-2 text-blue-600 text-xs font-bold uppercase flex gap-1 items-center">
                        ★ Rate & Review Product
                    </div>
                )}
            </div>
        </div>
    )
}
