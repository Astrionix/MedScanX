'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ScanPreview } from '@/components/medical/ScanPreview'
import { AnalysisCard } from '@/components/medical/AnalysisCard'
import { PrecautionList } from '@/components/medical/PrecautionList'
import { RecommendationsCard } from '@/components/medical/RecommendationsCard'
import { Disclaimer } from '@/components/medical/Disclaimer'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Scan } from '@/lib/types'

export default function ScanDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [scan, setScan] = useState<Scan | null>(null)
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
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="text-3xl">🏥</span>
                            <h1 className="text-2xl font-bold medical-gradient bg-clip-text text-transparent">
                                MedScanX
                            </h1>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Scan Analysis Report
                        </h2>
                        <p className="text-gray-600">
                            Detailed AI-powered analysis of your CT scan
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <Disclaimer />

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
                                />
                                <AnalysisCard
                                    analysis={scan.analysis}
                                    severity={scan.severity}
                                />
                            </div>

                            {/* Recommendations and Abnormalities */}
                            <RecommendationsCard
                                recommendations={scan.recommendations}
                                abnormalities={scan.abnormalities}
                            />

                            {/* Precautions */}
                            <PrecautionList precautions={scan.precautions} />

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/upload">
                                    <Button variant="primary" size="lg">
                                        <span className="mr-2">📤</span>
                                        Upload Another Scan
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => window.print()}
                                >
                                    <span className="mr-2">🖨️</span>
                                    Print Report
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
