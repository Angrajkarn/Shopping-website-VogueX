import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"

export default function SellerTermsPage() {
    return (
        <SellerPolicyLayout title="Seller Terms of Use" lastUpdated="December 28, 2024">
            <p>Welcome to VogueX Seller Services ("VogueX Seller Platform"). By using the Seller Platform, you agree to these conditions. Please read them carefully.</p>

            <h3>1. Account Registration</h3>
            <p>To start selling on VogueX, you must complete the registration process. You represent that you are of legal age to form a binding contract and are not a person barred from receiving services under the laws of India.</p>

            <h3>2. Listed Products</h3>
            <p>You agree to list products that are genuine, new, and not prohibited under our Restricted Items Policy. All product descriptions must be accurate and complete.</p>

            <h3>3. Fees and Payments</h3>
            <p>You agree to pay the applicable Commission Fees, Closing Fees, and Shipping Fees as detailed in our Fee Schedule. Payments will be settled to your bank account within 7-14 business days of successful delivery.</p>

            <h3>4. Shipping and Delivery</h3>
            <p>You must ensure that all orders are packed and ready for handover within the SLA (Service Level Agreement) timeframe prominently displayed on your dashboard.</p>

            <h3>5. Return Policy</h3>
            <p>You agree to accept returns for defective, damaged, or incorrect items in accordance with the VogueX Buyer Protection Policy.</p>
        </SellerPolicyLayout>
    )
}
