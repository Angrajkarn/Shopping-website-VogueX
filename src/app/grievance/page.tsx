
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function GrievancePage() {
    return (
        <PolicyLayout title="Grievance Redressal">
            <p className="mb-4">
                In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:
            </p>

            <div className="border p-4 rounded-md bg-gray-50 mb-6">
                <h3 className="font-bold text-gray-900">Mr. Rakesh Kumar</h3>
                <p className="text-gray-600">Designation: Senior Manager - Customer Experience</p>
                <p className="text-gray-600">VogueX Internet Private Limited</p>
                <p className="text-gray-600 margin-top-2">
                    Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
                    Outer Ring Road, Devarabeesanahalli Village,<br />
                    Bengaluru, 560103, Karnataka, India
                </p>
                <p className="mt-4 font-medium">Email: grievance.officer@voguex.com</p>
                <p>Time: Mon - Sat (9:00 - 18:00)</p>
            </div>

            <p className="mb-4">
                If you have any complaints or concerns with regards to content or any other breach of Terms of Use, please contact the Grievance Officer securely.
            </p>
        </PolicyLayout>
    )
}
