
'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'

interface LanguageSelectorProps {
    currentLanguage: string
    onLanguageChange: (lang: string) => void
    isLoading?: boolean
}

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵' },
]

export function LanguageSelector({ currentLanguage, onLanguageChange, isLoading }: LanguageSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Translate to:</span>
            <div className="relative group">
                <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[140px] justify-between border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200"
                    disabled={isLoading}
                >
                    <span className="flex items-center gap-2">
                        <span>{languages.find(l => l.name === currentLanguage)?.flag || '🇺🇸'}</span>
                        {currentLanguage}
                    </span>
                    <span className="text-xs ml-2 opacity-50">▼</span>
                </Button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageChange(lang.name)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-800 transition-colors
                                ${currentLanguage === lang.name ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300'}
                            `}
                        >
                            <span className="text-base">{lang.flag}</span>
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
