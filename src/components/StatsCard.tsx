import React from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: string;
    color?: 'green' | 'amber' | 'blue' | 'teal' | 'purple';
    trend?: number;
    description?: string;
}

const colorMap = {
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

export default function StatsCard({ label, value, unit, icon, color = 'green', trend, description }: StatsCardProps) {
    const { bg, text, border } = colorMap[color];
    return (
        <div className={`rounded-2xl border ${border} ${bg} p-5 flex flex-col gap-2`}>
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
                {icon && <span className="text-xl">{icon}</span>}
            </div>
            <div className="flex items-end gap-2 mt-1">
                <span className={`text-3xl font-bold ${text}`}>{value}</span>
                {unit && <span className="text-gray-400 text-sm mb-1">{unit}</span>}
            </div>
            {description && <p className="text-xs text-gray-500 leading-relaxed">{description}</p>}
            {trend !== undefined && (
                <span className={`text-xs font-medium ${trend <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend <= 0 ? '▼' : '▲'} {Math.abs(trend)}% vs last week
                </span>
            )}
        </div>
    );
}
