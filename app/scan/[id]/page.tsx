'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { ScanPreview } from '@/components/medical/ScanPreview'
import { AnalysisCard } from '@/components/medical/AnalysisCard'
import { PrecautionList } from '@/components/medical/PrecautionList'
import { RecommendationsCard } from '@/components/medical/RecommendationsCard'
import { Disclaimer } from '@/components/medical/Disclaimer'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ChatInterface } from '@/components/medical/ChatInterface'
import { PDFReportBtn } from '@/components/medical/PDFReportBtn'
import { ShareButton } from '@/components/medical/ShareButton'
import type { Scan } from '@/lib/types'

import { LanguageSelector } from '@/components/medical/LanguageSelector'

export default function ScanDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [scan, setScan] = useState<Scan | null>(null)
    const [translatedScan, setTranslatedScan] = useState<Partial<Scan> | null>(null)
    const [currentLanguage, setCurrentLanguage] = useState('English')
    const [isTranslating, setIsTranslating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [scanId, setScanId] = useState<string>('')

    const fetchScan = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/scans/${id}`)

            if (response.status === 401) {
                router.push('/login')
                return
            }

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch scan')
            }

            setScan(data.scan)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [router])

    const handleLanguageChange = async (language: string) => {
        if (!scan || language === currentLanguage) return

        if (language === 'English') {
            setTranslatedScan(null)
            setCurrentLanguage('English')
            return
        }

        setIsTranslating(true)
        setCurrentLanguage(language)

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: {
                        analysis: scan.analysis,
                        abnormalities: scan.abnormalities,
                        precautions: scan.precautions,
                        recommendations: scan.recommendations,
                    },
                    targetLanguage: language,
                    context: 'CT Scan Radiology Report'
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            setTranslatedScan(data)
        } catch (err) {
            console.error('Translation error:', err)
            // Revert on error
            setCurrentLanguage(currentLanguage)
        } finally {
            setIsTranslating(false)
        }
    }

    useEffect(() => {
        if (params?.id) {
            setScanId(params.id)
            fetchScan(params.id)
        }
    }, [params, fetchScan])

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-card sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center">
                            <Logo size="sm" />
                        </Link>

                        <div className="flex items-center gap-4">
                            <LanguageSelector
                                currentLanguage={currentLanguage}
                                onLanguageChange={handleLanguageChange}
                                isLoading={isTranslating}
                            />
                            <Link href="/dashboard">
                                <Button variant="outline">Back to Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">
                            Scan Analysis Report
                        </h2>
                        <p className="text-slate-400">
                            Detailed AI-powered analysis of your CT scan
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <Disclaimer />

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    {/* Scan Details */}
                    {!isLoading && scan && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Scan Preview and Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ScanPreview
                                    scanUrl={scan.scan_url}
                                    scanName={scan.scan_name}
                                    createdAt={scan.created_at}
                                    abnormalities={scan.abnormalities}
                                />
                                <AnalysisCard
                                    analysis={translatedScan?.analysis || scan.analysis}
                                    severity={scan.severity}
                                />
                            </div>

                            {/* Recommendations and Abnormalities */}
                            <RecommendationsCard
                                recommendations={translatedScan?.recommendations || scan.recommendations}
                                abnormalities={translatedScan?.abnormalities || scan.abnormalities}
                            />

                            {/* Precautions */}
                            <PrecautionList precautions={translatedScan?.precautions || scan.precautions} />

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/upload">
                                    <Button variant="primary" size="lg">
                                        <span className="mr-2">📤</span>
                                        Upload Another Scan
                                    </Button>
                                </Link>
                                <PDFReportBtn scan={scan} />
                                <ShareButton scan={scan} />
                            </div>

                            {/* AI Chat Assistant */}
                            <div className="pt-8 border-t border-slate-700/50">
                                <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">
                                    Have Questions? Ask MediChat AI
                                </h3>
                                <ChatInterface scanContext={scan} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
