"use client"

import { Button } from "@/components/ui/button"
import { Building2, Globe2, TrendingUp, Users } from "lucide-react"

export default function SellerWholesalePage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-blue-600/30 border border-blue-500/50 text-blue-300 font-bold rounded-full text-sm mb-6 backdrop-blur-sm">
                        B2B Marketplace
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                        Buy & Sell in <span className="text-yellow-400">Bulk</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                        Connect directly with manufacturers and retailers. Expand your business reach across India.
                    </p>
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 font-bold h-14 px-8 rounded-full">
                        Join WholeSale
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-4">
                        <div className="text-4xl font-black text-blue-600 mb-2">50,000+</div>
                        <div className="text-gray-500 font-medium">Retailers</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-black text-blue-600 mb-2">100%</div>
                        <div className="text-gray-500 font-medium">Credit Guarantee</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-black text-blue-600 mb-2">25+</div>
                        <div className="text-gray-500 font-medium">Categories</div>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-3xl font-bold text-center mb-16">Why Wholesale?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Globe2, title: "Pan-India Reach", desc: "Sell to retailers in Tier 2 & Tier 3 cities." },
                        { icon: Building2, title: "Direct Factory Access", desc: "Source directly from manufacturers at best rates." },
                        { icon: TrendingUp, title: "Higher Margins", desc: "Bulk orders mean better operational efficiency." },
                        { icon: Users, title: "Verified Network", desc: "Trade only with GST verified businesses." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border hover:border-blue-500 transition-colors">
                            <item.icon className="w-10 h-10 text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
