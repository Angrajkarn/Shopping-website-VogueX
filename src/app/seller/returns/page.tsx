import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"

export default function SellerReturnPolicyPage() {
    return (
        <SellerPolicyLayout title="Seller Return Policy" lastUpdated="January 1, 2025">
            <p>At VogueX, we strive to ensure a fair and transparent return process for both buyers and sellers. This policy outlines your obligations regarding returns.</p>

            <h3>1. Return Window</h3>
            <p>Customers can initiate a return within 7 days of delivery for Fashion items. As a seller, you agree to honor these returns if the product is unused and in original condition.</p>

            <h3>2. Seller Protection Fund (SPF)</h3>
            <p>If you receive a returned product that is damaged, used, or different from what you shipped, you can claim reimbursement under our Seller Protection Fund. You must raise a claim within 48 hours of receiving the return.</p>

            <h3>3. Reverse Shipping Fees</h3>
            <p>For customer-initiated returns (e.g., "Don't like the style"), VogueX may charge a reverse shipping fee. For returns due to seller error (e.g., "Wrong size sent"), you are liable for all shipping costs.</p>

            <h3>4. Quality Check</h3>
            <p>Our logistics partners perform a basic quality check at the customer's doorstep for select categories to minimize fraudulent returns.</p>
        </SellerPolicyLayout>
    )
}
