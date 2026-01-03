"use client"

import { Button } from "@/components/ui/button"
import { Search, BookOpen, Video, FileText, Award, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

const courses = [
    { title: "Getting Started with VogueX", type: "Course", duration: "45 mins", level: "Beginner", icon: BookOpen },
    { title: "Mastering Product Photography", type: "Video", duration: "12 mins", level: "Intermediate", icon: Video },
    { title: "Understanding Seller Fees", type: "Guide", duration: "10 mins", level: "Beginner", icon: FileText },
    { title: "Advanced Ads Campaign Management", type: "Course", duration: "2 hours", level: "Advanced", icon: Award },
    { title: "Packaging Guidelines", type: "Guide", duration: "15 mins", level: "Beginner", icon: FileText },
    { title: "Inventory Management Best Practices", type: "Video", duration: "25 mins", level: "Intermediate", icon: Video },
]

export default function SellerLearningPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white border-b py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Seller Learning Center</h1>
                    <p className="text-gray-500 mb-8">Master the art of selling online with our expert-curated courses.</p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input className="h-14 pl-12 text-lg rounded-full shadow-sm bg-gray-50 border-gray-200" placeholder="What do you want to learn today?" />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {["All", "Getting Started", "Orders & Shipping", "Payments", "Advertising", "Policy"].map((cat) => (
                        <button key={cat} className="px-6 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors">
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border hover:shadow-xl transition-all group cursor-pointer">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <course.icon className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded uppercase tracking-wider">{course.type}</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded uppercase tracking-wider">{course.level}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                            <p className="text-gray-500 text-sm mb-6">{course.duration} • Updated yesterday</p>
                            <div className="flex items-center text-blue-600 font-bold text-sm">
                                Start Learning <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
