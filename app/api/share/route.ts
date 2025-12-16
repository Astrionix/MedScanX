
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Secret for signing share tokens. In production, use a proper env var.
const SHARE_SECRET = new TextEncoder().encode(
    process.env.SHARE_SECRET_KEY || 'medscanx-temporary-share-secret-key-2025'
)

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { scanId } = await request.json()

        // Verify ownership
        const { data: scan } = await supabase
            .from('scans')
            .select('id')
            .eq('id', scanId)
            .eq('user_id', user.id)
            .single()

        if (!scan) {
            return NextResponse.json({ error: 'Scan not found or unauthorized' }, { status: 404 })
        }

        // Create signed token valid for 72 hours
        const token = await new SignJWT({ scanId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('72h')
            .sign(SHARE_SECRET)

        // Generate full URL
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
        const host = request.headers.get('host')
        const shareUrl = `${protocol}://${host}/share/${token}`

        return NextResponse.json({ shareUrl, expiresAt: Date.now() + 72 * 60 * 60 * 1000 })
    } catch (error) {
        console.error('Share generation error:', error)
        return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 })
    }
}
