"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Mail, FileQuestion, LifeBuoy } from "lucide-react"

export default function SellerSupportPage() {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">How can we help you?</h1>
                    <p className="text-xl text-slate-500">
                        Our dedicated seller support team is available 24/7 to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                        <p className="text-gray-500 mb-6">Instant support for urgent issues.</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Chat Now</Button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Request Callback</h3>
                        <p className="text-gray-500 mb-6">We'll call you back within 15 mins.</p>
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">Request Call</Button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email Support</h3>
                        <p className="text-gray-500 mb-6">Get response within 24 hours.</p>
                        <Button variant="outline" className="w-full">sell@voguex.com</Button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-blue-600" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            "How do I change my bank account details?",
                            "My product is not visible on the website.",
                            "How to process a return request?",
                            "When will I receive my payment?"
                        ].map((q, i) => (
                            <div key={i} className="p-4 border rounded-xl hover:bg-slate-50 cursor-pointer flex justify-between items-center group">
                                <span className="font-medium text-slate-700">{q}</span>
                                <FileQuestion className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
