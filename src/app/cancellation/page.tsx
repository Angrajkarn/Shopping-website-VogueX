
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function CancellationPage() {
    return (
        <PolicyLayout title="Cancellation & Returns">
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Cancellation Policy</h3>
            <p className="mb-4">
                You can cancel your order anytime before it is shipped. Once shipped, the cancellation option may not be available.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Return Policy</h3>
            <p className="mb-4">
                We offer a "No Questions Asked" 30-day return policy for most items. Items must be unused, unwashed, and with original tags attached.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Refund Timeline</h3>
            <p className="mb-4">
                Refunds are processed within 24-48 hours after the returned item passes our quality check.
                <ul className="list-disc ml-6 mt-2">
                    <li>Original Payment Source: 5-7 business days.</li>
                    <li>VogueX Wallet: Instant.</li>
                </ul>
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Non-Returnable Items</h3>
            <p className="mb-4">
                Lingerie, innerwear, and personal care products are non-returnable due to hygiene reasons.
            </p>
        </PolicyLayout>
    )
}
