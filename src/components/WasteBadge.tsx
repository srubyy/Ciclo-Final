import React from 'react';

interface WasteBadgeProps {
    type: 'wet' | 'dry' | 'recyclable';
    value: number;
    showLabel?: boolean;
}

const config = {
    wet: { label: 'Wet', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', dot: 'bg-teal-400' },
    dry: { label: 'Dry', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    recyclable: { label: 'Recyclable', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
};

export default function WasteBadge({ type, value, showLabel = true }: WasteBadgeProps) {
    const { label, color, dot } = config[type];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {showLabel && <span>{label}</span>}
            <span className="font-semibold">{value} kg</span>
        </span>
    );
}
