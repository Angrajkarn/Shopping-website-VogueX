"use client"

import {
    ShoppingBag,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail
} from "lucide-react"
import Link from "next/link"

export function SellerFooter() {
    return (
        <footer className="bg-[#0f172a] text-slate-300 py-16 text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-yellow-400 p-1.5 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-blue-900" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">
                                VogueX <span className="text-slate-500 font-medium text-lg">Seller Hub</span>
                            </span>
                        </div>
                        <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
                            India's fastest growing fashion marketplace. Join thousands of successful sellers and take your business to the next level today.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Sell Online</h4>
                        <ul className="space-y-4">
                            <li><Link href="/seller/intro" className="hover:text-yellow-400 transition-colors">Create Account</Link></li>
                            <li><Link href="/seller/products" className="hover:text-yellow-400 transition-colors">List Products</Link></li>
                            <li><Link href="/seller/shipping" className="hover:text-yellow-400 transition-colors">Shipping Rates</Link></li>
                            <li><Link href="/seller/returns" className="hover:text-yellow-400 transition-colors">Return Policy</Link></li>
                            <li><Link href="/seller/fees" className="hover:text-yellow-400 transition-colors">Seller Fees</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link href="/seller/stories" className="hover:text-yellow-400 transition-colors">Success Stories</Link></li>
                            <li><Link href="/seller/learning" className="hover:text-yellow-400 transition-colors">Seller Learning Center</Link></li>
                            <li><Link href="/seller/wholesale" className="hover:text-yellow-400 transition-colors">Wholesale Market</Link></li>
                            <li><Link href="/seller/ads" className="hover:text-yellow-400 transition-colors">VogueX Ads</Link></li>
                            <li><Link href="/seller/api" className="hover:text-yellow-400 transition-colors">API Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Help & Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/seller/support" className="hover:text-yellow-400 transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Support</Link></li>
                            <li><Link href="/seller/ticket" className="hover:text-yellow-400 transition-colors">Raise a Ticket</Link></li>
                            <li><Link href="/seller/grievance" className="hover:text-yellow-400 transition-colors">Grievance Officer</Link></li>
                            <li><Link href="/seller/ipr" className="hover:text-yellow-400 transition-colors">Report IPR Infringement</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-8 text-xs font-medium text-slate-500">
                        <Link href="/seller/terms" className="hover:text-white">Terms of Use</Link>
                        <Link href="/seller/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/seller/agreement" className="hover:text-white">Seller Agreement</Link>
                        <Link href="/seller/sitemap" className="hover:text-white">Sitemap</Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>© 2024-2025 VogueX Internet Pvt Ltd. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
