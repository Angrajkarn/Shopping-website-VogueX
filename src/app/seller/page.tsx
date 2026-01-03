"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    CheckCircle2,
    TrendingUp,
    DollarSign,
    Truck,
    Smartphone,
    Headphones,
    BarChart3,
    Users,
    ArrowRight,
    Calculator,
    Zap,
    Target,
    Award,
    LayoutDashboard,
    Package,
    CreditCard,
    ShoppingBag,
    Search,
    Bell,
    ChevronDown,
    Menu,
    HelpCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    MapPin,
    Globe
} from "lucide-react"

export default function SellerPage() {
    const [mobileNumber, setMobileNumber] = useState("")

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 1. HERO SECTION - Modern Gradient & Glassmorphism */}
            <section className="relative bg-[#2874f0] overflow-hidden pt-16 pb-24 lg:min-h-[600px] flex items-center">
                <div className="absolute inset-0 bg-[url('https://static-assets-web.flixcart.com/fk-sp-static/images/pre-login/banner-bg.svg')] bg-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent" />

                <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-yellow-400 text-blue-900 font-bold text-sm mb-6 shadow-lg shadow-yellow-400/20">
                            Launch Offer: 0% Commission
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                            Grow Faster on <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">VogueX</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                            Join 14 Lakh+ sellers on India's most advanced fashion marketplace. Start your journey today.
                        </p>

                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl max-w-md">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                                    <Input
                                        className="bg-white border-0 h-14 pl-12 text-lg rounded-xl focus-visible:ring-0 text-gray-900 placeholder:text-gray-400"
                                        placeholder="Mobile Number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                    />
                                </div>
                                <Button size="lg" className="h-14 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 rounded-xl text-lg shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                                    Start Selling
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Graphic - Abstract Dashboard Representation */}
                    <div className="hidden lg:block relative">
                        <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl border border-blue-100 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                            {/* Mock Header */}
                            <div className="flex items-center justify-between mb-8 border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"><LayoutDashboard /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Seller Dashboard</h4>
                                        <p className="text-xs text-gray-500">Real-time Overview</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center">Run: Active</div>
                                </div>
                            </div>

                            {/* Mock Charts */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                                        <ShoppingBag className="w-4 h-4" /> Total Orders
                                    </div>
                                    <div className="text-3xl font-black text-gray-900">1,248</div>
                                    <div className="text-xs text-green-600 font-bold mt-1">↑ 12% vs last week</div>
                                </div>
                                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold text-sm">
                                        <DollarSign className="w-4 h-4" /> Total Revenue
                                    </div>
                                    <div className="text-3xl font-black text-gray-900">₹8.5L</div>
                                    <div className="text-xs text-green-600 font-bold mt-1">↑ 8% vs last week</div>
                                </div>
                            </div>

                            {/* Mock List */}
                            <div className="space-y-3">
                                <div className="h-12 bg-gray-50 rounded-lg w-full flex items-center px-4 justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-16 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] text-green-700 font-bold">Paid</div>
                                </div>
                                <div className="h-12 bg-gray-50 rounded-lg w-full flex items-center px-4 justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div className="w-32 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-16 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-[10px] text-yellow-700 font-bold">Pending</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element */}
                        <div className="absolute -right-12 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce delay-1000 z-20">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600"><TrendingUp /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">Growth</p>
                                    <p className="font-black text-gray-900 text-lg">+145%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. STATS BAR - Clean & Minimal */}
            <div className="bg-white border-b relative z-20">
                <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
                    <div className="text-center px-4">
                        <h3 className="text-4xl font-black text-gray-900">14L+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">Sellers</p>
                    </div>
                    <div className="text-center px-4">
                        <h3 className="text-4xl font-black text-gray-900">45Cr+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">Customers</p>
                    </div>
                    <div className="text-center px-4">
                        <h3 className="text-4xl font-black text-gray-900">19k+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">Pincodes</p>
                    </div>
                    <div className="text-center px-4">
                        <h3 className="text-4xl font-black text-gray-900">700+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">Categories</p>
                    </div>
                </div>
            </div>

            {/* 3. WHY SELL - 2x2 Layout with Image */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Why sellers love VogueX?</h2>
                    <p className="text-gray-500 text-xl mb-16 max-w-3xl">
                        Industry-leading tools to manage your business from anywhere.
                    </p>

                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Features Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Opportunity</h3>
                                <p className="text-gray-600 leading-relaxed">Reach 45 Crore+ customers in 19,000+ pincodes. Access shopping festivals like Big Billion Days.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Ease of Business</h3>
                                <p className="text-gray-600 leading-relaxed">Create your account in under 10 minutes with just 1 product and a valid GSTIN.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Growth</h3>
                                <p className="text-gray-600 leading-relaxed">Sellers see an average 2.8X spike in growth and 5X visibility during major sale events.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Headphones className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">24x7 Support</h3>
                                <p className="text-gray-600 leading-relaxed">Dedicated account managers, exclusive training programs, and business insights.</p>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="hidden lg:block w-1/3 sticky top-24">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop"
                                    className="relative rounded-3xl shadow-2xl z-10 w-full object-cover h-[500px]"
                                    alt="Successful Seller"
                                />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl z-20 border border-white/50 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">A</div>
                                        <div>
                                            <p className="font-bold text-gray-900">Anjali Singh</p>
                                            <p className="text-xs text-gray-500">Founder, Ethereal Wear</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PLATFORM SNEAK PEEK (NEW) - DETAILED MOCKUP */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                        Take a sneak peek into <span className="text-blue-600">our platform</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Experience a seamless and transparent management process.
                    </p>
                </div>

                <div className="container mx-auto px-4">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Laptop Frame Mockup */}
                        <div className="relative bg-gray-900 rounded-[2rem] p-4 shadow-2xl border-4 border-gray-800">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-b-xl z-20"></div>

                            {/* Realistic Screen Content */}
                            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video relative group flex">
                                {/* Sidebar */}
                                <div className="w-56 bg-blue-900 text-white flex flex-col py-6">
                                    <div className="px-6 mb-8">
                                        <span className="font-bold text-lg tracking-wide">VogueX Partner</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-blue-800 border-r-4 border-yellow-400">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span className="text-sm font-medium">Dashboard</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 text-blue-200 hover:bg-blue-800 transition-colors">
                                            <Package className="w-4 h-4" />
                                            <span className="text-sm font-medium">Inventory</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 text-blue-200 hover:bg-blue-800 transition-colors">
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="text-sm font-medium">Orders</span>
                                            <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 text-blue-200 hover:bg-blue-800 transition-colors">
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 text-blue-200 hover:bg-blue-800 transition-colors">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="text-sm font-medium">Payments</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
                                    {/* Header */}
                                    <div className="h-16 bg-white border-b flex items-center justify-between px-8">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input className="pl-10 h-9 rounded-md bg-gray-100 border-none text-sm w-64" placeholder="Search orders, items..." />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-full relative">
                                                <Bell className="w-4 h-4 text-gray-600" />
                                                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1 border-2 border-white"></div>
                                            </div>
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">
                                                ES
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dashboard Data */}
                                    <div className="p-8 overflow-hidden">
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                                                <p className="text-gray-500 text-sm">Here's what's happening today.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-white border rounded text-xs font-medium text-gray-600">Last 7 Days</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 mb-8">
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Total Sales</div>
                                                <div className="text-2xl font-black text-gray-900">₹84,392</div>
                                                <div className="text-green-600 text-xs font-bold mt-1 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" /> +14.5%
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">New Orders</div>
                                                <div className="text-2xl font-black text-gray-900">128</div>
                                                <div className="text-green-600 text-xs font-bold mt-1 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" /> +8.2%
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Pending Dispatch</div>
                                                <div className="text-2xl font-black text-gray-900">12</div>
                                                <div className="text-orange-500 text-xs font-bold mt-1">
                                                    Action Required
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Orders Table */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="px-6 py-4 border-b flex justify-between items-center">
                                                <h3 className="font-bold text-gray-800">Recent Orders</h3>
                                                <span className="text-blue-600 text-xs font-bold cursor-pointer">View All</span>
                                            </div>
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-500">
                                                    <tr>
                                                        <th className="px-6 py-3 font-medium">Order ID</th>
                                                        <th className="px-6 py-3 font-medium">Product</th>
                                                        <th className="px-6 py-3 font-medium">Amount</th>
                                                        <th className="px-6 py-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    <tr>
                                                        <td className="px-6 py-4 font-medium text-gray-900">#ORD-7782</td>
                                                        <td className="px-6 py-4 text-gray-600">Floral Midi Dress (M)</td>
                                                        <td className="px-6 py-4 font-medium">₹1,299</td>
                                                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Shipped</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 font-medium text-gray-900">#ORD-7783</td>
                                                        <td className="px-6 py-4 text-gray-600">Slim Fit Chinos (32)</td>
                                                        <td className="px-6 py-4 font-medium">₹899</td>
                                                        <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Processing</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 font-medium text-gray-900">#ORD-7784</td>
                                                        <td className="px-6 py-4 text-gray-600">Leather Belt (Black)</td>
                                                        <td className="px-6 py-4 font-medium">₹499</td>
                                                        <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Processing</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. JOURNEY TIMELINE - Clean Steps */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16 text-gray-900">Your Journey on VogueX</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {/* Line */}
                        <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>

                        {[
                            { name: "Create", icon: Users, desc: "Register in 10 mins" },
                            { name: "List", icon: Package, desc: "List your products" },
                            { name: "Orders", icon: ShoppingBag, desc: "Get orders via AI" },
                            { name: "Shipment", icon: Truck, desc: "Hassle-free shipping" },
                            { name: "Payment", icon: CreditCard, desc: "Get paid in 7 days" },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="w-32 h-32 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <step.icon className="w-10 h-10" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.name}</h3>
                                <p className="text-gray-500 text-sm max-w-[150px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. HELP CONTACT FORM (NEW) */}
            <section className="py-24 bg-blue-50/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">We are happy to <span className="text-blue-600">help you</span> 🙂</h2>
                            <p className="text-gray-500 text-lg mb-8">
                                Still have questions? Share your details and we'll call you back within 2 hours.
                            </p>
                            <div className="relative">
                                {/* Illustration placeholder - Simple Vector-like shapes */}
                                <div className="relative z-10">
                                    <img
                                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop"
                                        className="rounded-full w-20 h-20 object-cover border-4 border-white absolute top-0 left-0 shadow-lg"
                                        alt="Agent 1"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1887&auto=format&fit=crop"
                                        className="rounded-full w-24 h-24 object-cover border-4 border-white absolute top-8 left-12 shadow-xl z-20"
                                        alt="Agent 2"
                                    />
                                    <div className="h-64 w-64 bg-blue-100/50 rounded-full blur-3xl absolute -z-10 top-0 left-0"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <form className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <Input className="mt-1 bg-gray-50 border-0 h-12" placeholder="Ex: John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
                                    <Input className="mt-1 bg-gray-50 border-0 h-12" placeholder="+91" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Query Topic</label>
                                    <select className="flex h-12 w-full rounded-md bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 mt-1">
                                        <option>Registration Process</option>
                                        <option>Fees & Commission</option>
                                        <option>Shipping & Logistics</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                    <Textarea className="mt-1 bg-gray-50 border-0 min-h-[100px]" placeholder="How can we help?" />
                                </div>
                                <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700">submit Request</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ & FOOTER CTA */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="text-left bg-gray-50 rounded-2xl p-6 mb-16">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-bold">What documents do I need?</AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-lg">Detailed GSTIN and PAN card information.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg font-bold">How do I list my products?</AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-lg">Use our bulk upload tool or list one by one using the Seller App.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-[#2874f0] rounded-3xl p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black mb-6">Ready to start selling?</h2>
                            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold h-14 px-12 text-lg shadow-xl">
                                Create Seller Account
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    </div>
                </div>
            </section>
        </div>
    )
}
