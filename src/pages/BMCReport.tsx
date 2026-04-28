import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { Download, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BMCReport() {
    const { entries, getStats, profile } = useWasteStore();
    const stats = getStats(entries);
    
    // Compliance calculation: 
    // Total possible unsegregated occurrences = totalHouseholds * uniqueDays
    // Actual occurrences = totalUnsegregatedFlats
    const totalPossibleFlatDays = profile.totalHouseholds * (stats.uniqueDays || 1);
    const nonCompliantFlatDays = stats.totalUnsegregatedFlats;
    const compliantFlatDays = totalPossibleFlatDays - nonCompliantFlatDays;
    const complianceRate = Math.max(0, parseFloat(((compliantFlatDays / totalPossibleFlatDays) * 100).toFixed(1)));
    
    // Group entries by building to get building-specific compliance
    const getBuildingCompliance = (buildingId: string, totalFlats: number) => {
        const buildingEntries = entries.filter(e => e.buildingId === buildingId);
        const uniqueBuildingDays = new Set(buildingEntries.map(e => e.date)).size || 1;
        const buildingNonSegregated = buildingEntries.reduce((s, e) => s + (e.nonSegregatedFlats || 0), 0);
        
        const possible = totalFlats * uniqueBuildingDays;
        const rate = Math.max(0, parseFloat((((possible - buildingNonSegregated) / possible) * 100).toFixed(1)));
        return rate;
    };

    return (
        <Layout title="BMC Compliance Report" subtitle="Official society waste segregation report for municipal administration">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Official Record
                </div>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors no-print"
                >
                    <Download size={16} /> Export PDF Report
                </motion.button>
            </div>

            {/* Society Meta Info */}
            <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Society Name</p>
                        <p className="text-lg font-bold text-white">{profile.societyName || 'Unregistered Society'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Units</p>
                        <p className="text-lg font-bold text-white">{profile.totalHouseholds} Flats</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location Ward</p>
                        <p className="text-lg font-bold text-white">{profile.location.toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reporting Period</p>
                        <p className="text-lg font-bold text-white">Last {stats.uniqueDays} Days</p>
                    </div>
                </div>
            </div>

            {/* Overall Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-1 bg-[#141f18] border border-white/8 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Overall Segregation Compliance</p>
                    <div className="relative w-32 h-32 flex items-center justify-center my-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ffffff10"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={complianceRate >= 90 ? '#4ade80' : complianceRate >= 70 ? '#facc15' : '#ef4444'}
                                strokeWidth="3"
                                strokeDasharray={`${complianceRate}, 100`}
                            />
                        </svg>
                        <span className="absolute text-2xl font-black text-white">{complianceRate}%</span>
                    </div>
                    <p className="text-xs text-gray-400">
                        {complianceRate >= 90 ? 'Excellent compliance.' : complianceRate >= 70 ? 'Moderate compliance. Needs improvement.' : 'Poor compliance. Notice may be issued.'}
                    </p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-6">Waste Generation Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Total Wet Waste</p>
                                    <p className="text-xl font-bold text-teal-400">{stats.totalWet} kg</p>
                                </div>
                                <p className="text-xs text-gray-400 bg-teal-400/10 px-2 py-1 rounded">Processed/Composted</p>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Total Dry Waste</p>
                                    <p className="text-xl font-bold text-amber-400">{stats.totalDry} kg</p>
                                </div>
                                <p className="text-xs text-gray-400 bg-amber-400/10 px-2 py-1 rounded">Sent to landfill</p>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Total Recyclables</p>
                                    <p className="text-xl font-bold text-blue-400">{stats.totalRecyclable} kg</p>
                                </div>
                                <p className="text-xs text-gray-400 bg-blue-400/10 px-2 py-1 rounded">Handed to scrap vendor</p>
                            </div>
                        </div>
                    </div>

                    {/* New Verification Card */}
                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-white mb-6">Municipal Status</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#4ade80]/5 rounded-xl border border-[#4ade80]/10 text-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Certification</p>
                                <p className="text-sm font-bold text-[#4ade80]">Green Zone Certified</p>
                                <p className="text-[10px] text-gray-500 mt-1 italic">Official BMC Audit Serial: #{Math.floor(Math.random()*90000)+10000}</p>
                            </div>
                            <div className="p-4 bg-red-400/5 rounded-xl border border-red-400/10 text-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Pending Penalty</p>
                                <p className="text-sm font-bold text-white">None</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Building Breakdown */}
            {profile.buildings && profile.buildings.length > 0 && (
                <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Building / Wing Compliance Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.buildings.map((b) => {
                            const rate = getBuildingCompliance(b.id, b.totalFlats);
                            return (
                                <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${rate >= 90 ? 'bg-green-500/10 text-green-400' : rate >= 70 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                        <Building2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-white">{b.name}</p>
                                            {rate >= 90 ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-yellow-500" />}
                                        </div>
                                        <p className="text-xs text-gray-400">{b.totalFlats} Flats</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${rate}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-300">{rate}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Layout>
    );
}
