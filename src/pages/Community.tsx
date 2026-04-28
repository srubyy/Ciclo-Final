import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

// Community averages based on the field survey data
const COMMUNITY_DATA = {
    locations: [
        { name: 'Kalyan', wet: 35.0, dry: 24.0, recyclable: 9.0, perHousehold: 1.36 },
        { name: 'Dombivli', wet: 32.5, dry: 26.0, recyclable: 7.5, perHousehold: 1.32 },
        { name: 'Ghatkopar', wet: 40.0, dry: 19.0, recyclable: 11.0, perHousehold: 1.40 },
        { name: 'Bhandup', wet: 37.5, dry: 22.5, recyclable: 10.0, perHousehold: 1.40 },
        { name: 'Thane', wet: 34.0, dry: 25.0, recyclable: 12.5, perHousehold: 1.43 },
    ],
    communityAvg: { perHousehold: 1.38, wet: 35.8, dry: 23.3, recyclable: 10.0 },
    surveyed: 12,
    awarenessGap: '80%',
    willingToAdapt: '70%',
};

export default function Community() {
    const { entries, getStats, profile } = useWasteStore();
    const stats = getStats(entries);
    const userPerHousehold = stats.perHousehold;
    const communityAvg = COMMUNITY_DATA.communityAvg.perHousehold;
    const diff = userPerHousehold - communityAvg;
    const pctDiff = communityAvg > 0 ? ((diff / communityAvg) * 100).toFixed(1) : '0';

    const radarData = [
        { metric: 'Wet Waste', you: stats.wetPercentage, community: 55 },
        { metric: 'Dry Waste', you: stats.dryPercentage, community: 35 },
        { metric: 'Recyclable', you: stats.recyclablePercentage, community: 15 },
        { metric: 'Segregation', you: stats.recyclablePercentage > 15 ? 75 : 40, community: 55 },
        { metric: 'Reduction', you: diff < 0 ? 80 : 40, community: 50 },
    ];

    return (
        <Layout title="Districts" subtitle="Benchmark your society against other residential complexes in Mumbai">

            {/* Study Context Banner */}
            <div className="bg-[#141f18] border border-[#4ade80]/20 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">🔬</span>
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Field Study Context</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            District data is based on primary research aggregated across <strong className="text-white">multiple residential complexes</strong> in
                            Kalyan, Dombivli, Ghatkopar, Bhandup & Thane (Mumbai Metropolitan Region).
                            <strong className="text-[#4ade80]"> 80%</strong> of societies underestimated their weekly waste footprint by nearly half.
                        </p>
                    </div>
                </div>
            </div>

            {/* Your vs Community */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#141f18] border border-[#4ade80]/20 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Your Society Avg</p>
                    <p className="text-3xl font-bold text-[#4ade80]">{userPerHousehold || '—'}<span className="text-sm font-normal text-gray-400 ml-1">kg/house</span></p>
                    <p className="text-xs text-gray-500 mt-1">Based on {profile.totalHouseholds} households</p>
                </div>
                <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">District Avg</p>
                    <p className="text-3xl font-bold text-white">{communityAvg}<span className="text-sm font-normal text-gray-400 ml-1">kg/house</span></p>
                    <p className="text-xs text-gray-500 mt-1">Mumbai MMR survey average</p>
                </div>
                <div className={`rounded-2xl p-5 border ${diff <= 0 ? 'bg-green-500/8 border-green-500/25' : 'bg-red-500/8 border-red-500/25'}`}>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Your Standing</p>
                    <p className={`text-3xl font-bold ${diff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {diff <= 0 ? '▼' : '▲'} {Math.abs(parseFloat(pctDiff))}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {entries.length === 0 ? 'Log data to compare' : diff <= 0 ? 'Below district average 🎉' : 'Above district average'}
                    </p>
                </div>
            </div>

            {/* Location Benchmarks */}
            <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4">Daily Waste by Location (kg)</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={COMMUNITY_DATA.locations} barSize={14}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                        <Bar dataKey="wet" name="Wet" fill="#2dd4bf" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="dry" name="Dry" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="recyclable" name="Recyclable" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Radar + Key Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {entries.length > 0 && (
                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">You vs. District</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#ffffff10" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <Radar name="You" dataKey="you" stroke="#4ade80" fill="#4ade80" fillOpacity={0.15} strokeWidth={2} />
                                <Radar name="District" dataKey="community" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={1.5} />
                                <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Key Survey Findings</h3>
                    <div className="space-y-3">
                        {[
                            { icon: '⚠️', text: '80% of surveyed societies underestimated weekly waste by ~50%', color: 'border-amber-500/30' },
                            { icon: '🔎', text: 'Dry waste blindspot: many residents categorize soiled plastics as wet waste, messing up bulk tracking', color: 'border-red-500/30' },
                            { icon: '✅', text: '70% of society management willing to use an app for vendor tracking and tips', color: 'border-green-500/30' },
                            { icon: '🧴', text: 'Single-use plastics prevalent across all surveyed locations (Kalyan to Ghatkopar)', color: 'border-blue-500/30' },
                            { icon: '🌿', text: 'Wet waste awareness is highly dependent on vendor pickup schedules', color: 'border-teal-500/30' },
                        ].map(({ icon, text, color }) => (
                            <div key={text} className={`flex items-start gap-3 rounded-xl border ${color} bg-white/3 p-3`}>
                                <span className="text-sm flex-shrink-0">{icon}</span>
                                <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
