
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function PrivacyPage() {
    return (
        <PolicyLayout title="Privacy Policy">
            <p className="text-gray-500 mb-6">Last updated: November 2025</p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Introduction</h3>
            <p className="mb-4">
                Welcome to VogueX. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our website.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Data We Collect</h3>
            <p className="mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
                <li><strong>Identity Data:</strong> First name, last name, username.</li>
                <li><strong>Contact Data:</strong> Billing address, delivery address, email address, telephone numbers.</li>
                <li><strong>Financial Data:</strong> Payment card details (processed securely by Razorpay).</li>
                <li><strong>Transaction Data:</strong> Details about payments and purchases.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. How We Use Your Data</h3>
            <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, in the following circumstances:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>To perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests.</li>
                <li>To comply with a legal or regulatory obligation.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Data Security</h3>
            <p className="mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.
            </p>
        </PolicyLayout>
    )
}
