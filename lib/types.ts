export interface Scan {
    id: string
    user_id: string
    scan_url: string
    scan_name: string
    analysis: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    abnormalities: (string | { text: string; coordinates: { x: number; y: number } })[]
    precautions: string[]
    recommendations: string[]
    created_at: string
    updated_at: string
}

export interface User {
    id: string
    email: string
    created_at: string
}

export interface AnalysisResult {
    analysis: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    abnormalities: (string | { text: string; coordinates: { x: number; y: number } })[]
    precautions: string[]
    recommendations: string[]
}
