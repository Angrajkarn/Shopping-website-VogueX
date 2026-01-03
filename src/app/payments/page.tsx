
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function PaymentsPage() {
    return (
        <PolicyLayout title="Payments">
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Payment Options</h3>
            <p className="mb-4">
                We accept major credit/debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm, etc.), and Wallets. Cash on Delivery (COD) is also available for most locations.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Is it safe to use my credit/debit card on VogueX?</h3>
            <p className="mb-4">
                Absolutely. All transactions are processed through secure gateways like Razorpay which are PCI-DSS compliant. We do not store your card details on our servers.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Cash on Delivery (COD)</h3>
            <p className="mb-4">
                COD is available for orders below ₹50,000. You can pay by cash or UPI at the time of delivery.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Hidden Charges</h3>
            <p className="mb-4">
                There are no hidden charges. The price you see on the product page is exactly what you pay. Delivery charges may apply for orders below a certain value.
            </p>
        </PolicyLayout>
    )
}
