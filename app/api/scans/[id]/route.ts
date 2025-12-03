import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch specific scan
        const { data: scan, error: dbError } = await supabase
            .from('scans')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (dbError || !scan) {
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
        }

        return NextResponse.json({ scan })
    } catch (error) {
        console.error('Fetch scan error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
