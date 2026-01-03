"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MousePointer, Activity } from "lucide-react"

export function SessionAnalytics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-3">
            <Card className="border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg. Session</p>
                        <p className="text-2xl font-bold text-white">4m 32s</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <MousePointer className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Pages / Session</p>
                        <p className="text-2xl font-bold text-white">5.8</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="border border-white/5 shadow-lg bg-[#0f172a]/40 backdrop-blur-md">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bounce Rate</p>
                        <p className="text-2xl font-bold text-white">42.1%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
