"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    ShoppingBag,
    Menu,
    ChevronDown
} from "lucide-react"
import Link from "next/link"

export function SellerNavbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white border-b shadow-sm h-16 md:h-20 flex items-center">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-400 p-1.5 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-blue-900" />
                    </div>
                    <span className="cursor-pointer text-xl md:text-2xl font-black text-blue-600 tracking-tight">
                        VogueX <span className="text-gray-400 font-medium text-lg">Seller Hub</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2 font-medium text-gray-600">
                    <NavDropdown
                        title="Sell Online"
                        items={[
                            "Create Account",
                            "List Products",
                            "Storage & Shipping",
                            "Receive Payments",
                            "Grow Faster",
                            "Seller App",
                            "Help & Support"
                        ]}
                    />
                    <NavDropdown
                        title="Fees and Commission"
                        items={[
                            "Payment Cycle",
                            "Fee Type",
                            "Calculate Gross Margin"
                        ]}
                    />
                    <NavDropdown
                        title="Grow"
                        items={[
                            "VogueX Assured badge",
                            "Insights & Tools",
                            "VogueX Ads",
                            "Value Services",
                            "Shopping Festivals",
                            "Service Partners"
                        ]}
                    />
                    <NavDropdown
                        title="Learn"
                        items={[
                            "FAQs",
                            "Seller Success Stories",
                            "Seller Blogs"
                        ]}
                    />
                    <div className="px-4 py-2 cursor-pointer hover:text-blue-600 transition-colors">
                        Shopsy
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/seller/login">
                        <Button variant="ghost" className="font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                            Login
                        </Button>
                    </Link>
                    <Link href="/seller/intro">
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold shadow-md">
                            Start Selling
                        </Button>
                    </Link>
                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon"><Menu /></Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function NavDropdown({ title, items }: { title: string, items: string[] }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative group px-4 py-2"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className={`flex items-center gap-1 cursor-pointer transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                {title} <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-2 w-56 z-50"
                    >
                        <div className="bg-white rounded-xl shadow-xl border p-2 flex flex-col gap-1">
                            {items.map((item, i) => (
                                <div key={i} className="px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition-colors font-medium">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
