import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"
import Link from "next/link"

export default function SellerSitemapPage() {
    return (
        <SellerPolicyLayout title="Sitemap" lastUpdated="Jan 2025">
            <ul>
                <li><Link href="/seller">Home</Link></li>
                <li><Link href="/seller/intro">Start Selling</Link></li>
                <li><Link href="/seller/fees">Fees & Commission</Link></li>
                <li><Link href="/seller/shipping">Shipping & Delivery</Link></li>
                <li><Link href="/seller/support">Help Center</Link></li>
            </ul>
        </SellerPolicyLayout>
    )
}
