
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Scan } from '@/lib/types'

interface ShareButtonProps {
    scan: Scan
}

export function ShareButton({ scan }: ShareButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [copied, setCopied] = useState(false)

    const generateShareLink = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scanId: scan.id })
            })
            const data = await response.json()
            if (data.shareUrl) {
                setShareUrl(data.shareUrl)
                setShowModal(true)
            }
        } catch (error) {
            console.error('Failed to share', error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <Button variant="outline" onClick={generateShareLink} isLoading={isLoading}>
                <span className="mr-2">🔗</span>
                Share with Doctor
            </Button>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold text-slate-100 mb-2">Secure Share Link</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            This link grants read-only access to this scan for 72 hours.
                        </p>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono"
                            />
                            <Button size="sm" onClick={copyToClipboard}>
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-700/30 p-3 rounded-lg flex gap-3 items-start">
                            <span className="text-yellow-500 mt-1">⚠️</span>
                            <p className="text-xs text-yellow-200/80">
                                Anyone with this link can view the scan analysis. Do not share on public forums.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
