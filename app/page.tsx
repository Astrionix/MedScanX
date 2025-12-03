import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                {/* Logo and Title */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-7xl">🏥</span>
                        <h1 className="text-6xl font-bold medical-gradient bg-clip-text text-transparent">
                            MedScanX
                        </h1>
                    </div>
                    <p className="text-2xl text-gray-700 font-medium">
                        AI-Powered CT Scan Analysis Platform
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                    <div className="glass-card p-6 rounded-xl">
                        <div className="text-4xl mb-3">🔬</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Advanced AI Analysis
                        </h3>
                        <p className="text-gray-600">
                            Powered by Gemini 2.5 Pro for accurate medical imaging analysis
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Instant Results
                        </h3>
                        <p className="text-gray-600">
                            Get comprehensive analysis reports in seconds
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Secure & Private
                        </h3>
                        <p className="text-gray-600">
                            Your medical data is encrypted and protected
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/register">
                        <Button variant="primary" size="lg">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg">
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-left max-w-2xl mx-auto">
                    <p className="text-sm text-yellow-800">
                        <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only
                        and is not a substitute for professional medical advice. Always consult with a qualified
                        radiologist or healthcare provider.
                    </p>
                </div>
            </div>
        </div>
    )
}
