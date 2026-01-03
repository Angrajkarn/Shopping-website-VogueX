"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import { useState } from "react"

export default function GiftCardsPage() {
    const router = useRouter()
    const { addItem } = useCartStore()
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const [customAmount, setCustomAmount] = useState("")

    const handleBuy = (amount: number) => {
        addItem({
            id: `gc-${amount}-${Date.now()}`, // Unique ID
            name: `VogueX Gift Card - ₹${amount}`,
            price: amount,
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop",
            quantity: 1,
            category: "Gift Card"
        })
        toast.success(`Gift Card of ₹${amount} added to cart!`)
        router.push('/checkout')
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero */}
            <section className="bg-pink-600 py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <Gift className="w-16 h-16 mx-auto mb-6 text-pink-200" />
                    <h1 className="text-4xl font-bold mb-4">VogueX Gift Cards</h1>
                    <p className="text-xl max-w-xl mx-auto opacity-90">Give the gift of choice. Valid on over 100,000+ fashion products.</p>
                </div>
            </section>

            {/* Purchase Section */}
            <section className="py-16 container mx-auto px-4 max-w-3xl">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Choose a Value</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {[500, 1000, 2000, 5000, 10000].map((amount) => (
                        <div
                            key={amount}
                            onClick={() => setSelectedAmount(amount)}
                            className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
                                ${selectedAmount === amount ? 'border-pink-600 bg-pink-50' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'}
                            `}
                        >
                            <span className="text-2xl font-bold text-gray-900">₹{amount}</span>
                        </div>
                    ))}
                    <div className="border-2 border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50 opacity-50">
                        <span className="font-bold text-gray-500">Custom (Coming Soon)</span>
                    </div>
                </div>

                <div className="text-center">
                    <Button
                        size="lg"
                        className="w-full md:w-auto px-12 h-14 text-lg bg-gray-900 hover:bg-black"
                        onClick={() => selectedAmount && handleBuy(selectedAmount)}
                        disabled={!selectedAmount}
                    >
                        {selectedAmount ? `Buy Gift Card for ₹${selectedAmount}` : "Select an Amount"}
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">Delivered instantly via Email.</p>
                </div>
            </section>
        </div>
    )
}
