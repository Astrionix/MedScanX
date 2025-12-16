
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Logo } from '@/components/ui/Logo'
import { ScanPreview } from '@/components/medical/ScanPreview'
import { AnalysisCard } from '@/components/medical/AnalysisCard'
import { RecommendationsCard } from '@/components/medical/RecommendationsCard'
import { PrecautionList } from '@/components/medical/PrecautionList'
import { Disclaimer } from '@/components/medical/Disclaimer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Secret for signing share tokens (must match route.ts)
const SHARE_SECRET = new TextEncoder().encode(
    process.env.SHARE_SECRET_KEY || 'medscanx-temporary-share-secret-key-2025'
)

async function getSharedScan(token: string) {
    try {
        const { payload } = await jwtVerify(token, SHARE_SECRET)
        const scanId = payload.scanId as string

        // Use admin client to bypass RLS
        const { data: scan, error } = await supabaseAdmin
            .from('scans')
            .select('*')
            .eq('id', scanId)
            .single()

        if (error || !scan) return null
        return scan
    } catch (e) {
        console.error('Token verification failed:', e)
        return null
    }
}

export default async function SharedScanPage({ params }: { params: { token: string } }) {
    const scan = await getSharedScan(params.token)

    if (!scan) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Link Expired or Invalid</h1>
                <p className="text-slate-400 mb-8 max-w-md">
                    The secure link you are trying to access has expired or does not exist. Please ask for a new link.
                </p>
                <Link href="/">
                    <Button variant="primary">Go to MedScanX Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="glass-card sticky top-0 z-50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Logo size="sm" />
                            <span className="px-2 py-1 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs rounded-full uppercase tracking-wider font-semibold">
                                Secure Doctor View
                            </span>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="sm">Create Free Account</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">
                            Patient Scan Report
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 text-slate-400 text-sm">
                            <p>Scan ID: <span className="font-mono text-slate-500">{scan.id}</span></p>
                            <p>Generated: {new Date(scan.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <Disclaimer />

                    {/* Scan Preview and Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ScanPreview
                            scanUrl={scan.scan_url}
                            scanName={scan.scan_name}
                            createdAt={scan.created_at}
                            abnormalities={scan.abnormalities}
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
                </div>
            </main>
        </div>
    )
}
