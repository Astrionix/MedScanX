'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { SkeletonList } from '@/components/ui/Skeleton'
import { Disclaimer } from '@/components/medical/Disclaimer'
import type { Scan } from '@/lib/types'

export default function DashboardPage() {
    const router = useRouter()
    const [scans, setScans] = useState<Scan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchScans()
    }, [])

    const fetchScans = async () => {
        try {
            const response = await fetch('/api/scans')

            if (response.status === 401) {
                router.push('/login')
                return
            }

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch scans')
            }

            setScans(data.scans || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
            router.refresh()
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

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
                        <div className="flex items-center gap-4">
                            <Link href="/upload">
                                <Button variant="primary">
                                    <span className="mr-2">📤</span>
                                    Upload Scan
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Your Scan History
                        </h2>
                        <p className="text-gray-600">
                            View and manage your CT scan analyses
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
                    {isLoading && <SkeletonList count={3} />}

                    {/* Empty State */}
                    {!isLoading && scans.length === 0 && (
                        <Card className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No scans yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Upload your first CT scan to get started with AI analysis
                            </p>
                            <Link href="/upload">
                                <Button variant="primary" size="lg">
                                    <span className="mr-2">📤</span>
                                    Upload Your First Scan
                                </Button>
                            </Link>
                        </Card>
                    )}

                    {/* Scans Grid */}
                    {!isLoading && scans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scans.map((scan) => (
                                <Link key={scan.id} href={`/scan/${scan.id}`}>
                                    <Card hover className="h-full">
                                        <div className="space-y-4">
                                            {/* Scan Image */}
                                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={scan.scan_url}
                                                    alt={scan.scan_name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Scan Info */}
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {scan.scan_name}
                                                </h3>
                                                <SeverityBadge severity={scan.severity} />
                                                <p className="text-sm text-gray-500">
                                                    {new Date(scan.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>

                                            {/* Quick Preview */}
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {scan.analysis}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
