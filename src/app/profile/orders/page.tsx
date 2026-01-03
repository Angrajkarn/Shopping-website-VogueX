"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"
import { Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderFilters } from "@/components/orders/OrderFilters"
import { OrderSearch } from "@/components/orders/OrderSearch"
import { OrderCard } from "@/components/orders/OrderCard"

export default function OrdersPage() {
    const { token, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [timeFilter, setTimeFilter] = useState("all_time")

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push("/login")
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await api.getOrders(token)
                setOrders(res)
            } catch (err) {
                console.error("Failed to load orders", err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isAuthenticated, token, router])

    const filteredOrders = orders.filter(order => {
        // 1. Status Filter
        if (statusFilter !== 'all') {
            const s = order.status?.toLowerCase() || ""
            if (statusFilter === 'on_the_way' && (s !== 'shipped' && s !== 'in_transit' && s !== 'pending')) return false
            if (statusFilter === 'delivered' && s !== 'delivered') return false
            if (statusFilter === 'cancelled' && s !== 'cancelled') return false
            if (statusFilter === 'returned' && s !== 'returned') return false
        }

        // 2. Time Filter
        if (timeFilter !== 'all_time') {
            const orderYear = new Date(order.created_at).getFullYear().toString()
            if (orderYear !== timeFilter) return false
        }

        // 3. Search Filter
        if (!searchQuery) return true

        const q = searchQuery.toLowerCase()
        const orderId = order.id?.toString().toLowerCase() || ""
        const total = order.total_amount?.toString() || ""
        const itemsMatch = order.items?.some((item: any) =>
            item.product_name?.toLowerCase().includes(q)
        )

        return orderId.includes(q) || total.includes(q) || itemsMatch
    })

    if (loading) {
        return <div className="flex justify-center py-20 min-h-screen bg-gray-100"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Header / Search / Filter Row */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">My Orders ({filteredOrders.length})</h1>
                    <div className="w-full md:w-auto flex-1 max-w-lg">
                        <OrderSearch onSearch={setSearchQuery} />
                    </div>
                </div>

                {/* Horizontal Filters */}
                <OrderFilters
                    activeStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    activeTime={timeFilter}
                    onTimeChange={setTimeFilter}
                />
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white py-16 px-4 text-center rounded-xl border border-dashed border-gray-300">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-10 w-10 text-blue-500" />
                    </div>
                    {searchQuery ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Try checking your spelling or using a different keyword.</p>
                            <Button onClick={() => window.location.reload()} variant="outline">Reset Search</Button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Looks like you haven't made your choice yet. Explore our collection to find something you love!</p>
                            <Button onClick={() => router.push('/')} size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                                Start Shopping
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}
