"use client"

import { Wallet, CreditCard, Tag } from "lucide-react"

export function BankOfferStrip() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100/50 py-3 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm md:text-base font-medium text-slate-700 items-center">
                {/* Duplicated items for seamless marquee */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded-full shadow-sm">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <span>10% Instant Discount on <span className="font-bold text-blue-700">HDFC Bank</span> Cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded-full shadow-sm">
                                <Wallet className="w-4 h-4 text-green-600" />
                            </div>
                            <span>Flat ₹500 Cashback on <span className="font-bold text-green-700">Paytm UPI</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded-full shadow-sm">
                                <Tag className="w-4 h-4 text-pink-600" />
                            </div>
                            <span>Extra 5% Off on <span className="font-bold text-pink-700">Prepaid Orders</span></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
