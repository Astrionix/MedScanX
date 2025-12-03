import React from 'react'
import { Card } from './Card'

export function SkeletonCard() {
    return (
        <Card>
            <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </Card>
    )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}
