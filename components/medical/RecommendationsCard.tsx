import React from 'react'
import { Card } from '../ui/Card'

interface RecommendationsCardProps {
    recommendations: string[]
    abnormalities: (string | { text: string })[]
}

export function RecommendationsCard({ recommendations, abnormalities }: RecommendationsCardProps) {
    return (
        <div className="space-y-6">
            {/* Abnormalities Section */}
            {abnormalities && abnormalities.length > 0 && (
                <Card className="border-l-4 border-red-500">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <span className="text-2xl">🔍</span>
                            Detected Abnormalities
                        </h3>
                        <ul className="space-y-2">
                            {abnormalities.map((abnormality, index) => {
                                const text = typeof abnormality === 'string' ? abnormality : abnormality.text
                                return (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">•</span>
                                        <p className="text-slate-300 flex-1">{text}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Card>
            )}

            {/* Recommendations Section */}
            {recommendations && recommendations.length > 0 && (
                <Card className="border-l-4 border-blue-500">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <span className="text-2xl">💡</span>
                            Recommendations
                        </h3>
                        <ul className="space-y-3">
                            {recommendations.map((recommendation, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-950/50 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                    <p className="text-slate-300 flex-1">{recommendation}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            )}
        </div>
    )
}
