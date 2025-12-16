'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '../ui/Card'

interface ScanPreviewProps {
    scanUrl: string
    scanName: string
    createdAt: string
    abnormalities?: (string | { text: string; coordinates: { x: number; y: number } })[]
}

export function ScanPreview({ scanUrl, scanName, createdAt, abnormalities }: ScanPreviewProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative w-full h-96 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group">
                <Image
                    src={scanUrl}
                    alt={scanName}
                    fill
                    className="object-contain"
                    priority
                />

                {/* VisionX Overlay Layer */}
                {abnormalities?.map((abnormality, index) => {
                    const isObject = typeof abnormality !== 'string'
                    if (!isObject) return null

                    const { x, y } = (abnormality as any).coordinates

                    return (
                        <div
                            key={index}
                            className="absolute w-6 h-6 -ml-3 -mt-3 cursor-pointer z-10 group/marker"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            {/* Pulsing Core */}
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute inset-0 bg-red-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>

                            {/* Tooltip */}
                            <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 bg-slate-900/90 text-slate-100 text-xs p-2 rounded border border-red-500/50 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20 whitespace-normal text-center shadow-xl backdrop-blur-sm">
                                {(abnormality as any).text}
                                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900/90"></div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-slate-100">{scanName}</h3>
                    {abnormalities && abnormalities.some(a => typeof a !== 'string') && (
                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 animate-pulse">
                            VisionX Active
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-400">
                    Uploaded on {new Date(createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </Card>
    )
}
