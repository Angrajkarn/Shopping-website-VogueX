
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function CorporatePage() {
    return (
        <PolicyLayout title="Corporate Information">
            <h3 className="text-lg font-bold text-gray-800 mb-2">VogueX Internet Private Limited</h3>
            <p className="mb-4">
                VogueX is a leading fashion technology company, dedicated to redefining the modern shopping experience through innovation and sustainability.
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Registered Office Address</h3>
            <p className="mb-4">
                VogueX Internet Private Limited,<br />
                Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
                Outer Ring Road, Devarabeesanahalli Village,<br />
                Bengaluru - 560103, Karnataka, India
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Company Identification Number (CIN)</h3>
            <p className="mb-4 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                U51109KA2012PTC066107
            </p>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Contact</h3>
            <p className="mb-4">
                Telephone: 044-45614700 / 044-67415800<br />
                Email: corporate@voguex.com
            </p>
        </PolicyLayout>
    )
}
