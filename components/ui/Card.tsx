import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div
            className={`glass-card rounded-xl p-6 ${hover ? 'glass-card-hover' : ''
                } ${className}`}
        >
            {children}
        </div>
    )
}
