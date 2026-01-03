
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms of Service">
            <p className="text-gray-500 mb-6">Last updated: November 2025</p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Agreement to Terms</h3>
            <p className="mb-4">
                By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                If you do not agree with these terms, you are prohibited from using or accessing this site or using any other services provided by VogueX.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Use License</h3>
            <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on VogueX's website for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Disclaimer</h3>
            <p className="mb-4">
                The materials on VogueX's website are provided on an 'as is' basis. VogueX makes no warranties, expressed or implied,
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Limitations</h3>
            <p className="mb-4">
                In no event shall VogueX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                or due to business interruption) arising out of the use or inability to use the materials on VogueX's website.
            </p>
        </PolicyLayout>
    )
}
