
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { ScanPreview } from '@/components/medical/ScanPreview'
import { ComparisonReport } from '@/components/medical/ComparisonReport'
import { createClient } from '@/lib/supabase/client'
import { Scan } from '@/lib/types'

export default function ComparePage() {
    const [scans, setScans] = useState<Scan[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [comparisonData, setComparisonData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    useEffect(() => {
        fetchScans()
    }, [])

    const fetchScans = async () => {
        setIsLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data } = await supabase
                .from('scans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setScans(data)
        }
        setIsLoading(false)
    }

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(s => s !== id))
        } else {
            if (selectedIds.length < 2) {
                setSelectedIds([...selectedIds, id])
            }
        }
    }

    const handleCompare = async () => {
        if (selectedIds.length !== 2) return

        setIsAnalyzing(true)
        setComparisonData(null)

        try {
            const response = await fetch('/api/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scanId1: selectedIds[0], scanId2: selectedIds[1] })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error)
            setComparisonData(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getSelectedScans = () => {
        const selected = scans.filter(s => selectedIds.includes(s.id))
        return selected.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <header className="glass-card sticky top-0 z-50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/dashboard"><Logo size="sm" /></Link>
                    <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Chrono-Compare™ Analysis</h1>
                    <p className="text-slate-400">Select two scans to perform a longitudinal AI analysis.</p>
                </div>

                {/* Selection Area */}
                {!comparisonData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {scans.map(scan => (
                                <div
                                    key={scan.id}
                                    onClick={() => toggleSelection(scan.id)}
                                    className={`relative cursor-pointer transition-all duration-200 ${selectedIds.includes(scan.id)
                                            ? 'ring-2 ring-cyan-500 scale-[1.02]'
                                            : 'hover:bg-slate-900/50 opacity-90 hover:opacity-100'
                                        }`}
                                >
                                    <ScanPreview
                                        scanUrl={scan.scan_url}
                                        scanName={scan.scan_name}
                                        createdAt={scan.created_at}
                                    />
                                    {selectedIds.includes(scan.id) && (
                                        <div className="absolute top-2 right-2 bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                            ✓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button
                                size="lg"
                                disabled={selectedIds.length !== 2 || isAnalyzing}
                                onClick={handleCompare}
                                isLoading={isAnalyzing}
                                className="w-full md:w-auto px-12"
                            >
                                {isAnalyzing ? 'Analyzing Differences...' : 'Compare Selected Scans'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Area */}
                {comparisonData && (
                    <div className="space-y-8 animate-fade-in">
                        <ComparisonReport data={comparisonData} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                            {getSelectedScans().map((scan, i) => (
                                <div key={scan.id} className="relative">
                                    <div className="absolute -top-4 left-4 bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold uppercase border border-slate-700">
                                        {i === 0 ? 'Original Baseline' : 'Current Scan'}
                                    </div>
                                    <ScanPreview
                                        scanUrl={scan.scan_url}
                                        scanName={scan.scan_name}
                                        createdAt={scan.created_at}
                                        abnormalities={scan.abnormalities}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Button variant="outline" onClick={() => setComparisonData(null)}>
                                Compare Different Scans
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
