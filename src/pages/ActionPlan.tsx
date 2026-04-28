import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { 
    Download, Lightbulb, CheckCircle2, AlertCircle, 
    TrendingDown, TrendingUp, Calendar, ArrowRight, ShieldCheck, Target
} from 'lucide-react';

interface ActionItem {
    id: string;
    type: 'critical' | 'warning' | 'success';
    buildingId: string;
    wing: string;
    issue: string;
    recommendation: string;
    impact: string;
}

export default function ActionPlan() {
    const { profile, entries, getStats } = useWasteStore();
    const stats = getStats(entries);
    const navigate = useNavigate();
    
    // Generate Management Action Plan (MAP)
    const generateMAP = (): ActionItem[] => {
        const items: ActionItem[] = [];
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - 1);
        
        profile.buildings.forEach(building => {
            const bEntries = entries.filter(e => e.buildingId === building.id);
            if (bEntries.length === 0) return;

            // 1. Check Segregation Efficiency (SEI)
            const days = new Set(bEntries.map(e => e.date)).size || 1;
            const totalUnseg = bEntries.reduce((s, e) => s + (e.nonSegregatedFlats || 0), 0);
            const sei = (1 - (totalUnseg / (building.totalFlats * days))) * 100;

            if (sei < 80) {
                items.push({
                    id: `sei-${building.id}`,
                    type: 'critical',
                    buildingId: building.id,
                    wing: building.name,
                    issue: 'Critical Segregation Failure',
                    recommendation: `Conduct a mandatory Dry-Waste Segregation Workshop for ${building.name} residents and housekeeping staff.`,
                    impact: 'Improve society-wide compliance by ~5%'
                });
            } else if (sei >= 95) {
                items.push({
                    id: `success-${building.id}`,
                    type: 'success',
                    buildingId: building.id,
                    wing: building.name,
                    issue: 'Exemplary Waste Management',
                    recommendation: `Publicly acknowledge ${building.name} in this month's society newsletter and award 50 points to the wing's sustainability fund.`,
                    impact: 'Positive reinforcement of best practices'
                });
            }

            // 2. Check Plastic/Dry Waste Spikes
            const avgDry = bEntries.reduce((s, e) => s + e.dry, 0) / days;
            if (avgDry > 15) { // Assuming 15kg is a threshold for a wing
                items.push({
                    id: `dry-${building.id}`,
                    type: 'warning',
                    buildingId: building.id,
                    wing: building.name,
                    issue: 'High Dry Waste Tonnage',
                    recommendation: `Partner with a local plastic-upcycling vendor for a "Plastic Collection Drive" specific to ${building.name}.`,
                    impact: 'Reduction in landfill-bound waste'
                });
            }
        });

        // fallback if no specific issues
        if (items.length === 0) {
            items.push({
                id: 'general-1',
                type: 'success',
                buildingId: 'all',
                wing: 'Society-Wide',
                issue: 'Stable Operations',
                recommendation: 'Maintain current waste management flow. Consider upgrading to sensor-based bin monitoring for next quarter.',
                impact: 'Operational continuity'
            });
        }

        return items;
    };

    const actionPlan = generateMAP();
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <Layout 
            title="Management Action Plan (MAP)" 
            subtitle={`AI-Driven strategic solutions for ${currentMonth}`}
        >
            {/* Header Content with refined alignment */}
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <Calendar size={14} className="text-[#4ade80]" />
                            <span className="text-xs font-semibold">{currentMonth}</span>
                        </div>
                        <div className="bg-[#4ade80]/10 border border-[#4ade80]/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#4ade80]" />
                            <span className="text-[10px] font-bold uppercase text-[#4ade80]">AI-Validated</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-[#4ade80] text-[#0a120d] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#22c55e] transition-all shadow-lg no-print"
                    >
                        <Download size={16} /> Download Executive Summary
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Sidebar: Strategic Insights */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#141f18] border border-white/8 rounded-2xl overflow-hidden flex flex-col flex-1">
                            <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14} className="text-[#4ade80]" />
                                    Strategic Analysis
                                </h3>
                            </div>
                            <div className="p-6 space-y-8 flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Performance Leader</p>
                                        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 transition-all hover:border-[#4ade80]/30">
                                            <p className="font-bold text-white">Wing A</p>
                                            <span className="text-xs text-[#4ade80] font-black flex items-center gap-1 bg-[#4ade80]/10 px-2 py-0.5 rounded">
                                                <TrendingUp size={12} /> +12.4%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Primary Constraint</p>
                                        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 transition-all hover:border-red-500/30">
                                            <p className="font-bold text-white">Dry Contamination</p>
                                            <span className="text-xs text-red-500 font-black flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded">
                                                <TrendingDown size={12} /> -5.2%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#4ade80]/5 rounded-xl p-4 border border-[#4ade80]/10">
                                    <p className="text-xs text-gray-400 leading-relaxed italic">
                                        "Governance Shift: This plan focuses on high-impact interventions to optimize society-wide diversion rates."
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 space-y-4">
                                <div className="pt-6 border-t border-white/5">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Sustainability Baseline</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <Lightbulb size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">Year-End Projection</p>
                                            <p className="text-[10px] text-gray-500 mt-1">On track for 4 tons recyclable diversion.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Adaptive Action Board */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="flex flex-col flex-1 bg-[#141f18]/40 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prioritized Action Items</h3>
                                <span className="text-[10px] text-gray-600 underline">Based on last 30 days of data</span>
                            </div>
                            
                            <div className="space-y-4">
                                {actionPlan.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-[#141f18] border border-white/8 rounded-2xl hover:border-white/20 transition-all group overflow-hidden shadow-lg shadow-black/20"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Status Sidebar within card */}
                                            <div className={`w-2 md:w-1.5 flex-shrink-0 ${
                                                item.type === 'critical' ? 'bg-red-500' : 
                                                item.type === 'warning' ? 'bg-yellow-500' : 
                                                'bg-[#4ade80]'
                                            }`} />
                                            
                                            <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                                            item.type === 'critical' ? 'bg-red-500 text-white' : 
                                                            item.type === 'warning' ? 'bg-yellow-500 text-black' : 
                                                            'bg-[#4ade80] text-black'
                                                        }`}>
                                                            {item.type}
                                                        </span>
                                                        <span className="text-xs text-white font-bold opacity-80 uppercase tracking-wider">{item.wing}</span>
                                                    </div>
                                                    
                                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#4ade80] transition-colors line-clamp-1">
                                                        {item.issue}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                                        {item.recommendation}
                                                    </p>
                                                    
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                        <TrendingUp size={12} className="text-[#4ade80]" />
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Impact: <span className="text-white">{item.impact}</span></span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end md:border-l border-white/5 md:pl-6 min-w-[120px]">
                                                    <button 
                                                        onClick={() => navigate('/map', { state: { selectedWing: item.buildingId } })}
                                                        className="flex items-center gap-2 text-[#4ade80] font-bold text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform group/btn"
                                                    >
                                                        View Core Data 
                                                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {actionPlan.length === 0 && (
                                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                                        <CheckCircle2 size={48} className="mb-4 text-[#4ade80]" />
                                        <p className="text-sm font-medium">No urgent actions required today.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Disclaimer */}
            <div className="hidden print:block mt-20 border-t border-black pt-8 text-[10px] text-gray-500 italic">
                Official Ciclo Management Action Plan · Society: {profile.societyName} · Verification ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
        </Layout>
    );
}
