"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock Data
const products = [
    { id: 1, name: "Luxury Silk Dress", category: "Women > Clothing", price: 12400, stock: 45, sales: 12, status: "Active", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&dpr=2&q=80" },
    { id: 2, name: "Italian Leather Bag", category: "Women > Accessories", price: 45999, stock: 12, sales: 5, status: "Active", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&dpr=2&q=80" },
    { id: 3, name: "Designer Sunglasses", category: "Unisex > Eyewear", price: 8500, stock: 120, sales: 86, status: "Active", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&dpr=2&q=80" },
    { id: 4, name: "Velvet Blazer", category: "Men > Clothing", price: 15000, stock: 8, sales: 2, status: "Low Stock", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&dpr=2&q=80" },
    { id: 5, name: "Classic Chronograph", category: "Men > Watches", price: 22000, stock: 0, sales: 15, status: "Out of Stock", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&dpr=2&q=80" },
]

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your product catalog and inventory.</p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-gray-600">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline" className="text-gray-600">
                        Export
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Sales</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-md bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">{product.stock}</td>
                                    <td className="px-6 py-4">{product.sales}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            product.status === 'Active' ? 'default' :
                                                product.status === 'Low Stock' ? 'secondary' : 'destructive'
                                        } className={
                                            product.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                    'bg-red-100 text-red-800 hover:bg-red-100'
                                        }>
                                            {product.status}
                                        </Badge>
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
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Product
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
