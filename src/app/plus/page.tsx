"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { Crown, Check, Truck, Zap, Percent, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

export default function PlusZone() {
    const { user, token } = useAuth()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return
        api.getLoyaltyDashboard(token)
            .then(res => setData(res))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [token])

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view Plus Zone</div>

    const benefits = [
        { icon: Truck, title: "Free Shipping", desc: "On all orders, no minimum value" },
        { icon: Zap, title: "Early Access", desc: "Shop sales 4 hours before everyone else" },
        { icon: Percent, title: "Double SuperCoins", desc: "Earn 4% back on every purchase" },
        { icon: Crown, title: "Priority Support", desc: "Dedicated 24/7 customer care line" }
    ]

    return (
        <div className="min-h-screen bg-slate-50">


            <main>
                {/* Hero Section */}
                <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />

                    <div className="container mx-auto max-w-4xl relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl shadow-orange-500/50"
                        >
                            <Crown className="w-12 h-12 text-white" />
                        </motion.div>
                        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
                            Fashion Plus
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            The most exclusive fashion club. Join the elite.
                        </p>

                        {!loading && (
                            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                {data?.plus_status ? (
                                    <div>
                                        <p className="text-green-400 font-bold text-lg mb-2">YOU ARE A MEMBER</p>
                                        <p className="text-sm text-slate-300">Enjoy your exclusive privileges.</p>
                                    </div>
                                ) : (
                                    <div className="text-left">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-white">Unlock Progress</span>
                                            <span className="text-yellow-400">{4 - (data?.orders_to_plus || 0)}/4 Orders</span>
                                        </div>
                                        <Progress value={(4 - (data?.orders_to_plus || 0)) * 25} className="h-2 mb-3 bg-white/20" />
                                        <p className="text-xs text-slate-300">
                                            Place {data?.orders_to_plus} more orders to unlock unlimited benefits.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-12 text-slate-900">Member Privileges</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <b.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                                <p className="text-slate-500 text-sm">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {!data?.plus_status && (
                        <div className="mt-12">
                            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 px-8 rounded-full h-12 text-lg" onClick={() => window.location.href = '/shop'}>
                                Start Shopping to Unlock
                            </Button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
