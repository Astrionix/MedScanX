import React from 'react'

interface SeverityBadgeProps {
    severity: 'low' | 'medium' | 'high' | 'critical'
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
    const severityConfig = {
        low: {
            label: 'Low Risk',
            className: 'severity-low',
            icon: '✓',
        },
        medium: {
            label: 'Medium Risk',
            className: 'severity-medium',
            icon: '⚠',
        },
        high: {
            label: 'High Risk',
            className: 'severity-high',
            icon: '⚠',
        },
        critical: {
            label: 'Critical',
            className: 'severity-critical',
            icon: '⚠',
        },
    }

    const config = severityConfig[severity]

    return (
        <span
            className={`severity-badge inline-flex items-center gap-1.5 ${config.className}`}
        >
            <span>{config.icon}</span>
            {config.label}
        </span>
    )
}
