"use client"

import { motion } from "framer-motion"
import { Play, Quote, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const stories = [
    {
        name: "Anjali Gupta",
        brand: "Ethnic Weaves",
        growth: "10X Revenue",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
        quote: "VogueX gave my small boutique a national platform. From 10 orders a day to 100+ orders, the growth has been phenomenal.",
        color: "bg-pink-50"
    },
    {
        name: "Rahul Sharma",
        brand: "Urban Kicks",
        growth: "5000+ Orders",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d6229b?q=80&w=2070&auto=format&fit=crop",
        quote: "The seller dashboard is so intuitive. The analytics helped me understand customer trends and stock the right products.",
        color: "bg-blue-50"
    },
    {
        name: "Meera Reddy",
        brand: "Eco Gems",
        growth: "Top Seller Award",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        quote: "The payment cycle is very reliable. I get my payments on time, which helps me reinvest in my business faster.",
        color: "bg-green-50"
    }
]

export default function SellerStoriesPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform origin-top-right" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                            Seller <span className="text-yellow-400">Success</span> Stories
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                            Real stories from thousands of entrepreneurs who transformed their businesses on VogueX.
                        </p>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 font-bold h-14 px-8 rounded-full">
                            Submit Your Story
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 gap-20">
                    {stories.map((story, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}
                        >
                            <div className="flex-1 w-full relative group cursor-pointer">
                                <div className={`absolute inset-0 ${story.color} rounded-[3rem] transform rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-500`} />
                                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]">
                                    <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <Quote className="w-12 h-12 text-slate-200" />
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                                    "{story.quote}"
                                </h3>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900">{story.name}</h4>
                                    <p className="text-gray-500 font-medium">{story.brand}</p>
                                    <span className="inline-block mt-3 px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                                        Achievement: {story.growth}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-8">Ready to write your own success story?</h2>
                    <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold h-16 px-12 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all">
                        Start Selling Today <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </section>
        </div>
    )
}
