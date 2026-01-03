"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const demographics = [
    { region: "Mumbai, MH", users: 12500, percent: 85 },
    { region: "Bangalore, KA", users: 9800, percent: 65 },
    { region: "Delhi, NCR", users: 8400, percent: 55 },
    { region: "Hyderabad, TS", users: 6200, percent: 40 },
    { region: "Chennai, TN", users: 4500, percent: 30 },
]

const devices = [
    { type: "Mobile", percent: 78, color: "bg-blue-500" },
    { type: "Desktop", percent: 22, color: "bg-purple-500" },
]

export function UserDemographics() {
    return (
        <Card className="col-span-2 border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-white">Customer Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Top Regions</h4>
                    <div className="space-y-4">
                        {demographics.map((item) => (
                            <div key={item.region} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-300">{item.region}</span>
                                    <span className="text-slate-500">{item.users.toLocaleString()}</span>
                                </div>
                                <Progress value={item.percent} className="h-2 bg-white/10" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Device Usage</h4>
                    <div className="flex gap-4">
                        {devices.map(d => (
                            <div key={d.type} className="flex-1 p-3 bg-white/5 rounded-lg text-center border border-white/5">
                                <div className="text-2xl font-bold text-white">{d.percent}%</div>
                                <div className="text-xs text-slate-400">{d.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
