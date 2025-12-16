import React from 'react'
import { Card } from '../ui/Card'

interface PrecautionListProps {
    precautions: string[]
}

export function PrecautionList({ precautions }: PrecautionListProps) {
    if (!precautions || precautions.length === 0) {
        return null
    }

    return (
        <Card className="border-l-4 border-orange-500">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Precautions
                </h3>
                <ul className="space-y-3">
                    {precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-950/50 text-orange-400 border border-orange-500/20 rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                            </span>
                            <p className="text-slate-300 flex-1">{precaution}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )
}
