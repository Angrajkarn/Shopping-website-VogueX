"use client"

import { ArrowRight } from "lucide-react"

const budgetitems = [
    { title: "Under ₹499", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80", color: "bg-blue-50" },
    { title: "Under ₹999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", color: "bg-green-50" },
    { title: "Under ₹1499", image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=500&q=80", color: "bg-purple-50" },
    { title: "Min. 50% Off", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", color: "bg-orange-50" },
]

export function BudgetBuys() {
    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Budget Buys</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {budgetitems.map((item, idx) => (
                        <div key={idx} className={`relative h-48 rounded-lg overflow-hidden cursor-pointer group ${item.color} border border-slate-100`}>
                            <div className="absolute inset-0 z-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 z-10">
                                <h4 className="text-white text-xl font-bold">{item.title}</h4>
                                <span className="text-white/80 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Shop Now <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
