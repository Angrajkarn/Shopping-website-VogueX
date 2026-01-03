"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DollarSign, CheckCircle2, TrendingUp, Info } from "lucide-react"

export default function SellerFeesPage() {
    const [price, setPrice] = useState([500])
    const [category, setCategory] = useState("Fashion")

    // Mock Calculation Logic
    const sellingPrice = price[0]
    const commission = category === "Fashion" ? sellingPrice * 0.12 : sellingPrice * 0.08
    const fixedFee = sellingPrice > 500 ? 40 : 20
    const collectionFee = sellingPrice * 0.02
    const shippingFee = 60
    const totalFees = commission + fixedFee + collectionFee + shippingFee
    const settlementAmount = sellingPrice - totalFees

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://static-assets-web.flixcart.com/fk-sp-static/images/pre-login/banner-bg.svg')] bg-cover opacity-10" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Transparent Pricing. No Hidden Charges.</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        Calculate your exact earnings before you start selling. We offer the most competitive rates in the industry.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calculator Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-3xl shadow-xl border p-8"
                    >
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-green-600" />
                            Profit Calculator
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <label className="font-bold text-gray-500 mb-2 block">Product Category</label>
                                    <div className="flex gap-4">
                                        {["Fashion", "Electronics", "Home"].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${category === cat
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="font-bold text-gray-500">Selling Price</label>
                                        <span className="text-2xl font-black text-gray-900">₹{price[0]}</span>
                                    </div>
                                    <Slider
                                        defaultValue={[500]}
                                        max={5000}
                                        step={50}
                                        value={price}
                                        onValueChange={setPrice}
                                        className="py-4"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>₹0</span>
                                        <span>₹5000</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Cost Breakdown</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Commission Fee ({category === "Fashion" ? "12%" : "8%"})</span>
                                        <span>- ₹{commission.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Fixed Closing Fee</span>
                                        <span>- ₹{fixedFee}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Collection Fee (2%)</span>
                                        <span>- ₹{collectionFee.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping Fee (Approx)</span>
                                        <span>- ₹{shippingFee}</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t flex justify-between items-center bg-green-50 rounded-lg p-3 -mx-3">
                                        <span className="font-bold text-green-800">Your Settlement Amount</span>
                                        <span className="text-2xl font-black text-green-700">₹{settlementAmount.toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Promo Card */}
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-xl p-8 text-blue-900 flex flex-col justify-center">
                        <TrendingUp className="w-12 h-12 mb-6" />
                        <h3 className="text-3xl font-black mb-4">Grow with 0% Commission</h3>
                        <p className="font-medium opacity-90 mb-8 text-lg">
                            New sellers get a special waiver on commission fees for the first 30 days. Start your journey today!
                        </p>
                        <Button className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold h-14 text-lg rounded-xl transition-all hover:scale-105">
                            Start Selling Now
                        </Button>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Standard Fee Structure</h2>
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[300px] font-bold">Category</TableHead>
                                    <TableHead className="font-bold">Commission Fee</TableHead>
                                    <TableHead className="font-bold">Fixed Fee</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Fashion & Apparel</TableCell>
                                    <TableCell>12%</TableCell>
                                    <TableCell>₹40</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Electronics</TableCell>
                                    <TableCell>8%</TableCell>
                                    <TableCell>₹55</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Home & Kitchen</TableCell>
                                    <TableCell>10%</TableCell>
                                    <TableCell>₹35</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Beauty & Personal Care</TableCell>
                                    <TableCell>5%</TableCell>
                                    <TableCell>₹20</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-center text-gray-500 mt-6 text-sm flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        Fees applicable on successful order delivery. GST extra as applicable.
                    </p>
                </div>
            </div>
        </div>
    )
}
