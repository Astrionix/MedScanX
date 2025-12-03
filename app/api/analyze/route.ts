import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import type { AnalysisResult } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { scanUrl, scanName } = await request.json()

        if (!scanUrl) {
            return NextResponse.json(
                { error: 'Scan URL is required' },
                { status: 400 }
            )
        }

        // Fetch the image
        const imageResponse = await fetch(scanUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')

        // Initialize Gemini model
        // Using gemini-2.5-pro for best performance in medical image analysis
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

        // Create detailed prompt for CT scan analysis
        const prompt = `You are an expert radiologist AI assistant analyzing a CT scan image. Please provide a comprehensive analysis following this exact JSON structure:

{
  "analysis": "Detailed analysis of the CT scan findings (2-3 paragraphs)",
  "severity": "low|medium|high|critical",
  "abnormalities": ["List of specific abnormalities detected"],
  "precautions": ["List of precautions the patient should take"],
  "recommendations": ["List of medical recommendations and next steps"]
}

Guidelines:
- Provide a thorough, professional analysis
- Severity levels: low (normal/minor), medium (requires monitoring), high (needs attention), critical (urgent care needed)
- List 3-5 specific abnormalities if any are detected
- Provide 3-5 practical precautions
- Give 3-5 actionable medical recommendations
- Be precise and use medical terminology where appropriate
- If the image is not a CT scan, indicate that in the analysis

Return ONLY the JSON object, no additional text.`

        // Generate analysis
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                },
            },
            { text: prompt },
        ])

        const response = await result.response
        const text = response.text()

        // Parse the JSON response
        let analysisResult: AnalysisResult
        try {
            // Remove markdown code blocks if present
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            analysisResult = JSON.parse(cleanedText)
        } catch (parseError) {
            console.error('Failed to parse AI response:', text)
            // Fallback response
            analysisResult = {
                analysis: text,
                severity: 'medium',
                abnormalities: ['Unable to parse detailed findings'],
                precautions: ['Consult with a radiologist for proper interpretation'],
                recommendations: ['Get a professional medical evaluation'],
            }
        }

        // Save to database
        const { data: scanData, error: dbError } = await supabase
            .from('scans')
            .insert({
                user_id: user.id,
                scan_url: scanUrl,
                scan_name: scanName || 'CT Scan',
                analysis: analysisResult.analysis,
                severity: analysisResult.severity,
                abnormalities: analysisResult.abnormalities,
                precautions: analysisResult.precautions,
                recommendations: analysisResult.recommendations,
            })
            .select()
            .single()

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json(
                { error: 'Failed to save analysis' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'Analysis completed successfully',
            data: scanData,
        })
    } catch (error) {
        console.error('Analysis error:', error)
        return NextResponse.json(
            {
                error: 'Failed to analyze scan',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
