"use client"

import { useRef } from "react"
import Image from "next/image"
import { Play, Heart, ChevronRight, ChevronLeft, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const creators = [
    {
        id: 1,
        handle: "@fashion_diaries",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
        video: true,
        look: "Summer Breeze",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        handle: "@urban_kai",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
        video: false,
        look: "City Walker",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        handle: "@bella_style",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
        video: true,
        look: "Neon Nights",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        id: 4,
        handle: "@street_gaze",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
        video: false,
        look: "Monochrome",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg"
    },
    {
        id: 5,
        handle: "@zara_looks",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
        video: true,
        look: "Boho Chic",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    {
        id: 6,
        handle: "@denim_king",
        image: "https://images.unsplash.com/photo-1542272617-0858607c2242?w=600&q=80",
        video: false,
        look: "Classic Blue",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg"
    }
]

export function CreatorStudio() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = 300
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount
            } else {
                current.scrollLeft += scrollAmount
            }
        }
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px] rounded-full">
                            <div className="bg-white p-2 rounded-full">
                                <Instagram className="w-6 h-6 text-pink-600" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Creator Studio</h2>
                            <p className="text-slate-500">Shop looks from your favorite influencers</p>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-full">View All Creators</Button>
                </div>

                <div className="relative group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
                    >
                        {creators.map((creator) => (
                            <motion.div
                                key={creator.id}
                                whileHover={{ scale: 1.02 }}
                                className="min-w-[240px] aspect-[9/16] relative rounded-2xl overflow-hidden cursor-pointer group shrink-0 snap-center bg-slate-100"
                            >
                                <Image
                                    src={creator.image}
                                    alt={creator.handle}
                                    fill
                                    className="object-cover"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

                                {/* Video Indicator */}
                                {creator.video && (
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                                        <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                )}

                                {/* User Info */}
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                                        <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
                                    </div>
                                    <span className="text-white text-xs font-bold drop-shadow-md">{creator.handle}</span>
                                </div>

                                {/* Bottom Interactive */}
                                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <p className="text-white font-bold text-lg mb-2">{creator.look}</p>
                                    <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        Shop This Look
                                    </Button>
                                </div>

                                {/* Like Button */}
                                <div className="absolute bottom-20 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>

                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -ml-4 z-10"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0 -mr-4 z-10"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
