
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Target, Eye } from "lucide-react"

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero */}
            <section className="bg-gray-900 py-24 text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Grow your brand with <br /><span className="text-blue-400">VogueX Ads</span></h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl">Reach millions of high-intent shoppers directly at the point of purchase. Boost visibility and sales with our advanced ad platform.</p>
                    <Link href="/contact">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold px-8 h-12 text-lg">
                            Contact Sales
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-gray-50 border-b">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-4">
                        <h3 className="text-4xl font-black text-gray-900 mb-2">15M+</h3>
                        <p className="text-gray-600 uppercase tracking-wide text-sm">Monthly Active Users</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-4xl font-black text-gray-900 mb-2">3.5x</h3>
                        <p className="text-gray-600 uppercase tracking-wide text-sm">Return on Ad Spend (ROAS)</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-4xl font-black text-gray-900 mb-2">100%</h3>
                        <p className="text-gray-600 uppercase tracking-wide text-sm">Brand Safety</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">Precision Targeting</h2>
                            <p className="text-lg text-gray-600 mb-8">Target customers based on shopping behavior, category interest, and demographics. Get your product in front of the right people at the right time.</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <Target className="text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold">Sponsored Products</h4>
                                        <p className="text-gray-500 text-sm">Boost listing visibility in search results.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Eye className="text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold">Brand Story Ads</h4>
                                        <p className="text-gray-500 text-sm">Showcase your brand lifestyle on the homepage.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        {/* Placeholder Graphic */}
                        <div className="bg-gray-100 h-80 rounded-2xl flex items-center justify-center text-gray-400">
                            <BarChart className="w-20 h-20 opacity-20" />
                            <span className="ml-4 font-bold text-2xl opacity-20">Ad Analytics Dashboard</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
