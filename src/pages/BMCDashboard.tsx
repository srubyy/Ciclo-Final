import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, LineChart, Line, ComposedChart
} from 'recharts';
import Layout from '../layouts/Layout';
import { 
    Building2, Truck, TrendingDown, ShieldAlert, 
    Zap, AlertTriangle, FileText, Map as MapIcon, 
    ArrowUpRight, ArrowDownRight, ChevronDown, Gavel, Scale, DollarSign,
    Search, ShieldCheck, X
} from 'lucide-react';
import { wards, societiesByWard, wardMetadata } from '../data/demoData';

// Mock Predictive Data
const projections = [
    { day: 'Mon', actual: 42, projected: 41 },
    { day: 'Tue', actual: 44, projected: 43 },
    { day: 'Wed', actual: 41, projected: 42 },
    { day: 'Thu', actual: 45, projected: 44 },
    { day: 'Fri', projected: 48 },
    { day: 'Sat', projected: 52 },
    { day: 'Sun', projected: 49 },
];

export default function BMCDashboard() {
    const [selectedWard, setSelectedWard] = useState('S');
    const [isWardMenuOpen, setIsWardMenuOpen] = useState(false);
    const [activeQueue, setActiveQueue] = useState([
        { id: 1, name: societiesByWard['S'][0] || 'Unknown Society', reason: 'Contaminated Wet Stream', tons: '1.2T', risk: 'High' },
        { id: 2, name: societiesByWard['S'][1] || 'Unknown Society', reason: 'Recurring No-Segregation', tons: '0.8T', risk: 'Medium' },
        { id: 3, name: societiesByWard['S'][2] || 'Unknown Society', reason: 'Composter Overflow', tons: '0.5T', risk: 'Low' },
        { id: 4, name: 'Liberty Garden', reason: 'Unregistered Vendor Dumping', tons: '2.1T', risk: 'Critical' }
    ]);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const meta = wardMetadata[selectedWard];

    const handleAction = (id: number, type: 'inspect' | 'fine') => {
        const society = activeQueue.find(q => q.id === id);
        if (!society) return;

        setActionMessage(type === 'fine' 
            ? `SUCCESS: Legal fine of ₹5,000 issued to ${society.name}. Notice dispatched via Email/SMS.`
            : `CONFIRMED: Field inspection for ${society.name} scheduled for tomorrow, 10:00 AM.`
        );

        setTimeout(() => {
            setActiveQueue(prev => prev.filter(q => q.id !== id));
            setActionMessage(null);
        }, 3500);
    };

    // Authority-specific calculations
    const processingCost = meta.tonnage * 1200; // ₹1200 per ton
    const mixedWastePenalty = (meta.tonnage * (1 - (meta.complianceRate / 100)) * 800).toFixed(0);
    const trucksNeeded = Math.ceil(meta.tonnage / 5); // 5 tons per truck

    return (
        <Layout 
            title="BMC Ward Command Center" 
            subtitle={`Authority Oversight & Resource Planning · ${selectedWard} Ward`}
        >
            {/* Authority Action Notification */}
            <AnimatePresence>
                {actionMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
                    >
                        <div className="bg-blue-600 border border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.4)] px-6 py-4 rounded-2xl flex items-center gap-4 text-white">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <p className="font-bold text-sm leading-tight">{actionMessage}</p>
                            <button onClick={() => setActionMessage(null)} className="ml-auto p-1 hover:bg-white/10 rounded-lg">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header: Authority Context */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 bg-[#141f18] border border-white/8 p-6 rounded-[32px]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Gavel size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Jurisdictional Command</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Live Authority Stream</p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setIsWardMenuOpen(!isWardMenuOpen)}
                        className="flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-4 rounded-2xl hover:border-blue-500/50 transition-all group"
                    >
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Assigned Ward</p>
                            <p className="text-xl font-black text-white flex items-center gap-3">
                                {selectedWard} Ward <ChevronDown size={18} className={`transition-transform ${isWardMenuOpen ? 'rotate-180' : ''}`} />
                            </p>
                        </div>
                    </button>
                    {/* Dropdown same as before */}
                    <AnimatePresence>
                        {isWardMenuOpen && (
                            <motion.div className="absolute right-0 top-full mt-3 w-64 bg-[#141f18] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                                <div className="grid grid-cols-2 gap-2">
                                    {wards.map(w => (
                                        <button key={w} onClick={() => { setSelectedWard(w); setIsWardMenuOpen(false); }} className={`py-3 rounded-xl text-xs font-bold transition-all border ${selectedWard === w ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{w} Ward</button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#141f18] border border-white/8 p-6 rounded-[32px]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Truck size={24} /></div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Logistics</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{trucksNeeded}</h3>
                    <p className="text-xs font-bold text-gray-400">Compactors Needed</p>
                    <p className="text-[10px] text-gray-600 mt-2">Based on {meta.tonnage} TPD load</p>
                </div>

                <div className="bg-[#141f18] border border-white/8 p-6 rounded-[32px]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-400"><DollarSign size={24} /></div>
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Financials</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">₹{mixedWastePenalty}</h3>
                    <p className="text-xs font-bold text-gray-400">Inefficiency Cost/Day</p>
                    <p className="text-[10px] text-gray-600 mt-2">Landfill tipping fee loss</p>
                </div>

                <div className="bg-[#141f18] border border-white/8 p-6 rounded-[32px]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><ShieldAlert size={24} /></div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Compliance</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{meta.complianceRate}%</h3>
                    <p className="text-xs font-bold text-gray-400">Ward Segregation Index</p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3"><div className="h-full bg-amber-500 rounded-full" style={{width: `${meta.complianceRate}%`}} /></div>
                </div>

                <div className="bg-[#141f18] border border-white/8 p-6 rounded-[32px]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Zap size={24} /></div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Energy Potential</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">4.2 MW</h3>
                    <p className="text-xs font-bold text-gray-400">Biogas Yield Potential</p>
                    <p className="text-[10px] text-gray-600 mt-2">From {Math.floor(meta.tonnage * 0.6)}T Wet Waste</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* Authority Insight 1: Waste Projection & Planning */}
                <div className="xl:col-span-2 bg-[#141f18] border border-white/8 rounded-[32px] p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Resource Projection (7-Day Forecast)</h3>
                            <p className="text-sm text-gray-500">AI-driven tonnage forecasting for collection planning</p>
                        </div>
                        <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Forecast Confidence</p>
                            <p className="text-sm font-bold text-white">94.2%</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={projections}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: '16px' }} />
                                <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Recorded Tonnage" />
                                <Line type="monotone" dataKey="projected" stroke="#fbbf24" strokeWidth={3} dot={{r: 4}} name="AI Forecast" strokeDasharray="5 5" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Authority Insight 2: Ward Performance Leaderboard */}
                <div className="bg-[#141f18] border border-white/8 rounded-[32px] p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Society Rankings</h3>
                    <div className="space-y-4 flex-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Top Performers (Incentivize)</p>
                        {societiesByWard[selectedWard].slice(0, 2).map((s, i) => (
                            <div key={s} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-xs font-black text-green-400">#{i+1}</div>
                                    <span className="text-sm font-bold text-white">{s}</span>
                                </div>
                                <span className="text-xs font-mono text-green-400">96.4%</span>
                            </div>
                        ))}
                        
                        <div className="h-px bg-white/5 my-4" />

                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Critical Bottom (Audit Required)</p>
                        {societiesByWard[selectedWard].slice(-2).map((s, i) => (
                            <div key={s} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-xs font-black text-red-400">#42</div>
                                    <span className="text-sm font-bold text-white">{s}</span>
                                </div>
                                <span className="text-xs font-mono text-red-400">41.2%</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <FileText size={18} /> Generate Ward Audit
                    </button>
                </div>
            </div>

            {/* Authority Insight 3: Enforcement Dispatch Queue */}
            <div className="bg-[#141f18] border border-white/8 rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            Enforcement Dispatch Queue 
                            {activeQueue.length > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-[10px] rounded-full">
                                    {activeQueue.length} Pending
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Societies flagged for 3+ days of critical non-compliance</p>
                    </div>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all">
                        Approve All Notices
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/20 text-gray-500 text-[10px] uppercase tracking-widest">
                                <th className="px-8 py-5 font-bold">Society Entity</th>
                                <th className="px-8 py-5 font-bold">Violation Reason</th>
                                <th className="px-8 py-5 font-bold text-center">Mixed Waste Tonnage</th>
                                <th className="px-8 py-5 font-bold text-right">Action Authority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeQueue.map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-white block">{row.name}</span>
                                        <span className="text-[10px] text-gray-500">Notice ID: BMC-2024-{row.id + 100}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} className="text-amber-500" />
                                            <span className="text-sm text-gray-300">{row.reason}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-mono text-red-400">{row.tons}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleAction(row.id, 'inspect')}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white border border-white/5 transition-all"
                                            >
                                                Inspect
                                            </button>
                                            <button 
                                                onClick={() => handleAction(row.id, 'fine')}
                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-[10px] font-bold text-red-400 border border-red-500/20 transition-all"
                                            >
                                                Issue Fine
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
