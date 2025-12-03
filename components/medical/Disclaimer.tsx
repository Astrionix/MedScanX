import React from 'react'

export function Disclaimer() {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl flex-shrink-0">⚠️</span>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                        Medical Disclaimer
                    </h4>
                    <p className="text-sm text-yellow-700">
                        This AI analysis is for informational purposes only and is <strong>not a substitute for professional medical advice</strong>.
                        Always consult with a qualified radiologist or healthcare provider for accurate diagnosis and treatment.
                    </p>
                </div>
            </div>
        </div>
    )
}
