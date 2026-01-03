"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Crown } from "lucide-react"

export function MembershipBanner() {
    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="bg-amber-400 p-3 rounded-xl shadow-lg mt-1">
                            <Crown className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Become an Insider</h2>
                            <p className="text-slate-300 max-w-lg">
                                Get early access to sales, exclusive discounts, and free shipping on all orders. Join the VogueX Gold Club today.
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="relative z-10 bg-amber-400 text-black hover:bg-amber-300 font-bold px-8 h-12 rounded-full gap-2 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        Join Now <ArrowRight className="w-4 h-4" />
                    </Button>

                </div>
            </div>
        </section>
    )
}
