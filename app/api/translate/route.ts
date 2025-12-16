
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
    try {
        const { text, targetLanguage, context } = await request.json()

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

        const prompt = `You are an expert medical translator. Translate the following medical report content into ${targetLanguage}.
        
        Content to translate:
        ${JSON.stringify(text)}
        
        Context (Analysis type): ${context || 'General Medical Report'}

        Rules:
        1. Maintain medical accuracy.
        2. Use professional medical terminology in the target language.
        3. Return ONLY the translated JSON structure, matching the input keys.
        4. Do not translate proper nouns or medication names if they are standard globally, unless there is a specific local equivalent.
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const translatedText = response.text()

        // Clean up markdown if present
        const cleanedText = translatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        return NextResponse.json(JSON.parse(cleanedText))
    } catch (error) {
        console.error('Translation error:', error)
        return NextResponse.json(
            { error: 'Failed to translate' },
            { status: 500 }
        )
    }
}
