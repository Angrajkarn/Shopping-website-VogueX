"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { Coins, TrendingUp, History, Lock, Unlock, ShoppingBag, Gift, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SuperCoinZone() {
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

    if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view SuperCoin Zone</div>
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Rewards...</div>

    return (
        <div className="min-h-screen bg-slate-50">


            <main className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="p-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30">
                        <Coins className="w-8 h-8 text-yellow-900" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">SuperCoin Zone</h1>
                        <p className="text-slate-500">Your rewards & earnings dashboard</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-1 md:col-span-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12">
                            <Coins className="w-40 h-40" />
                        </div>

                        <div className="relative z-10">
                            <p className="font-medium text-yellow-100 mb-1">Available Balance</p>
                            <h2 className="text-6xl font-bold mb-6">{data?.coins || 0}</h2>

                            <div className="flex gap-4">
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                                    <History className="w-4 h-4 mr-2" /> View History
                                </Button>
                                <Button variant="secondary" className="bg-white text-orange-600 hover:bg-white/90 border-0">
                                    <Gift className="w-4 h-4 mr-2" /> Redeem Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Plus Status Card */}
                    <Card className="border-l-4 border-l-purple-600">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Plus Membership
                                {data?.plus_status ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-slate-400" />}
                            </CardTitle>
                            <CardDescription>Unlock free shipping & double coins</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data?.plus_status ? (
                                <div className="text-center py-4">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ACTIVE</span>
                                    <p className="text-xs text-slate-500 mt-2">Valid for 12 months</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Progress</span>
                                        <span>{4 - (data?.orders_to_plus || 0)}/4 Orders</span>
                                    </div>
                                    <Progress value={(4 - (data?.orders_to_plus || 0)) * 25} className="h-2" />
                                    <p className="text-xs text-slate-500">
                                        Place {data?.orders_to_plus} more orders to unlock Plus.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* History Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Activity History
                        </h3>

                        {data?.history?.length > 0 ? (
                            data.history.map((tx: any) => (
                                <div key={tx.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                                            tx.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            {tx.status === 'PENDING' ? <History className="w-5 h-5" /> :
                                                tx.status === 'COMPLETED' ? <TrendingUp className="w-5 h-5" /> :
                                                    <X className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{tx.desc}</p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(tx.date).toLocaleDateString()}
                                                {tx.status === 'PENDING' && <span className="ml-2 text-yellow-600 font-medium">(Expected after delivery)</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.type === 'DEBIT' ? 'text-red-500' : 'text-green-600'}`}>
                                        {tx.type === 'DEBIT' ? '-' : '+'}{tx.amount}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-xl border">
                                <p className="text-slate-500">No transactions yet. Start shopping!</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    )
}

function X(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
    )
}
