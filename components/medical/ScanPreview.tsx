'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '../ui/Card'

interface ScanPreviewProps {
    scanUrl: string
    scanName: string
    createdAt: string
}

export function ScanPreview({ scanUrl, scanName, createdAt }: ScanPreviewProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={scanUrl}
                    alt={scanName}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{scanName}</h3>
                <p className="text-sm text-gray-500">
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
