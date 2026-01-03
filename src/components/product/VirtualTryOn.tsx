"use client"

import React, { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Camera, X, RefreshCw } from "lucide-react"
import Image from "next/image"

export function VirtualTryOn({ productImage }: { productImage?: string }) {
    const webcamRef = useRef<Webcam>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [imgSrc, setImgSrc] = useState<string | null>(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setImgSrc(imageSrc)
        }
    }, [webcamRef])

    const retake = () => {
        setImgSrc(null)
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} variant="secondary" className="w-full gap-2">
                <Camera className="w-4 h-4" />
                Virtual Try-On
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-background rounded-lg overflow-hidden">
                <div className="absolute top-4 right-4 z-20">
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="relative aspect-video bg-black">
                    {imgSrc ? (
                        <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                    ) : (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: "user" }}
                        />
                    )}

                    {/* Overlay Product Image (Mock positioning) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 pointer-events-none opacity-80">
                        {/* In a real app, use face detection to position this */}
                        <Image
                            src={productImage || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"}
                            alt="Try On Item"
                            width={400}
                            height={400}
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="p-4 flex justify-center gap-4 bg-background">
                    {imgSrc ? (
                        <Button onClick={retake} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Retake
                        </Button>
                    ) : (
                        <Button onClick={capture} className="gap-2">
                            <Camera className="w-4 h-4" />
                            Capture
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
