'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function DiagnosticPage() {
    const [results, setResults] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)

    const runDiagnostics = async () => {
        setIsLoading(true)
        const diagnostics: any = {}

        try {
            // Test Health Endpoint
            const healthRes = await fetch('/api/health')
            diagnostics.health = {
                status: healthRes.status,
                data: await healthRes.json()
            }
        } catch (err: any) {
            diagnostics.health = { error: err.message }
        }

        try {
            // Test Scans Endpoint (will return 401 if not logged in)
            const scansRes = await fetch('/api/scans')
            diagnostics.scans = {
                status: scansRes.status,
                data: await scansRes.json()
            }
        } catch (err: any) {
            diagnostics.scans = { error: err.message }
        }

        setResults(diagnostics)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🔧 MedScanX Diagnostics
                    </h1>
                    <p className="text-gray-600">
                        Test all API endpoints and check system status
                    </p>
                </div>

                <Card>
                    <div className="space-y-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={runDiagnostics}
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Run Diagnostics
                        </Button>

                        {Object.keys(results).length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Results:</h2>

                                {/* Health Check */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">
                                        Health Check (/api/health)
                                    </h3>
                                    <div className={`p-3 rounded ${results.health?.status === 200
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        <p className="font-mono text-sm">
                                            Status: {results.health?.status || 'Error'}
                                        </p>
                                        <pre className="mt-2 text-xs overflow-auto">
                                            {JSON.stringify(results.health?.data || results.health?.error, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* Scans Check */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">
                                        Scans API (/api/scans)
                                    </h3>
                                    <div className={`p-3 rounded ${results.scans?.status === 200
                                            ? 'bg-green-100 text-green-800'
                                            : results.scans?.status === 401
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        <p className="font-mono text-sm">
                                            Status: {results.scans?.status || 'Error'}
                                        </p>
                                        {results.scans?.status === 401 && (
                                            <p className="text-sm mt-1">
                                                ✓ Expected - User not logged in
                                            </p>
                                        )}
                                        <pre className="mt-2 text-xs overflow-auto">
                                            {JSON.stringify(results.scans?.data || results.scans?.error, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Quick Links:</h2>
                        <div className="flex flex-wrap gap-2">
                            <a href="/" className="text-blue-600 hover:underline">Home</a>
                            <span>•</span>
                            <a href="/login" className="text-blue-600 hover:underline">Login</a>
                            <span>•</span>
                            <a href="/register" className="text-blue-600 hover:underline">Register</a>
                            <span>•</span>
                            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
                            <span>•</span>
                            <a href="/upload" className="text-blue-600 hover:underline">Upload</a>
                            <span>•</span>
                            <a href="/api/health" className="text-blue-600 hover:underline" target="_blank">
                                Health API
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
