"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import useInterval from "@/hooks/use-interval"
import { Bar, BarChart, ResponsiveContainer, Cell } from "recharts"

export function LiveUserCounter() {
    const [count, setCount] = useState(142)
    const [trendData, setTrendData] = useState(Array.from({ length: 20 }, (_, i) => ({
        time: i,
        users: 100 + Math.floor(Math.random() * 50)
    })))

    useInterval(() => {
        // Simulate live fluctuations
        const change = Math.floor(Math.random() * 11) - 5 // -5 to +5
        const newCount = Math.max(80, count + change)
        setCount(newCount)

        setTrendData(prev => {
            const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, users: newCount }]
            return newData
        })
    }, 2000)

    return (
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 border border-white/10 shadow-2xl text-white overflow-hidden relative">
            <CardHeader className="pb-2">
                <CardTitle className="text-violet-100 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Real-Time Active Users
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-5xl font-bold tracking-tighter mb-1 animate-in fade-in zoom-in duration-300" key={count}>
                            {count}
                        </div>
                        <p className="text-violet-200 text-sm">active on site right now</p>
                    </div>
                    <div className="h-16 w-32 pb-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <Bar dataKey="users" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                                    {trendData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="rgba(255,255,255,0.4)" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-30 blur-2xl"></div>
            </CardContent>
        </Card>
    )
}
