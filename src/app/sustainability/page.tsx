"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function SustainabilityPage() {
    const targetRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    return (
        <div ref={targetRef} className="min-h-[200vh]">

            {/* Sticky Hero */}
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    style={{ opacity, scale }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
                        alt="Sustainability"
                        className="w-full h-full object-cover brightness-[0.6]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="text-center text-white max-w-4xl">
                            <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter">ZERO<br />WASTE</h1>
                            <p className="text-2xl md:text-3xl font-light tracking-wide">
                                Our commitment to the planet is absolute.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="relative bg-background z-10 -mt-[10vh] rounded-t-[3rem] p-8 md:p-24 shadow-2xl">
                <div className="max-w-4xl mx-auto space-y-24">

                    {/* Section 1 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold">100% Recycled Materials</h2>
                            <p className="text-lg text-muted-foreground">
                                By 2025, every thread used in our VogueX Essentials line will be derived from post-consumer recycled waste. We are actively cleaning oceans and landfills to produce luxury-grade fabrics.
                            </p>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1964&auto=format&fit=crop"
                            className="rounded-xl shadow-lg"
                        />
                    </div>

                    {/* Section 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="order-2 md:order-1">
                            <img
                                src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1983&auto=format&fit=crop"
                                className="rounded-xl shadow-lg"
                                alt="Logistics"
                            />
                        </div>
                        <div className="space-y-6 order-1 md:order-2">
                            <h2 className="text-4xl font-bold">Carbon Neutral Logistics</h2>
                            <p className="text-lg text-muted-foreground">
                                From our factories to your doorstep, every mile is offset. We partner with next-gen electric logistics fleets and invest in massive reforestation projects in the Amazon.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center py-12 bg-green-500/10 rounded-3xl">
                        <h2 className="text-3xl font-bold mb-4 text-green-700">Make an Impact</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Join our recycling program. Send us your old clothes (any brand), and get 20% off your next order.
                        </p>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">Start Recycling</Button>
                    </div>

                    {/* Roadmap 2030 */}
                    <div className="py-12">
                        <h2 className="text-3xl font-bold mb-12 text-center">Roadmap 2030</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-6 border rounded-xl">
                                <div className="text-4xl font-black text-green-600 mb-2">2026</div>
                                <h3 className="font-bold mb-2">Zero Plastic</h3>
                                <p className="text-sm text-muted-foreground">Eliminate all single-use plastics from our supply chain.</p>
                            </div>
                            <div className="p-6 border rounded-xl">
                                <div className="text-4xl font-black text-green-600 mb-2">2028</div>
                                <h3 className="font-bold mb-2">100% Circular</h3>
                                <p className="text-sm text-muted-foreground">Every product designed to be recycled or biodegraded.</p>
                            </div>
                            <div className="p-6 border rounded-xl">
                                <div className="text-4xl font-black text-green-600 mb-2">2030</div>
                                <h3 className="font-bold mb-2">Water Positive</h3>
                                <p className="text-sm text-muted-foreground">Return more clean water to nature than we use.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
