"use client"

import Image from "next/image"
import { Instagram } from "lucide-react"
import { MotionSection } from "@/components/ui/MotionSection"

const socialPosts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        handle: "@fashion_advance",
        likes: "2.4k",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        handle: "@style_icon",
        likes: "1.8k",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=800&q=80",
        handle: "@urban_trends",
        likes: "3.2k",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        handle: "@men_style",
        likes: "1.5k",
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        handle: "@chic_vogue",
        likes: "4.1k",
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
        handle: "@street_wear",
        likes: "2.9k",
    },
]

export function SocialGrid() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <MotionSection className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">Shop the Look</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        See how our community styles their favorite pieces. Tag us @VOGUEX to be featured.
                    </p>
                </MotionSection>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {socialPosts.map((post, index) => (
                        <MotionSection
                            key={post.id}
                            delay={index * 0.1}
                            className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                        >
                            <Image
                                src={post.image}
                                alt={`Social post by ${post.handle}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                                <Instagram className="text-white w-8 h-8 mb-2" />
                                <span className="text-white font-bold">{post.handle}</span>
                                <span className="text-white/80 text-sm">{post.likes} likes</span>
                            </div>
                        </MotionSection>
                    ))}
                </div>
            </div>
        </section>
    )
}
