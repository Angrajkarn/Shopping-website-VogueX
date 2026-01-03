"use client"

import { Truck, MapPin, Clock, Package, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SellerShippingPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://static-assets-web.flixcart.com/fk-sp-static/images/pre-login/banner-bg.svg')] bg-cover opacity-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Ship Seamlessly to 19,000+ Pincodes</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        VogueX Express ensures your products reach customers faster and safer.
                    </p>
                    <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold h-14 px-8 rounded-full">
                        Check Pincode Availability
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">VogueX Express</h3>
                        <p className="text-gray-500">End-to-end shipping managed by us. Just pack your product and we handle the rest.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Local Shops</h3>
                        <p className="text-gray-500">Hyperlocal delivery for faster fulfilment within your city limits.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Self Ship</h3>
                        <p className="text-gray-500">Use your own courier partners if you have specific logistic requirements.</p>
                    </div>
                </div>
            </section>

            {/* Step by Step */}
            <section className="bg-white py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-16">How Shipping Works</h2>

                    <div className="space-y-12 relative">
                        <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-100 hidden md:block" />

                        {[
                            { title: "Receive Order", desc: "Get notified when a customer places an order.", icon: Package },
                            { title: "Pack Product", desc: "Pack the item securely using VogueX branded packaging material.", icon: CheckCircle2 },
                            { title: "Download Label", desc: "Print the shipping label and invoice from the dashboard.", icon: FileText },
                            { title: "Handover", desc: "Our executive picks up the package from your doorstep.", icon: Truck },
                            { title: "Delivery", desc: "Product is delivered to the customer in 3-5 days.", icon: MapPin },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-8 items-start relative z-10">
                                <div className="w-14 h-14 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xl">
                                    {i + 1}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-500">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

import { FileText } from "lucide-react"
