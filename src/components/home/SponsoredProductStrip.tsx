"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SponsoredProductStrip() {
    return (
        <section className="py-2 bg-slate-50 border-y border-slate-100 mb-4">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <span className="bg-slate-200 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded">Ad</span>
                    <span className="text-xs text-slate-400 font-medium mr-2">Sponsored</span>

                    <div className="flex-1 flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 relative rounded overflow-hidden shrink-0">
                            <Image src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80" alt="Apple Watch" fill className="object-cover" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 truncate">
                            New Apple Watch Series 9 - Smarter. Brighter. Mightier.
                            <span className="text-blue-600 ml-1 font-bold">Shop Now</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
