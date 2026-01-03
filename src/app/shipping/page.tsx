
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function ShippingPage() {
    return (
        <PolicyLayout title="Shipping & Delivery">
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Delivery Charges</h3>
            <p className="mb-4">
                Free shipping for all orders above ₹999. For orders below ₹999, a nominal delivery charge of ₹40 applies.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Estimated Delivery Time</h3>
            <p className="mb-4">
                Metro cities: 2-4 business days.<br />
                Rest of India: 4-7 business days.<br />
                Remote areas: 7+ business days.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Order Tracking</h3>
            <p className="mb-4">
                Once your order is shipped, you will receive a tracking link via SMS and Email. You can also track your order in the 'My Orders' section of your profile.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">4. International Shipping</h3>
            <p className="mb-4">
                Currently, we only ship within India. We plan to expand globally soon.
            </p>
        </PolicyLayout>
    )
}
