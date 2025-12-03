'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { Disclaimer } from '@/components/medical/Disclaimer'

export default function UploadPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>('')
    const [isUploading, setIsUploading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setError('')

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file')
            return
        }

        setIsUploading(true)
        setError('')
        setUploadProgress(0)

        try {
            // Upload file
            const formData = new FormData()
            formData.append('file', file)

            setUploadProgress(30)

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const uploadData = await uploadResponse.json()

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Upload failed')
            }

            setUploadProgress(60)
            setIsUploading(false)
            setIsAnalyzing(true)

            // Analyze scan
            const analyzeResponse = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scanUrl: uploadData.url,
                    scanName: uploadData.fileName,
                }),
            })

            const analyzeData = await analyzeResponse.json()

            if (!analyzeResponse.ok) {
                throw new Error(analyzeData.error || 'Analysis failed')
            }

            setUploadProgress(100)

            // Redirect to scan details
            router.push(`/scan/${analyzeData.data.id}`)
        } catch (err: any) {
            setError(err.message)
            setIsUploading(false)
            setIsAnalyzing(false)
            setUploadProgress(0)
        }
    }

    const isProcessing = isUploading || isAnalyzing

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-card sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center">
                            <Logo size="sm" />
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Upload CT Scan
                        </h2>
                        <p className="text-gray-600">
                            Upload your CT scan image for AI-powered analysis
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <Disclaimer />

                    {/* Upload Card */}
                    <Card>
                        <div className="space-y-6">
                            {/* File Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select CT Scan Image
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,.dcm"
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Supported formats: JPEG, PNG, DICOM (.dcm)
                                </p>
                            </div>

                            {/* Preview */}
                            {preview && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Preview
                                    </label>
                                    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={preview}
                                            alt="Scan preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Progress */}
                            {isProcessing && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">
                                            {isUploading ? 'Uploading...' : 'Analyzing with AI...'}
                                        </span>
                                        <span className="text-gray-500">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="medical-gradient h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {isAnalyzing && 'This may take a few moments...'}
                                    </p>
                                </div>
                            )}

                            {/* Upload Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={handleUpload}
                                disabled={!file || isProcessing}
                                isLoading={isProcessing}
                            >
                                {isProcessing
                                    ? isUploading
                                        ? 'Uploading...'
                                        : 'Analyzing...'
                                    : 'Upload & Analyze'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}
