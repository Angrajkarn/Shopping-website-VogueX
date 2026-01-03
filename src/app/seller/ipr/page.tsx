import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"

export default function SellerIprPage() {
    return (
        <SellerPolicyLayout title="Intellectual Property Rights (IPR) Protection" lastUpdated="Dec 2024">
            <p>VogueX respects the intellectual property rights of others and expects its sellers to do the same. We have a zero-tolerance policy towards counterfeit products.</p>

            <h3>Reporting Infringement</h3>
            <p>If you are a brand owner and believe that your IP rights have been infringed by a seller on our platform, you can file a report using our Brand Protection Portal.</p>

            <h3>Consequences for Sellers</h3>
            <p>Sellers found listing counterfeit products or infringing on others' IP rights will face:</p>
            <ul>
                <li>Immediate delisting of the product.</li>
                <li>Account suspension or permanent termination.</li>
                <li>Legal action as per applicable laws.</li>
            </ul>

            <h3>Brand Protection Portal</h3>
            <p>Brand owners can sign up for our Brand Registry program to get automated protection tools and dedicated support.</p>
        </SellerPolicyLayout>
    )
}
