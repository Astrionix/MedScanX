
'use client'

import React from 'react'
import { Card } from '../ui/Card'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

interface Change {
    type: 'improvement' | 'deterioration' | 'new_finding' | 'stable'
    description: string
}

interface ComparisonResult {
    summary: string
    changes: Change[]
    key_differences: string[]
    recommendation: string
}

export function ComparisonReport({ data }: { data: ComparisonResult }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'improvement': return <TrendingUp className="text-emerald-400" />
            case 'deterioration': return <TrendingDown className="text-red-400" />
            case 'new_finding': return <AlertCircle className="text-yellow-400" />
            default: return <Minus className="text-slate-400" />
        }
    }

    const getColor = (type: string) => {
        switch (type) {
            case 'improvement': return 'border-emerald-500/30 bg-emerald-950/30'
            case 'deterioration': return 'border-red-500/30 bg-red-950/30'
            case 'new_finding': return 'border-yellow-500/30 bg-yellow-950/30'
            default: return 'border-slate-700 bg-slate-800/50'
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary Header */}
            <Card className="bg-slate-900/80 border-cyan-500/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100 mb-1">Progression Summary</h3>
                        <p className="text-slate-300 leading-relaxed">{data.summary}</p>
                    </div>
                </div>
            </Card>

            {/* Changes List */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Detected Changes</h4>
                {data.changes.map((change, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border flex items-center gap-4 ${getColor(change.type)}`}
                    >
                        {getIcon(change.type)}
                        <span className="text-slate-200 font-medium">{change.description}</span>
                    </motion.div>
                ))}
            </div>

            {/* Key Differences & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Key Differences</h4>
                    <ul className="space-y-2">
                        {data.key_differences.map((diff, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                <span className="text-cyan-500 mt-1">•</span>
                                {diff}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 to-cyan-950/20">
                    <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">AI Recommendation</h4>
                    <p className="text-slate-200 text-base font-medium italic">
                        "{data.recommendation}"
                    </p>
                </Card>
            </div>
        </div>
    )
}
