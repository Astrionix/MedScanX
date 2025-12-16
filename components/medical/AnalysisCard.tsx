import React from 'react'
import { Card } from '../ui/Card'
import { SeverityBadge } from '../ui/SeverityBadge'

interface AnalysisCardProps {
    analysis: string
    severity: 'low' | 'medium' | 'high' | 'critical'
}

export function AnalysisCard({ analysis, severity }: AnalysisCardProps) {
    return (
        <Card>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-2xl">🔬</span>
                        AI Analysis
                    </h3>
                    <SeverityBadge severity={severity} />
                </div>
                <div className="prose prose-blue max-w-none text-slate-300">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
                </div>
            </div>
        </Card>
    )
}
