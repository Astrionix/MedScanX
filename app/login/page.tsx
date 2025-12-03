'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Logo size="md" />
                    </div>
                    <p className="text-gray-600">
                        AI-Powered CT Scan Analysis Platform
                    </p>
                </div>

                {/* Login Form */}
                <Card>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600">Sign in to your account</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>

                        <p className="text-center text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    )
}
