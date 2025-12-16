
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Scan } from '@/lib/types'

interface Message {
    id: string
    role: 'user' | 'ai'
    content: string
}

interface ChatInterfaceProps {
    scanContext: Scan
}

export function ChatInterface({ scanContext }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Hello! I\'ve analyzed your scan and I\'m here to help. Do you have any specific questions about the findings?'
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // Prepare history for API
            const previousMessages = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }))

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    previousMessages,
                    scanContext: {
                        analysis: scanContext.analysis,
                        severity: scanContext.severity,
                        abnormalities: scanContext.abnormalities,
                        recommendations: scanContext.recommendations
                    }
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error)

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.response
            }

            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: 'I apologize, but I encountered an error processing your request. Please try again.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-gray-700/30 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                    🤖
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-100">MediChat Assistant</h3>
                    <p className="text-sm text-slate-400">Ask questions about your scan findings</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-cyan-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-gray-700/30">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about details, medical terms, or next steps..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                    disabled={isLoading}
                />
                <Button variant="primary" type="submit" isLoading={isLoading} disabled={!input.trim()}>
                    Send
                </Button>
            </form>
        </Card>
    )
}
