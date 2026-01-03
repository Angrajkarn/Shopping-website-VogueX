"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Target, Zap, MousePointerClick } from "lucide-react"

export default function SellerAdsPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-black text-white py-24">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                New
                            </span>
                            <span className="font-bold tracking-widest text-gray-400">VOGUEX ADS</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                            Boost your sales by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">3X</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10">
                            Reach high-intent shoppers at the right moment. Easy setup, maximum ROI.
                        </p>
                        <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg">
                            Start Advertising
                        </Button>
                    </div>
                    <div className="relative">
                        {/* Abstract UI representation of ads */}
                        <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-800 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-800 rounded"></div>
                                </div>
                            </div>
                            <div className="h-48 bg-gray-800 rounded-xl mb-6 relative overflow-hidden">
                                <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">Sponsored</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-8 w-24 bg-gray-800 rounded"></div>
                                <div className="h-10 w-32 bg-purple-600 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Target, title: "Precision Targeting", desc: "Show your ads to customers who are actively looking for products like yours." },
                        { icon: MousePointerClick, title: "Cost Per Click", desc: "Pay only when a customer clicks on your ad. Impressions are free." },
                        { icon: BarChart3, title: "Real-time Analytics", desc: "Track conversions and ROI with our advanced dashboard." },
                    ].map((feat, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                <feat.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
