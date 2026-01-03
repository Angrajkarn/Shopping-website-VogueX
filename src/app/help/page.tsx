
import Link from "next/link"
import { Search, Package, CreditCard, RefreshCw, User, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Search */}
            <div className="bg-[#172337] py-16 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
                <div className="max-w-2xl mx-auto px-4 relative">
                    <Search className="absolute left-7 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search for help (e.g. returns, payment issues)"
                        className="pl-12 h-12 text-black bg-white w-full rounded-full shadow-lg border-0"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 mb-12 relative z-10">
                    <Link href="/profile/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Package /></div>
                        <div>
                            <h3 className="font-bold">My Orders</h3>
                            <p className="text-sm text-gray-500">Track, return, or cancel orders</p>
                        </div>
                    </Link>
                    <Link href="/cancellation" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-full text-green-600"><RefreshCw /></div>
                        <div>
                            <h3 className="font-bold">Returns & Refunds</h3>
                            <p className="text-sm text-gray-500">Return policies and status</p>
                        </div>
                    </Link>
                    <Link href="/payments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-full text-purple-600"><CreditCard /></div>
                        <div>
                            <h3 className="font-bold">Payments</h3>
                            <p className="text-sm text-gray-500">Payment methods and issues</p>
                        </div>
                    </Link>
                </div>

                {/* Categories */}
                <h2 className="text-xl font-bold mb-6 text-gray-800">Browse Help Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { name: "Shipping & Delivery", href: "/shipping" },
                        { name: "Cancellations", href: "/cancellation" },
                        { name: "My Account", href: "/profile" },
                        { name: "Payment & Billing", href: "/payments" },
                        { name: "Coupons & Offers", href: "/faq" },
                        { name: "Privacy & Security", href: "/security" },
                        { name: "Terms of Use", href: "/terms" },
                        { name: "Contact Us", href: "/contact" },
                    ].map((topic) => (
                        <Link key={topic.name} href={topic.href} className="bg-white p-4 rounded border hover:border-blue-500 transition-colors text-gray-700 font-medium flex justify-between items-center group">
                            {topic.name}
                            <HelpCircle className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
