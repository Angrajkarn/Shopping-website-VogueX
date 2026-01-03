"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const sources = [
    { name: "Google Organic", users: 4500, percent: 45, color: "bg-blue-500" },
    { name: "Direct", users: 2800, percent: 28, color: "bg-emerald-500" },
    { name: "Instagram / Social", users: 1500, percent: 15, color: "bg-pink-500" },
    { name: "Paid Ads", users: 800, percent: 8, color: "bg-amber-500" },
    { name: "Referral", users: 400, percent: 4, color: "bg-slate-500" },
]

export function TrafficSources() {
    return (
        <Card className="col-span-2 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {sources.map(source => (
                    <div key={source.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-300">{source.name}</span>
                            <span className="text-slate-500">{source.users.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${source.color} transition-all duration-500`}
                                style={{ width: `${source.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
