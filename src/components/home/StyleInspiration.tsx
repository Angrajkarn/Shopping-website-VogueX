"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const styles = [
    { user: "@urban_kai", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80", likes: "1.2k" },
    { user: "@sophia_style", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", likes: "4.5k" },
    { user: "@mode_daily", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80", likes: "892" },
    { user: "@street_fshn", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80", likes: "2.1k" },
    { user: "@denim_guru", image: "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=500&q=80", likes: "3.3k" },
    { user: "@summer_vibe", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80", likes: "1.8k" },
]

export function StyleInspiration() {
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
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">VOGUEX STUDIO</h2>
                    <p className="text-slate-500">Inspired by your favorite influencers</p>
                </div>

                <div className="relative group/scroll">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-4 scroll-smooth"
                    >
                        {styles.map((style, idx) => (
                            <motion.div
                                key={idx}
                                className="min-h-[300px] min-w-[220px] relative rounded-xl overflow-hidden cursor-pointer group shrink-0"
                                whileHover={{ scale: 1.02 }}
                            >
                                <Image src={style.image} alt="Style" fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white">
                                    <Heart className="w-4 h-4" />
                                </div>

                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="font-bold text-sm tracking-wide">{style.user}</p>
                                    <p className="text-xs opacity-80">{style.likes} Likes</p>
                                    <div className="mt-2 text-xs font-bold underline decoration-white/50 underline-offset-4 group-hover:decoration-white transition-all">
                                        Shop Look
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Navigation Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
