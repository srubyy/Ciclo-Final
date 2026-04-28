import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import Layout from '../layouts/Layout';
import StatsCard from '../components/StatsCard';
import WasteBadge from '../components/WasteBadge';
import { useWasteStore } from '../store/useWasteStore';
import { Trash2, PlusCircle, Building2, ChevronDown } from 'lucide-react';

const COLORS = { wet: '#2dd4bf', dry: '#f59e0b', recyclable: '#60a5fa' };

import { wards, societiesByWard } from '../data/demoData';

export default function Dashboard() {
    const { entries, profile, getStats, getWeeklyData, getMonthlyData, removeEntry, seedDemoData, updateProfile } = useWasteStore();
    const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [selectedWard, setSelectedWard] = useState<string>(profile.ward || 'S');
    
    const stats = getStats(entries);
    const weeklyData = getWeeklyData();
    const monthlyData = getMonthlyData();
    const chartData = view === 'weekly' ? weeklyData : monthlyData;
    const xKey = view === 'weekly' ? 'date' : 'month';
    const recentEntries = entries.slice(0, 5);

    const handleSocietySwitch = (societyName: string) => {
        seedDemoData(societyName, selectedWard);
        setIsDemoOpen(false);
    };

    const pieData = [
        { name: 'Wet', value: stats.totalWet, color: COLORS.wet },
        { name: 'Dry', value: stats.totalDry, color: COLORS.dry },
        { name: 'Recyclable', value: stats.totalRecyclable, color: COLORS.recyclable },
    ].filter((d) => d.value > 0);

    if (entries.length === 0) {
        return (
            <Layout title="Admin Dashboard" subtitle="Society waste administration hub">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="text-6xl mb-6">🗑️</span>
                    <h2 className="text-xl font-bold text-white mb-2">No data yet</h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs">Start logging your society waste to see analytics and trends here.</p>
                    <div className="flex gap-4">
                        <Link to="/log">
                            <motion.button whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-[#4ade80] text-[#0a120d] px-5 py-3 rounded-xl font-bold text-sm">
                                <PlusCircle size={16} /> Log Waste
                            </motion.button>
                        </Link>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => seedDemoData()}
                            className="flex items-center gap-2 bg-white/8 text-white border border-white/15 px-5 py-3 rounded-xl font-medium text-sm"
                        >
                            Load Demo Data
                        </motion.button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Admin Dashboard" subtitle={`${profile.societyName || 'Your society'} · Integrated Analytics Overview`}>
            {/* Quick Actions & Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex gap-2">
                    {(['weekly', 'monthly'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                view === v ? 'bg-[#4ade80] text-[#0a120d]' : 'bg-white/8 text-gray-400 hover:text-white'
                            }`}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)} View
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setIsDemoOpen(!isDemoOpen)}
                        className="flex items-center gap-3 bg-[#141f18] border border-white/10 px-4 py-2.5 rounded-xl hover:border-[#4ade80]/50 transition-all group"
                    >
                        <div className="p-1.5 bg-[#4ade80]/10 rounded-lg text-[#4ade80]">
                            <Building2 size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{profile.ward} Ward Official</p>
                            <p className="text-sm font-bold text-white flex items-center gap-2">
                                {profile.societyName || 'Select Society'} 
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isDemoOpen ? 'rotate-180' : ''}`} />
                            </p>
                        </div>
                    </button>

                    <AnimatePresence>
                        {isDemoOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-72 bg-[#141f18] border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
                            >
                                <div className="mb-4">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">1. Select Ward</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {wards.map(w => (
                                            <button
                                                key={w}
                                                onClick={() => setSelectedWard(w)}
                                                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                                    selectedWard === w 
                                                        ? 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]' 
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {w}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 mb-4" />

                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">2. Select Society</label>
                                    <div className="space-y-1">
                                        {societiesByWard[selectedWard].map(soc => (
                                            <button
                                                key={soc}
                                                onClick={() => handleSocietySwitch(soc)}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                                                    profile.societyName === soc 
                                                        ? 'bg-[#4ade80]/10 text-[#4ade80] font-bold' 
                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {soc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatsCard label="Total Waste" value={stats.totalAll} unit="kg" icon="⚖️" color="green" />
                <StatsCard label="Daily Avg" value={stats.avgDaily} unit="kg/day" icon="📅" color="teal" />
                <StatsCard label="Per Household" value={stats.perHousehold} unit="kg/house" icon="🏠" color="blue" />
                <StatsCard label="Entries" value={entries.length} unit="deposits" icon="📋" color="purple" />
            </div>

            {/* Main Area Trend Chart */}
            <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4">Master Generation Trend (kg)</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="wetGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.wet} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.wet} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="dryGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.dry} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.dry} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.recyclable} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.recyclable} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                        <XAxis dataKey={xKey} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: 8, color: '#fff' }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                        <Area type="monotone" dataKey="wet" name="Wet" stroke={COLORS.wet} fill="url(#wetGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="dry" name="Dry" stroke={COLORS.dry} fill="url(#dryGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="recyclable" name="Recyclable" stroke={COLORS.recyclable} fill="url(#recGrad)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Split Charts & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                
                {/* Composition Breakdown */}
                <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5">
                     <h3 className="text-sm font-semibold text-white mb-4">Overall Lifetime Composition</h3>
                     <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                                {pieData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => [`${v} kg`]} contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: 8, color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { label: 'Wet', pct: stats.wetPercentage, color: 'bg-teal-400', bg: 'bg-teal-500/10' },
                            { label: 'Dry', pct: stats.dryPercentage, color: 'bg-amber-400', bg: 'bg-amber-500/10' },
                            { label: 'Recyclable', pct: stats.recyclablePercentage, color: 'bg-blue-400', bg: 'bg-blue-500/10' },
                        ].map(({ label, pct, color, bg }) => (
                            <div key={label} className={`rounded-xl border border-white/5 ${bg} p-3 text-center`}>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
                                <p className="text-lg font-bold text-white">{pct}%</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sustainability Impact Section to fill space */}
                    <div className="mt-6 pt-5 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="text-sm">🌱</span> Environmental Impact
                            </h4>
                            <span className="text-[10px] text-[#4ade80] font-bold bg-[#4ade80]/10 px-2 py-0.5 rounded-full">LIVE ESTIMATE</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-400">Carbon Offset</span>
                                    <span className="text-white font-medium">{(stats.totalRecyclable * 1.5).toFixed(1)} kg CO₂ eq</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '65%' }}
                                        className="h-full bg-gradient-to-r from-teal-500 to-[#4ade80] rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-lg bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm">📉</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Efficiency Insight</p>
                                        <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                                            By recycling <span className="text-blue-400 font-bold">{stats.totalRecyclable}kg</span>, you've saved approximately <span className="text-[#4ade80] font-bold">{Math.floor(stats.totalRecyclable * 2.1)}</span> trees' worth of annual aeration. 
                                            Diverting more wet waste to composting could increase your score by 12%.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Logs Quickview */}
                <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Recent Admin Logs</h3>
                        <Link to="/log" className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[#4ade80] text-xs hover:bg-white/10 transition-colors">
                            + Add New Log
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {recentEntries.map((entry) => (
                            <div key={entry.id} className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-white font-medium">{entry.date}</p>
                                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                            {profile.buildings.find(b => b.id === entry.buildingId)?.name || 'Society'}
                                        </span>
                                    </div>
                                    {entry.nonSegregatedFlats ? (
                                        <p className="text-[10px] text-red-400 mt-0.5 font-bold">⚠️ {entry.nonSegregatedFlats} unsegregated units</p>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                    <WasteBadge type="wet" value={entry.wet} showLabel={false} />
                                    <WasteBadge type="dry" value={entry.dry} showLabel={false} />
                                    <WasteBadge type="recyclable" value={entry.recyclable} showLabel={false} />
                                    <button
                                        onClick={() => removeEntry(entry.id)}
                                        className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {recentEntries.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-6">No recent entries to display.</p>
                        )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 text-center">
                        <Link to="/log" className="text-xs text-gray-400 hover:text-white transition-colors">View All Logs</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
