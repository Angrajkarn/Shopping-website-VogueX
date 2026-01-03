"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
    { name: "Commission Fees", value: 65000, color: "#3b82f6" }, // blue-500
    { name: "Seller Subscriptions", value: 25000, color: "#8b5cf6" }, // violet-500
    { name: "Ad Revenue", value: 15000, color: "#10b981" }, // emerald-500
    { name: "Logistics Profit", value: 8000, color: "#f59e0b" }, // amber-500
]

export function RevenueSourceDistribution() {
    return (
        <Card className="col-span-2 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
