"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Bot, FileText, Truck, RefreshCw, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

type Message = {
    id: string
    role: 'user' | 'bot'
    content: string
    type: 'text' | 'tracking' | 'options'
    options?: string[]
    timestamp: Date
}

interface OrderSupportChatProps {
    order: any
    isOpen: boolean
    onClose: () => void
    userName: string
}

export function OrderSupportChat({ order, isOpen, onClose, userName }: OrderSupportChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsTyping(true)
            setTimeout(() => {
                setMessages([
                    {
                        id: 'init-1',
                        role: 'bot',
                        content: `Hi ${userName}! 👋 I'm your dedicated support assistant for this order.`,
                        type: 'text',
                        timestamp: new Date()
                    },
                    {
                        id: 'init-2',
                        role: 'bot',
                        content: "How can I help you with this shipment?",
                        type: 'options',
                        options: ["Where is my order?", "I want to return", "Download Invoice", "Other Issue"],
                        timestamp: new Date()
                    }
                ])
                setIsTyping(false)
            }, 1000)
        }
    }, [isOpen, messages.length, userName])

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return

        // User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            type: 'text',
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulate Bot Response
        setTimeout(() => {
            let botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: "I'm connecting you with a support specialist...",
                type: 'text',
                timestamp: new Date()
            }

            const lowerText = text.toLowerCase()

            if (lowerText.includes("where") || lowerText.includes("track") || lowerText.includes("status")) {
                botResponse = {
                    ...botResponse,
                    content: `Your order is currently **${order.status}**. It is expected to arrive by **${new Date(order.estimated_delivery_date || Date.now() + 86400000 * 3).toLocaleDateString()}**.`,
                    type: 'tracking' // Could trigger a special UI
                }
            } else if (lowerText.includes("return") || lowerText.includes("exchange")) {
                botResponse = {
                    ...botResponse,
                    content: "I can help with returns. Please select the reason for return:",
                    type: 'options',
                    options: ["Size Issue", "Damaged Product", "Quality Issue", "Changed my mind"]
                }
            } else if (lowerText.includes("invoice") || lowerText.includes("bill")) {
                botResponse = {
                    ...botResponse,
                    content: "Sure! I've generated the invoice for this order. You can download it below.",
                    type: 'text'
                }
                // Simulate file attachment logic here if needed
            } else if (lowerText.includes("cancel")) {
                botResponse = {
                    ...botResponse,
                    content: "I can check if cancellation is possible. Are you sure you want to proceed?",
                    type: 'options',
                    options: ["Yes, Cancel Order", "No, Keep Order"]
                }
            } else {
                botResponse = {
                    ...botResponse,
                    content: "I understand. Let me check the details for you. One moment please...",
                    type: 'text'
                }
            }

            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1500)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[60] w-full md:w-[400px] h-[100dvh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-sans"
            >
                {/* Header */}
                <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Support Assistant</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                <span className="text-xs font-medium">Online • Order Support</span>
                            </div>
                        </div>
                    </div>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 rounded-full z-10" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Context Card (Sticky Top) */}
                <div className="bg-slate-50 border-b p-3 flex gap-3 items-center backdrop-blur-xl bg-slate-50/90 sticky top-0 z-10">
                    <div className="h-12 w-12 rounded-lg border bg-white p-1 relative overflow-hidden shrink-0">
                        {order.items && order.items[0] && (
                            <Image
                                src={order.items[0].product_image || "/placeholder.jpg"}
                                alt="Product"
                                fill
                                className="object-contain"
                            />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium">Ref: #{order.order_id}</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {order.items && order.items[0]?.product_name}
                            {order.items?.length > 1 && <span className="text-slate-500 font-normal"> +{order.items.length - 1} more</span>}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 bg-[#f1f3f6] p-4">
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                        </div>

                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Name Bubble (Only for bot) */}
                                    {msg.role === 'bot' && (
                                        <div className="flex items-center gap-2 mb-1 pl-1">
                                            <Avatar className="w-4 h-4">
                                                <AvatarImage src="/stylist.png" />
                                                <AvatarFallback className="bg-blue-600 text-[8px] text-white">AI</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[10px] text-slate-500">Assistant</span>
                                        </div>
                                    )}

                                    <div
                                        className={`px-4 py-3 text-sm shadow-sm relative group ${msg.role === 'user'
                                                ? 'bg-[#2874f0] text-white rounded-[20px] rounded-tr-sm'
                                                : 'bg-white text-slate-800 rounded-[20px] rounded-tl-sm border'
                                            }`}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                                    </div>

                                    {/* Quick Reply Chips (for bot) */}
                                    {msg.type === 'options' && msg.options && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {msg.options.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSend(opt)}
                                                    className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors shadow-sm active:scale-95"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <span className="text-[10px] text-slate-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                <div className="bg-white border shadow-sm rounded-[20px] rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 bg-white border-t flex gap-2 items-center">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-slate-50 border-slate-200 focus-visible:ring-[#2874f0] rounded-full px-4"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        size="icon"
                        className={`rounded-full shadow-md transition-all ${input.trim() ? 'bg-[#2874f0] hover:bg-blue-700 scale-100' : 'bg-slate-200 text-slate-400 scale-90 pointer-events-none'}`}
                        onClick={() => handleSend()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
