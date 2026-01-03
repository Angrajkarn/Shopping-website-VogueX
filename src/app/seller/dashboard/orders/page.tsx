"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Truck, CheckCircle, XCircle, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Orders
const orders = [
    { id: "ORD-7829", product: "Silk Dress", customer: "Elena Fisher", date: "2024-03-10", amount: 12400, status: "Processing", payment: "Paid" },
    { id: "ORD-7830", product: "Leather Boots", customer: "Nathan Drake", date: "2024-03-09", amount: 8999, status: "Shipped", payment: "Paid" },
    { id: "ORD-7831", product: "Gold Necklace", customer: "Chloe Frazer", date: "2024-03-09", amount: 45000, status: "Delivered", payment: "Paid" },
    { id: "ORD-7832", product: "Casual Shirt", customer: "Sam Drake", date: "2024-03-08", amount: 1200, status: "Cancelled", payment: "Refunded" },
    { id: "ORD-7833", product: "Denim Jacket", customer: "Victor Sullivan", date: "2024-03-08", amount: 3500, status: "Processing", payment: "Pending" },
]

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Processing': return 'bg-blue-100 text-blue-800'
            case 'Shipped': return 'bg-purple-100 text-purple-800'
            case 'Delivered': return 'bg-green-100 text-green-800'
            case 'Cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 text-sm">Track and manage your customer orders.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print Manifest</Button>
                    <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="returns">Returns</TabsTrigger>
                </TabsList>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-100 shadow-sm mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search orders, customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <TabsContent value="all" className="mt-0">
                    <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Payment</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())).map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 space-y-1">
                                                <div>{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={order.product}>{order.product}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{order.customer}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                            <td className="px-6 py-4 font-semibold">₹{order.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={order.payment === 'Paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}>
                                                    {order.payment}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Delivered
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                {/* Placeholders for other tabs */}
                <TabsContent value="processing">
                    <div className="p-8 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-lg">
                        <Truck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Processing orders will appear here.</p>
                    </div>
                </TabsContent>
                <TabsContent value="shipped">
                    <div className="p-8 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Shipped orders will appear here.</p>
                    </div>
                </TabsContent>
                <TabsContent value="returns">
                    <div className="p-8 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-lg">
                        <XCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No returns requests at the moment.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
