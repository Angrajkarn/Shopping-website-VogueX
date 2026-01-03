"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    { name: "Seller Signups", value: 1200 },
    { name: "Doc Verified", value: 850 },
    { name: "Shop Live", value: 620 },
    { name: "First Sale", value: 450 },
    { name: "Power Seller", value: 120 },
]

export function SellerGrowthFunnel() {
    return (
        <Card className="col-span-2 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white">Seller Onboarding Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#94a3b8' }} interval={0} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
