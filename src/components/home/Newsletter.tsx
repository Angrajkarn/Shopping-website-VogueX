"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/ui/MotionSection"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function Newsletter() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        try {
            const res = await api.subscribeNewsletter(email)
            if (res.message) {
                toast.success(res.message)
                setEmail("")
            } else {
                toast.error("Something went wrong.")
            }
        } catch (error) {
            toast.error("Failed to subscribe.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with parallax-like effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop"
                    alt="Newsletter Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container relative z-20 mx-auto px-4">
                <MotionSection className="max-w-2xl mx-auto text-center space-y-8 p-8 md:p-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Join the Revolution
                    </h2>
                    <p className="text-lg text-gray-200">
                        Subscribe to our newsletter for exclusive drops, early access to sales, and curated fashion trends delivered to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus-visible:ring-white/50 h-12"
                        />
                        <Button
                            size="lg"
                            disabled={loading}
                            className="bg-white text-black hover:bg-gray-200 h-12 font-semibold min-w-[140px]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Subscribe"}
                        </Button>
                    </form>
                    <p className="text-xs text-gray-400">
                        By subscribing, you agree to our Privacy Policy and Terms of Service.
                    </p>
                </MotionSection>
            </div>
        </section>
    )
}
