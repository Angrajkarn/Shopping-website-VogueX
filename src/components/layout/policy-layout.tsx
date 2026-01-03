"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const policyLinks = [
    { name: "Payments", href: "/payments" },
    { name: "Shipping", href: "/shipping" },
    { name: "Cancellation & Returns", href: "/cancellation" },
    { name: "FAQ", href: "/faq" },
    { name: "Terms Of Use", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Privacy", href: "/privacy" },
    { name: "Sitemap", href: "/sitemap" },
    { name: "Grievance Redressal", href: "/grievance" },
    { name: "Corporate Info", href: "/corporate" },
]

export function PolicyLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <nav className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                            <div className="p-4 bg-[#172337] text-white font-medium uppercase text-sm tracking-wide">
                                Help & Settings
                            </div>
                            <div className="flex flex-col border border-t-0 rounded-b-lg">
                                {policyLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-3 text-sm border-b last:border-0 hover:bg-gray-50 hover:text-blue-600 transition-colors ${pathname === link.href ? "text-blue-600 font-bold bg-blue-50/50 border-l-4 border-l-blue-600" : "text-gray-600 border-l-4 border-l-transparent"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* Content */}
                    <main className="flex-1 bg-white rounded-lg shadow-sm p-6 md:p-8 min-h-[500px]">
                        <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">{title}</h1>
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
