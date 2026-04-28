import React from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { bmcWardsData, municipalBenchmarks, bmcProcessingSites } from '../data/bmcDatasets';
import { Building2, Info, TrendingDown, Target, MapPin, ExternalLink } from 'lucide-react';

export default function MunicipalInsights() {
    const { entries, profile, getStats } = useWasteStore();
    const stats = getStats(entries);
    
    // Find the current ward via fuzzy/case-insensitive match, fallback to 'S'
    const userWard = (profile.ward || '').toUpperCase().trim();
    const currentWard = bmcWardsData.find(w => w.ward.toUpperCase() === userWard) 
        || bmcWardsData.find(w => w.ward.toUpperCase().startsWith(userWard)) 
        || bmcWardsData.find(w => w.ward === 'S') 
        || bmcWardsData[0];
    
    // Society vs Ward Comparison Data
    const comparisonData = [
        {
            metric: 'Wet Waste %',
            Society: stats.wetPercentage,
            WardAvg: currentWard.wetPercentage,
            MunicipalTarget: 40 // Broad target
        },
        {
            metric: 'Dry Waste %',
            Society: stats.dryPercentage,
            WardAvg: currentWard.dryPercentage,
            MunicipalTarget: 30
        },
        {
            metric: 'Recyclable %',
            Society: stats.recyclablePercentage,
            WardAvg: 15, // BMC average is often lower than 15% for pure recyclables
            MunicipalTarget: 30
        }
    ];

    // Per Capita Comparison (using kg)
    const perCapitaData = [
        { name: 'Society', value: stats.perHousehold / 3.5 }, // Assume 3.5 people per household for daily kg
        { name: 'Ward Avg', value: municipalBenchmarks.avgPerCapitaGeneration },
        { name: 'BMC Target', value: 0.35 }
    ];

    return (
        <Layout 
            title="Municipal Benchmarking" 
            subtitle={`Comparing ${profile.societyName || 'Society'} against BMC ${currentWard.ward} Ward Standards`}
        >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                
                {/* Left: Scorecard Comparison */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Ward-Level Performance Delta</h3>
                                <p className="text-sm text-gray-500">How your society deviates from the BMC {currentWard.ward} Ward benchmark</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{currentWard.ward} Ward ({currentWard.description.split(',')[0]})</span>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                                    <XAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} />
                                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: 12 }}
                                        itemStyle={{ fontSize: 12 }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                                    <Bar dataKey="Society" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="WardAvg" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="MunicipalTarget" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#141f18] border border-white/8 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                                    <Target size={24} />
                                </div>
                                <h4 className="font-bold text-white">Compliance Status</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Source Segregation</span>
                                    <span className="text-green-400 font-bold">EXCEEDS WARD AVG</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.totalRecyclable / stats.totalAll) * 300}%` }}
                                        className="h-full bg-green-500 rounded-full"
                                    />
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed italic">
                                    *BMC Solid Waste Management (SWM) Rules 2016 mandate 100% source segregation for bulk generators (&gt;100kg/day).
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#141f18] border border-white/8 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                                    <TrendingDown size={24} />
                                </div>
                                <h4 className="font-bold text-white">Reduction Opportunities</h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                By optimizing your wet waste processing to match <strong>{currentWard.description}</strong> benchmarks, you could lower your disposal fees by 15%.
                            </p>
                            <button className="text-[10px] items-center gap-1 font-bold text-blue-400 uppercase tracking-widest flex hover:underline">
                                View Vendor Discounts <ExternalLink size={10} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: BMC Ecosystem Data */}
                <div className="space-y-6">
                    <div className="bg-[#1d2921] border border-white/10 rounded-3xl p-6 shadow-xl">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Active Processing Centers</h4>
                        <div className="space-y-4">
                            {bmcProcessingSites.map(site => (
                                <div key={site.name} className="bg-black/20 border border-white/5 rounded-2xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className={site.active ? 'text-green-400' : 'text-gray-600'} />
                                            <span className="text-sm font-bold text-white">{site.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${site.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                            {site.active ? 'OPERATIONAL' : 'CLOSED'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-[10px] text-gray-500 uppercase">Cap: {site.capacityTPD} TPD</span>
                                        <span className="text-[10px] text-gray-400 font-mono">Ward {site.ward}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-6">
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Cross-Ward TPD (Live)</h4>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={bmcWardsData.slice(0, 5)} margin={{ left: -10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="ward" type="category" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15' }}
                                    />
                                    <Bar dataKey="generationTPD" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center mt-4">
                            Data Source: ESR 2023-24 Consolidated Reports
                        </p>
                    </div>
                    
                </div>
            </div>
        </Layout>
    );
}
