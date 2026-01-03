"use client"

import { ShieldCheck, Truck, RotateCcw, Headset } from "lucide-react"

const features = [
    {
        icon: ShieldCheck,
        title: "100% Original Products",
        description: "Guaranteed authentic brands"
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "7 days hassle-free returns"
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "On all orders above ₹999"
    },
    {
        icon: Headset,
        title: "24/7 Support",
        description: "Dedicated support team"
    }
]

export function TrustMarkers() {
    return (
        <section className="py-8 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                                <p className="text-xs text-slate-500 font-medium">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
