"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Globe, Heart, ShieldCheck, Zap } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Background"
                        className="w-full h-full object-cover brightness-[0.3]"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight"
                    >
                        WE ARE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">VOGUEX</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10"
                    >
                        Redefining the intersection of luxury fashion and digital innovation since 2024.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl font-bold">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                At VogueX, we believe fashion is more than just clothing—it's a form of self-expression. Our mission is to democratize rigorous style through technology, making premium fashion accessible, sustainable, and strictly curated for the modern individual.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We combine AI-driven trend forecasting with artisanal craftsmanship to bring you collections that are ahead of the curve yet timeless in quality.
                            </p>
                            <Link href="/careers">
                                <Button size="lg" className="mt-4">Join Our Journey <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-xl w-full h-64 object-cover mt-12" />
                            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop" className="rounded-2xl shadow-xl w-full h-64 object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Core Values</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">The pillars that define our brand and drive our decisions every single day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: "Sustainability First", desc: "We are committed to carbon-neutral shipping and eco-friendly materials." },
                            { icon: Zap, title: "Innovation", desc: "Pushing boundaries with AI, AR try-ons, and smart fabrics." },
                            { icon: ShieldCheck, title: "Quality Guarantee", desc: "Every piece passes through a rigorous 20-point quality check." },
                            { icon: Heart, title: "Inclusivity", desc: "Fashion for every body type, every gender, and every style." },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-background p-8 rounded-xl shadow-sm border hover:shadow-md transition-all"
                            >
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our History</h2>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-12 border-l-2 border-muted pl-8 ml-4 md:ml-auto md:mr-auto">
                        <div className="relative">
                            <span className="absolute -left-[41px] top-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">2024</span>
                            <h3 className="text-xl font-bold mb-2">The Inception</h3>
                            <p className="text-muted-foreground">VogueX was founded in New York City with a radical idea: to merge high fashion with high tech.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-1 px-3 py-1 bg-muted text-muted-foreground text-sm font-bold rounded-full">2025</span>
                            <h3 className="text-xl font-bold mb-2">Global Expansion</h3>
                            <p className="text-muted-foreground">Launched flagship stores in London, Paris, and Tokyo. Introduced our proprietary "Eco-Weave" fabric.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
