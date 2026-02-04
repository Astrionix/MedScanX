import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2 bg-slate-900/50 border rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500' : 'border-slate-700'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
