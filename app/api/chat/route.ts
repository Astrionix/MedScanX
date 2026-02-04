
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { message, previousMessages, scanContext } = await request.json()

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{
                        text: `You are an expert medical AI assistant. You are analyzing a CT scan with the following findings:
                    
${JSON.stringify(scanContext, null, 2)}

Please answer any follow-up questions about these findings. Be professional, clear, and empathetic. Always remind the user to consult a doctor for definitive medical advice.` }],
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. I am ready to answer questions about this specific CT scan analysis while maintaining appropriate medical boundaries." }],
                },
                ...previousMessages.map((msg: any) => ({
                    role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
                    parts: [{ text: msg.content }],
                })),
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        })

        const result = await chat.sendMessage(message)
        const response = await result.response
        const text = response.text()

        return NextResponse.json({ response: text })
    } catch (error) {
        console.error('Chat error:', error)
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        )
    }
}
