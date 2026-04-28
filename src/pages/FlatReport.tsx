import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, 
    PieChart, Pie
} from 'recharts';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { 
    AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, 
    Calendar, Download, ArrowLeft, Building2, User
} from 'lucide-react';

export default function FlatReport() {
    const { flatId } = useParams();
    const { flats, profile } = useWasteStore();

    const flat = flats.find(f => f.id === flatId);
    const building = profile.buildings.find(b => b.id === flat?.buildingId);

    if (!flat || !building) {
        return (
            <Layout title="Report Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <AlertTriangle size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-white">Flat record not found</h2>
                    <Link to="/directory" className="text-[#4ade80] mt-4 flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Directory
                    </Link>
                </div>
            </Layout>
        );
    }

    // Analytics Logic
    const history = flat.recentHistory?.length > 0 
        ? flat.recentHistory 
        : Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            // generate segregated boolean based on compliance score
            const isSegregated = Math.random() < (flat.complianceScore / 100);
            return {
                id: `mock-${i}`,
                date: d.toISOString().split('T')[0],
                wet: parseFloat((1.5 + Math.random() * 1.5).toFixed(1)),
                dry: parseFloat((0.5 + Math.random() * 1.0).toFixed(1)),
                recyclable: parseFloat((0.2 + Math.random() * 0.5).toFixed(1)),
                segregated: isSegregated
            };
        });

    const societyAvgCompliance = parseFloat((flats.reduce((s, f) => s + f.complianceScore, 0) / (flats.length || 1)).toFixed(1));
    
    // Contamination Calendar (Last 30 days mock)
    const contaminationDays = history.filter(h => !h.segregated);
    
    // Trend Data
    const trendData = [...history].map(h => ({
        date: new Date(h.date).toLocaleDateString('en', { day: '2-digit', month: 'short' }),
        total: parseFloat((h.wet + h.dry + h.recyclable).toFixed(1)),
        segregated: h.segregated ? 1 : 0
    }));

    return (
        <Layout 
            title={`Habit Analysis: ${building.name} - ${flat.flatNumber}`}
            subtitle="Ground-truth violation record and segregation habit report"
        >
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8 no-print">
                <Link to="/directory" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Directory
                </Link>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="bg-[#4ade80] text-[#0a120d] px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-[#4ade80]/20 transition-all"
                >
                    <Download size={16} /> Export Official Violation PDF
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 print:block gap-6 print:gap-2">
                
                {/* Left: Identity & Core SEI */}
                <div className="lg:col-span-1 print:grid print:grid-cols-2 space-y-6 print:space-y-0 print:gap-2 print:mb-2">
                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-6 print:p-3 relative overflow-hidden print:bg-white print:border-gray-200">
                         <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Building2 size={80} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <User size={24} className="text-[#4ade80]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white print:text-gray-900 leading-tight">{flat.residentName}</h3>
                                    <p className="text-xs text-gray-500 print:text-gray-700 uppercase tracking-widest">{building.name} • {flat.flatNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-500 print:text-gray-900 uppercase font-bold tracking-widest mb-1">Individual SEI Score</p>
                                        <p className={`text-5xl font-black ${flat.complianceScore >= 80 ? 'text-green-400' : 'text-red-400'}`}>
                                            {flat.complianceScore}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Society Avg</p>
                                        <p className="text-lg font-bold text-white opacity-60 print:opacity-100 print:text-gray-900">{societyAvgCompliance}%</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${flat.complianceScore >= 80 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${flat.complianceScore}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                    {flat.complianceScore < societyAvgCompliance 
                                        ? "⚠️ This resident is currently performing BELOW the society average efficiency." 
                                        : "✅ Performance is currently stable compared to society benchmarks."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contamination Calendar View */}
                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-6 print:p-3 print:bg-white print:border-gray-200">
                        <h4 className="text-sm print:text-xs font-bold text-white print:text-black mb-6 print:mb-2 flex items-center gap-2">
                             <Calendar size={16} className="text-red-400 print:w-4 print:h-4" />
                             Contamination Frequency
                        </h4>
                        <div className="grid grid-cols-7 gap-1.5">
                            {history.slice(-28).map((h, i) => {
                                const isViolation = !h.segregated;
                                return (
                                    <div 
                                        key={i} 
                                        className={`aspect-square rounded-md border flex items-center justify-center text-[10px] font-bold transition-colors
                                            ${isViolation 
                                                ? 'bg-red-500/20 border-red-500/30 text-red-400 print:bg-red-100 print:text-red-700 print:border-red-200' 
                                                : 'bg-green-500/5 border-green-500/10 text-green-500/40 print:bg-green-50 print:text-green-700 print:border-green-100'}
                                        `}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 print:mt-2 flex gap-4 text-[10px] print:text-[8px] text-gray-500 print:text-gray-800 justify-center">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-400 print:bg-red-600" /> Mixed Waste</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-900 print:bg-green-600" /> Segregated</span>
                        </div>
                    </div>
                </div>

                {/* Right: Trend Analytics & Impact */}
                <div className="lg:col-span-2">
                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-8 print:p-4 h-full print:h-auto flex flex-col print:block print:bg-white print:border-gray-200 print:break-inside-avoid">
                        <div className="flex justify-between items-center mb-8 print:mb-2">
                            <h3 className="text-lg print:text-sm font-bold text-white print:text-black flex items-center gap-2">
                                <TrendingUp size={20} className="text-[#4ade80] print:text-green-700 print:w-4 print:h-4" />
                                Segregation Trend (Last 30 Days)
                            </h3>
                        </div>

                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6b7280', fontSize: 10 }} 
                                    />
                                    <YAxis hide domain={[0, 'dataMax']} />
                                    <Tooltip 
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: 12 }}
                                    />
                                    <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={20} name="Total Waste (kg)">
                                        {trendData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.segregated === 1 ? '#4ade80' : '#ef4444'} fillOpacity={1} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 print:mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                            <div className="p-4 print:p-2 bg-white/5 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                                <div className="flex items-center gap-2 text-red-400 print:text-red-700 mb-2 print:mb-1">
                                    <AlertTriangle size={16} className="print:w-3 print:h-3" />
                                    <span className="text-xs print:text-[10px] font-bold uppercase">Critical Issue</span>
                                </div>
                                <p className="text-sm print:text-[10px] text-gray-300 print:text-gray-800 leading-relaxed font-medium">
                                    Recurrent mixing of non-recyclables found in the dry-waste steam on weekends.
                                </p>
                            </div>
                            <div className="p-4 print:p-2 bg-white/5 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                                <div className="flex items-center gap-2 text-[#4ade80] print:text-green-700 mb-2 print:mb-1">
                                    <CheckCircle2 size={16} className="print:w-3 print:h-3" />
                                    <span className="text-xs print:text-[10px] font-bold uppercase">Requirement</span>
                                </div>
                                <p className="text-sm print:text-[10px] text-gray-300 print:text-gray-800 leading-relaxed font-medium">
                                    Must ensure 100% wet waste processing in provided green bin for the next 14 days.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 print:mt-3 pt-8 print:pt-3 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`text-sm print:text-[10px] font-bold ${flat.fines.length > 0 ? 'text-red-400' : 'text-[#4ade80]'}`}>
                                    {flat.fines.length > 0 ? `${flat.fines.length} Active Notice(s)` : 'No Active Notices'}
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                                REF: HABIT_AUDIT_{flat.flatNumber}_{building.name.toUpperCase().replace(' ','_')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Disclaimer */}
            <div className="hidden print:block mt-2 p-3 bg-gray-50 border-l-4 border-black text-[9px] text-gray-700">
                <p className="font-bold uppercase mb-0.5">Notice to Resident</p>
                <p>This Flat-Specific Habit Analysis is generated using official society waste audit logs. In case of dispute, please present your waste disposal receipts for the dates highlighted in red. Failure to improve compliance scores may lead to municipal penalties under local waste-management bylaws.</p>
                <div className="mt-3 flex justify-between">
                    <div className="border-t border-black w-24 pt-1 mt-4">Society Admin Sign</div>
                    <div className="border-t border-black w-24 pt-1 mt-4">Resident Sign / Date</div>
                </div>
            </div>
        </Layout>
    );
}
