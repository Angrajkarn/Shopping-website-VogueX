
import { PolicyLayout } from "@/components/layout/policy-layout"

export default function StoriesPage() {
    return (
        <PolicyLayout title="VogueX Stories">
            <p className="mb-8 text-gray-600 text-lg">Inside the world of fashion, technology, and culture.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image</div>
                    <div className="p-4">
                        <span className="text-xs text-blue-600 font-bold uppercase">Trend Report</span>
                        <h3 className="font-bold text-gray-900 mt-1 mb-2">The Return of Y2K Fashion</h3>
                        <p className="text-sm text-gray-600">Why low-rise jeans and baby tees are taking over Gen Z wardrobes.</p>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image</div>
                    <div className="p-4">
                        <span className="text-xs text-green-600 font-bold uppercase">Sustainability</span>
                        <h3 className="font-bold text-gray-900 mt-1 mb-2">Meet the Makers: Organic Cotton Farmers</h3>
                        <p className="text-sm text-gray-600">A journey to the fields of Gujarat where our cotton begins its life.</p>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image</div>
                    <div className="p-4">
                        <span className="text-xs text-purple-600 font-bold uppercase">Tech</span>
                        <h3 className="font-bold text-gray-900 mt-1 mb-2">How AI Predicts Your Next Outfit</h3>
                        <p className="text-sm text-gray-600">The algorithm behind our personalized styling engine explained.</p>
                    </div>
                </div>
            </div>
        </PolicyLayout>
    )
}
