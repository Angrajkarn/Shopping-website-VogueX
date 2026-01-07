"use client"

import { useState } from "react"
import { Share, Copy, Check, Twitter, Facebook } from "lucide-react"
import { MessageCircle } from "lucide-react" // For WhatsApp fallback
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"

export function ShareButton() {
    const [copied, setCopied] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const url = typeof window !== "undefined" ? window.location.href : ""
    const title = typeof document !== "undefined" ? document.title : "Check this out!"

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: "Check out this amazing product on VogueX!",
                    url: url,
                })
                toast.success("Shared successfully!")
            } catch (err) {
                console.log("Share cancelled", err)
            }
        } else {
            // Fallback for desktop check inside click handler if needed, 
            // but we usually hide this button on desktop or use Popover
            setIsOpen(true)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(`Check this out: ${url}`)
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    const shareToTwitter = () => {
        const text = encodeURIComponent(`Check this custom fit! ${url}`)
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    }

    // Trigger Button Style (Matches user request: Icon + Text)
    const TriggerButton = (
        <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 transition-all"
            onClick={(e) => {
                // Determine if we should try native share first
                // Use a crude check for mobile, or just let Popover handle desktop
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                if (isMobile && navigator.share) {
                    e.preventDefault()
                    handleNativeShare()
                }
            }}
        >
            <Share className="h-4 w-4" />
            <span className="font-medium">Share</span>
        </Button>
    )

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {TriggerButton}
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none mb-2">Share this product</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Share this link with your friends and followers.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="gap-2 w-full justify-start" onClick={shareToWhatsApp}>
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            WhatsApp
                        </Button>
                        <Button variant="outline" className="gap-2 w-full justify-start" onClick={shareToTwitter}>
                            <Twitter className="h-4 w-4 text-blue-400" />
                            Twitter
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                            <Button
                                variant={copied ? "default" : "secondary"}
                                size="sm"
                                className="w-full gap-2 transition-all"
                                onClick={copyToClipboard}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
