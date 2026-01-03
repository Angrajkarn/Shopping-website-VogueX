"use client"

import { MotionSection } from "@/components/ui/MotionSection"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Fashion Blogger",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        content: "The quality of the clothes is unmatched. I've never felt more confident in my outfits. VOGUEX is truly a game-changer.",
        rating: 5,
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Creative Director",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        content: "Exceptional customer service and delivery speed. The 3D viewer helped me pick the perfect size. Highly recommended!",
        rating: 5,
    },
    {
        id: 3,
        name: "Emma Davis",
        role: "Stylist",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        content: "I love the curated collections. It's so easy to find pieces that work together. The virtual try-on feature is a lifesaver.",
        rating: 5,
    },
]

export function Testimonials() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <MotionSection className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </MotionSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <MotionSection
                            key={testimonial.id}
                            delay={index * 0.2}
                            className="bg-card p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-lg text-muted-foreground mb-8 italic">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">{testimonial.name}</h4>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </MotionSection>
                    ))}
                </div>
            </div>
        </section>
    )
}
