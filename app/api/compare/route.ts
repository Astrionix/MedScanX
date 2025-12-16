
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { scanId1, scanId2 } = await request.json()

        if (!scanId1 || !scanId2) {
            return NextResponse.json({ error: 'Two scans are required' }, { status: 400 })
        }

        // Fetch both scans
        const { data: scans, error } = await supabase
            .from('scans')
            .select('*')
            .in('id', [scanId1, scanId2])
            .eq('user_id', user.id)

        if (error || !scans || scans.length !== 2) {
            return NextResponse.json({ error: 'Scans not found' }, { status: 404 })
        }

        // Sort by date to ensure chronological order (Scan A = Older, Scan B = Newer)
        const sortedScans = scans.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        const [oldScan, newScan] = sortedScans

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

        const prompt = `Act as an expert radiologist performing a longitudinal analysis. Compare these two medical scans from the same patient.

        SCAN A (Oder - ${oldScan.created_at}):
        Analysis: ${oldScan.analysis}
        Abnormalities: ${JSON.stringify(oldScan.abnormalities)}

        SCAN B (Newer - ${newScan.created_at}):
        Analysis: ${newScan.analysis}
        Abnormalities: ${JSON.stringify(newScan.abnormalities)}

        Provide a "Chrono-Compare" Report in JSON format:
        {
            "summary": "2-3 sentences summarizing the overall progression (improved/worsened/stable).",
            "changes": [
                 {
                    "type": "improvement" | "deterioration" | "new_finding" | "stable",
                    "description": "Specific change description (e.g., 'Lung nodule size reduced by approx 2mm')"
                 }
            ],
            "key_differences": ["List of distinctive differences"],
            "recommendation": "One key recommendation based on the change."
        }
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        return NextResponse.json(JSON.parse(cleanedText))

    } catch (error) {
        console.error('Comparison error:', error)
        return NextResponse.json({ error: 'Comparison failed' }, { status: 500 })
    }
}
