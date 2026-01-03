import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"
import { Code2 } from "lucide-react"

export default function SellerApiPage() {
    return (
        <SellerPolicyLayout title="Seller API Documentation" lastUpdated="v2.4.0">
            <div className="bg-slate-100 p-6 rounded-xl border mb-8 flex items-start gap-4">
                <Code2 className="w-8 h-8 text-slate-500 mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 mt-0">Developer Access</h3>
                    <p className="mb-0 text-slate-600">
                        To access the VogueX Seller API, you need to generate an API Key from your seller dashboard under Settings &gt; Integration.
                    </p>
                </div>
            </div>

            <h3>Introduction</h3>
            <p>The VogueX Seller API allows you to programmatically manage your inventory, orders, and shipments. It uses standard RESTful principles and supports JSON for data interchange.</p>

            <h3>Base URL</h3>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
                <code>https://api.seller.voguex.com/v2</code>
            </pre>

            <h3>Authentication</h3>
            <p>Include your API key in the header of every request:</p>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
                <code>Authorization: Bearer YOUR_API_KEY</code>
            </pre>

            <h3>Endpoints</h3>
            <ul>
                <li><strong>GET /products</strong> - List all products</li>
                <li><strong>POST /orders/{'{order_id}'}/ship</strong> - Mark order as shipped</li>
                <li><strong>GET /analytics/sales</strong> - Get sales reports</li>
            </ul>
        </SellerPolicyLayout>
    )
}
