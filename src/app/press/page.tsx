
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function PressPage() {
    return (
        <PolicyLayout title="Press Releases">
            <div className="space-y-8">
                <div className="border-b pb-6">
                    <span className="text-sm text-gray-500 font-bold uppercase">Dec 15, 2024</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 hover:text-blue-600 cursor-pointer">VogueX Launches AI-Powered Virtual Try-On Feature</h3>
                    <p className="text-gray-600">
                        Revolutionizing online shopping, VogueX introduces real-time AR try-on for its entire eyewear and accessories collection...
                    </p>
                </div>

                <div className="border-b pb-6">
                    <span className="text-sm text-gray-500 font-bold uppercase">Nov 01, 2024</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 hover:text-blue-600 cursor-pointer">VogueX Raises Series B Funding to Expand Global Footprint</h3>
                    <p className="text-gray-600">
                        Leading venture capital firms back VogueX's vision of sustainable, tech-first fashion retail...
                    </p>
                </div>

                <div className="border-b pb-6">
                    <span className="text-sm text-gray-500 font-bold uppercase">Oct 10, 2024</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 hover:text-blue-600 cursor-pointer">Introducing VogueX Sustainability Score</h3>
                    <p className="text-gray-600">
                        Customers can now see the environmental impact of every garment before purchasing...
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-4">
                <p className="text-gray-500 italic">For press inquiries, please contact press@voguex.com</p>
            </div>
        </PolicyLayout>
    )
}
