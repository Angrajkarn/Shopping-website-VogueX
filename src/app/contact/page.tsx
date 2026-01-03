"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const form = new FormData(e.currentTarget)
        const data = {
            name: form.get("name") as string,
            email: form.get("email") as string,
            subject: form.get("subject") as string,
            message: form.get("message") as string,
        }

        try {
            await api.sendMessage(data)
            setSuccess(true)
            toast({
                title: "Message Sent!",
                description: "We'll get back to you as soon as possible.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Have a question or proposal? We'd love to hear from you.
                </motion.p>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">hello@voguex.com</p>
                                        <p className="text-muted-foreground">support@voguex.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground">
                                            123 Fashion Ave<br />
                                            New York, NY 10001<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mini Map (Static Image) - In pro app this would be Google Maps */}
                        <div className="rounded-xl overflow-hidden h-64 shadow-lg border">
                            <img
                                src="https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=1948&auto=format&fit=crop"
                                alt="Map"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden border-none shadow-xl">
                            <CardContent className="p-8 md:p-12">
                                {success ? (
                                    <div className="text-center py-20 space-y-6">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                            <Send className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-green-700">Message Sent!</h2>
                                        <p className="text-lg text-muted-foreground">
                                            Thank you for reaching out. We will respond to your inquiry within 24 hours.
                                        </p>
                                        <Button onClick={() => setSuccess(false)} variant="outline">
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" name="name" placeholder="John Doe" required className="h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" name="subject" placeholder="How can we help?" required className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" name="message" placeholder="Type your message here..." required className="min-h-[200px] resize-none" />
                                        </div>
                                        <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
