"use client"

import { Wallet, CreditCard, Tag } from "lucide-react"

import { motion } from "framer-motion"

export function BankOfferStrip() {
    const offers = [
        {
            icon: <CreditCard className="w-4 h-4 text-blue-600" />,
            text: <span>10% Instant Discount on <span className="font-bold text-blue-700">HDFC Bank</span> Cards</span>,
            bg: "bg-white"
        },
        {
            icon: <Wallet className="w-4 h-4 text-green-600" />,
            text: <span>Flat ₹500 Cashback on <span className="font-bold text-green-700">Paytm UPI</span></span>,
            bg: "bg-white"
        },
        {
            icon: <Tag className="w-4 h-4 text-pink-600" />,
            text: <span>Extra 5% Off on <span className="font-bold text-pink-700">Prepaid Orders</span></span>,
            bg: "bg-white"
        }
    ]

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100/50 py-3 overflow-hidden">
            <motion.div
                className="flex whitespace-nowrap items-center w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {/* Quadruple items for seamless loop on large screens */}
                {[...offers, ...offers, ...offers, ...offers].map((offer, i) => (
                    <div key={i} className="flex items-center gap-2 mx-6 md:mx-12">
                        <div className={`p-1 rounded-full shadow-sm ${offer.bg}`}>
                            {offer.icon}
                        </div>
                        <span className="text-sm md:text-base font-medium text-slate-700">{offer.text}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
