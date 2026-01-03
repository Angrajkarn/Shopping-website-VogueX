"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: { id: number; url: string; image_type: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    // Sort images: MAIN first, then others by display_order if available (assumed backend sorts)
    const [selectedImage, setSelectedImage] = useState(images[0]?.url || "")

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
