import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Test connection
        const { data, error } = await supabase.from('scans').select('count')

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: 'Database connection failed',
                error: error.message,
                hint: 'Make sure you have run the SQL schema in Supabase SQL Editor'
            }, { status: 500 })
        }

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasApiKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasGeminiKey: !!process.env.GEMINI_API_KEY
        })
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 })
    }
}
