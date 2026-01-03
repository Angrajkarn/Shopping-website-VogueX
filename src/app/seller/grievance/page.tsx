import { SellerPolicyLayout } from "@/components/seller/seller-policy-layout"

export default function SellerGrievancePage() {
    return (
        <SellerPolicyLayout title="Grievance Redressal" lastUpdated="Nov 2024">
            <p>At VogueX, we value your trust and are committed to resolving your concerns. In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are provided below:</p>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
                <h3 className="text-blue-900 mt-0">Mr. Rakesh Menon</h3>
                <p className="font-bold mb-1">Grievance Officer, VogueX Internet Pvt Ltd.</p>
                <p className="text-slate-600 mb-4">
                    Buildings Alyssa, Begonia & Clover, Embassy Tech Village,<br />
                    Outer Ring Road, Devarabeesanahalli Village,<br />
                    Bengaluru, 560103, Karnataka, India
                </p>
                <p><strong>Email:</strong> grievance.officer@voguex.com</p>
                <p><strong>Time:</strong> Mon - Sat (9:00 - 18:00)</p>
            </div>

            <h3>Process</h3>
            <p>Please provide the following information in your complaint:</p>
            <ul>
                <li>Your full name and contact information.</li>
                <li>Clear statement of the grievance.</li>
                <li>Relevant evidence or documents (screenshots, order IDs).</li>
            </ul>
        </SellerPolicyLayout>
    )
}
