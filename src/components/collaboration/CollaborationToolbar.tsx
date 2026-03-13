"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Link as LinkIcon, X, MessageSquare, Send, Check, Copy } from "lucide-react"
import { useCollaboration } from "@/context/CollaborationContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export const CollaborationToolbar: React.FC = () => {
    const { sessionId, isConnected, createSession, joinSession, messages, broadcastEvent } = useCollaboration()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)
    const [messageInput, setMessageInput] = useState("")
    const [copied, setCopied] = useState(false)

    const shareUrl = sessionId ? `${window.location.origin}${window.location.pathname}?session=${sessionId}` : ""

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSend = () => {
        if (!messageInput.trim()) return
        broadcastEvent('chat_message', { message: messageInput })
        setMessageInput("")
    }

    return (
        <div className="fixed bottom-24 right-6 z-[48] flex flex-col items-end gap-3 pointer-events-none">
            {/* Chat Window */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="pointer-events-auto w-80 h-96 bg-white rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="p-3 bg-indigo-600 text-white flex items-center justify-between">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Session Chat
                            </h3>
                            <button onClick={() => setChatOpen(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <ScrollArea className="flex-1 p-4 bg-slate-50">
                            <div className="space-y-3">
                                {messages.map((m, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold">{m.user} • {m.time}</span>
                                        <div className="bg-white border rounded-lg p-2 text-sm text-slate-700 shadow-sm">
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-2 border-t flex gap-2">
                            <Input 
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Say something..." 
                                className="h-8 text-xs"
                            />
                            <Button size="icon" className="h-8 w-8 bg-indigo-600" onClick={handleSend}>
                                <Send className="w-3 h-3" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl min-w-[240px]"
                    >
                        {!isConnected ? (
                            <div className="space-y-4">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Shop with Friends</h4>
                                <p className="text-slate-400 text-[10px]">Invite friends to see what you like in real-time!</p>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={createSession}>
                                    Start Session
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        LIVE SESSION
                                    </span>
                                    <span className="text-slate-500 text-[10px]">ID: {sessionId}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold">Invite Link</label>
                                    <div className="flex gap-1">
                                        <Input readOnly value={shareUrl} className="h-8 text-[10px] bg-white/5 border-white/10 text-slate-300" />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={copyLink}>
                                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-white/10 hover:bg-white/20 text-xs text-white" onClick={() => setChatOpen(true)}>
                                        Open Chat
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                    "pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg transition-all",
                    isConnected 
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20" 
                        : "bg-white border-slate-200 text-slate-600"
                )}
            >
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold">{isConnected ? "Shopping Together" : "Shop with Friends"}</span>
            </motion.button>
        </div>
    )
}
