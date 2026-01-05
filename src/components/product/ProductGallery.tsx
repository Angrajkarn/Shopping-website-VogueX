"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

import { Share2, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
    images: { id: number; url: string; image_type: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    // Sort images: MAIN first, then others by display_order if available (assumed backend sorts)
    const [selectedImage, setSelectedImage] = useState(images[0]?.url || "")

    const handleShare = async () => {
        const shareData = {
            title: 'Check out this product on VogueX!',
            text: 'I found this amazing fashion item. Have a look!',
            url: window.location.href
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback
            try {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard", {
                    icon: <Copy className="h-4 w-4 text-green-500" />
                })
            } catch (err) {
                toast.error("Failed to copy link")
            }
        }
    }

    if (!images || images.length === 0) return <div className="bg-gray-100 aspect-square rounded-xl" />

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border relative group">
                <img
                    src={selectedImage}
                    alt="Product View"
                    className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.url)}
                        className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2 transition-all p-1",
                            selectedImage === img.url
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-gray-300"
                        )}
                    >
                        <img
                            src={img.url}
                            alt="Thumbnail"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
