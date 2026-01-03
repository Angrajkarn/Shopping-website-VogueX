"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sellers = [
    {
        name: "Urban Threads",
        category: "Fashion",
        revenue: "₹12,50,000",
        sales: 5200,
        status: "Verified",
        rating: "4.9"
    },
    {
        name: "Tech Haven",
        category: "Electronics",
        revenue: "₹9,80,000",
        sales: 850,
        status: "Pending",
        statusColor: "text-amber-600 bg-amber-50",
        rating: "4.5"
    },
    {
        name: "Green Earth Decor",
        category: "Home",
        revenue: "₹5,40,000",
        sales: 3200,
        status: "Verified",
        rating: "4.8"
    },
    {
        name: "Speedy Gadgets",
        category: "Mobile",
        revenue: "₹2,10,000",
        sales: 150,
        status: "Flagged",
        statusColor: "text-red-600 bg-red-50",
        rating: "3.2"
    },
]

export function TopPerformingSellers() {
    return (
        <Card className="col-span-3 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white">Top Performing Sellers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {sellers.map((seller, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-bold border border-indigo-500/30">
                                    {seller.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{seller.name}</h4>
                                    <div className="flex gap-2 text-xs text-slate-500">
                                        <span>{seller.category}</span>
                                        <span>•</span>
                                        <span>⭐ {seller.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-medium text-slate-200">{seller.sales} Orders</div>
                                    <div className="text-xs text-slate-500">Lifetime</div>
                                </div>
                                <div className="text-right w-24">
                                    <div className="text-sm font-bold text-slate-200">{seller.revenue}</div>
                                    <div className="text-xs text-emerald-400">GMV</div>
                                </div>
                                <Badge variant="outline" className={`hidden md:flex ${seller.status === 'Pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : seller.status === 'Flagged' ? 'text-red-400 bg-red-500/10 border-red-500/20' : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"} border`}>
                                    {seller.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
