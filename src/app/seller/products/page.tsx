"use client"

import { Button } from "@/components/ui/button"
import { ImagePlus, ListChecks, Sparkles } from "lucide-react"

export default function SellerProductsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">Listing Products is Simple</h1>
                    <p className="text-xl text-slate-500">
                        Upload single products or bulk catalogs with our easy-to-use tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: ImagePlus,
                            title: "Upload Photos",
                            desc: "Add high-quality images of your products. We recommend at least 4 angles."
                        },
                        {
                            icon: ListChecks,
                            title: "Add Details",
                            desc: "Fill in key attributes like Size, Color, Fabric and Description for better visibility."
                        },
                        {
                            icon: Sparkles,
                            title: "Go Live",
                            desc: "Once approved, your products will be visible to millions of customers instantly."
                        }
                    ].map((step, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border text-center group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Have a large catalog?</h3>
                        <p className="text-slate-500">Use our Excel template to upload thousands of products at once.</p>
                    </div>
                    <Button variant="outline" className="h-12 px-8 border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 text-lg">
                        Download Template
                    </Button>
                </div>
            </div>
        </div>
    )
}
