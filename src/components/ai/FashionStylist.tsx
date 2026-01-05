"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Bot, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAnalytics } from "@/hooks/useAnalytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
    id: string
    role: 'user' | 'bot'
    content: string
    type: 'text' | 'products'
    data?: any[]
    suggestions?: string[]
    timestamp: Date
}

export function FashionStylist() {
    const { sessionId } = useAnalytics()
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'bot',
            content: "Hi! I'm your AI Fashion Stylist. 👗 Looking for something specific or need style advice?",
            type: 'text',
            timestamp: new Date()
        }
    ])

    // Auto-scroll to bottom
    const bottomRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            type: 'text',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        try {
            // Call API
            const res = await api.askStylist(userMsg.content, sessionId || "guest")

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: res.response,
                type: res.type || 'text',
                data: res.data,
                suggestions: res.suggestions, // Capture suggestions
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'bot',
                content: "My fashion senses are tingling, but I can't connect right now. Try again?",
                type: 'text',
                timestamp: new Date()
            }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="pointer-events-auto bg-white border shadow-2xl rounded-2xl w-[320px] md:w-[380px] h-[500px] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden bg-white/10">
                                    <img src="/stylist.png" alt="Stylist" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Fashion Stylist</h3>
                                    <p className="text-[10px] text-purple-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={msg.id} className="flex flex-col gap-2">
                                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                                                    ? 'bg-purple-600 text-white rounded-br-none'
                                                    : 'bg-white border rounded-tl-none text-slate-700'
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                                {/* Product Carousel inside Context */}
                                                {msg.type === 'products' && msg.data && (
                                                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                                        {msg.data.map((p: any) => (
                                                            <Link href={`/products/${p.id}`} key={p.id} className="min-w-[140px] snap-center bg-white rounded-xl border border-slate-100 overflow-hidden block hover:shadow-md transition-all no-underline group">
                                                                <div className="aspect-[3/4] relative bg-slate-100 overflow-hidden">
                                                                    <img src={p.image} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                                                                </div>
                                                                <div className="p-2.5">
                                                                    <p className="font-medium text-xs truncate text-slate-900">{p.name}</p>
                                                                    <p className="text-xs text-purple-600 font-bold mt-0.5">₹{p.price}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Reply Chips */}
                                        {msg.role === 'bot' && msg.suggestions && idx === messages.length - 1 && (
                                            <div className="flex gap-2 flex-wrap ml-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                                {msg.suggestions.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setInput(s)}
                                                        className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border shadow-sm rounded-2xl rounded-tl-none px-4 py-3">
                                            <div className="flex gap-1">
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} className="h-1" />
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-3 bg-white border-t flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about outfits..."
                                className="bg-slate-50 border-slate-200 focus-visible:ring-purple-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button size="icon" className="bg-purple-600 hover:bg-purple-700" onClick={handleSend}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-0 rounded-full shadow-lg shadow-purple-600/30 flex items-center justify-center group overflow-hidden w-16 h-16 border-2 border-white"
            >
                <div className="relative w-full h-full">
                    {isOpen ? (
                        <div className="w-full h-full flex items-center justify-center bg-purple-700">
                            <X className="w-6 h-6" />
                        </div>
                    ) : (
                        <img src="/stylist.png" alt="AI" className="w-full h-full object-cover" />
                    )}

                    {/* Badge */}
                    {!isOpen && (
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </div>
            </motion.button>
        </div>
    )
}
