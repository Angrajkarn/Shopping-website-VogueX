
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function SecurityPage() {
    return (
        <PolicyLayout title="Security">
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Safe Shopping</h3>
            <p className="mb-4">
                At VogueX, we use 256-bit encryption technology to protect your card information while securely transmitting it to the respective banks for payment processing.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Payment Security</h3>
            <p className="mb-4">
                All credit card and debit card payments on VogueX are processed through secure and trusted payment gateways managed by leading banks.
                Banks now use the 3D Secure password service for online transactions, providing an additional layer of security through identity verification.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Reporting Issues</h3>
            <p className="mb-4">
                If you find any security vulnerability in our platform, please report it to security@voguex.com. We take security issues seriously and will investigate immediately.
            </p>
        </PolicyLayout>
    )
}
