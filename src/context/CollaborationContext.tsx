"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

type CollaborationEvent = {
    type: 'product_like' | 'chat_message' | 'user_joined'
    product_id?: string | number
    product_name?: string
    message?: string
    user: string
}

type CollaborationContextType = {
    sessionId: string | null
    isConnected: boolean
    members: string[]
    lastEvent: CollaborationEvent | null
    createSession: () => void
    joinSession: (id: string) => void
    broadcastEvent: (type: 'product_like' | 'chat_message', data: any) => void
    messages: { user: string, text: string, time: string }[]
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined)

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [members, setMembers] = useState<string[]>([])
    const [lastEvent, setLastEvent] = useState<CollaborationEvent | null>(null)
    const [messages, setMessages] = useState<{ user: string, text: string, time: string }[]>([])

    const connect = useCallback((id: string) => {
        if (socket) socket.close()

        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/collaboration/${id}/`
        const newSocket = new WebSocket(wsUrl)

        newSocket.onopen = () => {
            setIsConnected(true)
            setSessionId(id)
            toast.success("Connected to shopping session!")
        }

        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            
            if (data.type === 'system') {
                toast.info(data.message)
            } else {
                setLastEvent(data)
                if (data.type === 'chat_message') {
                    setMessages(prev => [...prev, {
                        user: data.user,
                        text: data.message || "",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }])
                }
            }
        }

        newSocket.onclose = () => {
            setIsConnected(false)
            setSessionId(null)
        }

        setSocket(newSocket)
    }, [socket])

    const createSession = () => {
        const id = Math.random().toString(36).substring(2, 9)
        connect(id)
    }

    const joinSession = (id: string) => {
        connect(id)
    }

    const broadcastEvent = (type: 'product_like' | 'chat_message', data: any) => {
        if (socket && isConnected) {
            socket.send(json.stringify({
                type,
                ...data
            }))
        }
    }

    useEffect(() => {
        // Auto-join if URL has session ID (to be implemented in page logic)
        return () => {
            if (socket) socket.close()
        }
    }, [])

    return (
        <CollaborationContext.Provider value={{
            sessionId,
            isConnected,
            members,
            lastEvent,
            createSession,
            joinSession,
            broadcastEvent,
            messages
        }}>
            {children}
        </CollaborationContext.Provider>
    )
}

export const useCollaboration = () => {
    const context = useContext(CollaborationContext)
    if (!context) throw new Error("useCollaboration must be used within a CollaborationProvider")
    return context
}
