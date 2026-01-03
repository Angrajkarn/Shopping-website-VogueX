
import { PolicyLayout } from "@/components/layout/policy-layout"
import Link from "next/link"

export default function SitemapPage() {
    return (
        <PolicyLayout title="Sitemap">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Main Pages</h3>
            <ul className="list-disc ml-6 mb-6 space-y-1">
                <li><Link href="/" className="text-blue-600 hover:underline">Home</Link></li>
                <li><Link href="/about" className="text-blue-600 hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link></li>
                <li><Link href="/careers" className="text-blue-600 hover:underline">Careers</Link></li>
            </ul>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Shop Categories</h3>
            <ul className="list-disc ml-6 mb-6 space-y-1">
                <li><Link href="/men" className="text-blue-600 hover:underline">Men</Link></li>
                <li><Link href="/women" className="text-blue-600 hover:underline">Women</Link></li>
                <li><Link href="/kids" className="text-blue-600 hover:underline">Kids</Link></li>
                <li><Link href="/beauty" className="text-blue-600 hover:underline">Beauty & Grooming</Link></li>
            </ul>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Policy & Help</h3>
            <ul className="list-disc ml-6 mb-6 space-y-1">
                <li><Link href="/payments" className="text-blue-600 hover:underline">Payments</Link></li>
                <li><Link href="/shipping" className="text-blue-600 hover:underline">Shipping</Link></li>
                <li><Link href="/cancellation" className="text-blue-600 hover:underline">Cancellation & Returns</Link></li>
                <li><Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-blue-600 hover:underline">Terms of Use</Link></li>
            </ul>
        </PolicyLayout>
    )
}
