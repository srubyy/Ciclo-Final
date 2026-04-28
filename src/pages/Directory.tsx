import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { FlatRecord, Building } from '../types';
import { Building2, Search, AlertTriangle, CheckCircle, ChevronRight, X, FileText, ShieldAlert } from 'lucide-react';

export default function Directory() {
    const { profile, flats, seedDemoData } = useWasteStore();
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [selectedFlat, setSelectedFlat] = useState<FlatRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const totalFines = flats.reduce((acc, flat) => acc + flat.fines.length, 0);
    const totalUnpaidAmount = flats.reduce((acc, flat) => acc + flat.fines.filter(f => f.status === 'unpaid').reduce((s, f) => s + f.amount, 0), 0);
    const overallCompliance = flats.length ? (flats.reduce((s, f) => s + f.complianceScore, 0) / flats.length).toFixed(1) : '0.0';

    const filteredBuildings = profile.buildings?.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        searchQuery === ''
    );

    const getBuildingFlats = (buildingId: string) => {
        return flats.filter(f => f.buildingId === buildingId);
    };

    return (
        <Layout title="Flats Directory" subtitle="Oversee every wing, flat, compliance history and fines.">
            {!selectedBuilding ? (
                <div>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search wings or buildings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={seedDemoData}
                            className="bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            Reset Seed Data
                        </button>
                    </div>

                    {/* Society Overview Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#141f18] border border-white/8 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Registered Units</p>
                            <p className="text-2xl font-bold text-white">{flats.length}</p>
                        </div>
                        <div className="bg-[#141f18] border border-white/8 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Average Compliance</p>
                            <p className={`text-2xl font-bold ${parseFloat(overallCompliance) >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{overallCompliance}%</p>
                        </div>
                        <div className="bg-[#141f18] border border-white/8 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Notices</p>
                            <p className="text-2xl font-bold text-red-400">{totalFines}</p>
                        </div>
                        <div className="bg-[#141f18] border border-white/8 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Unpaid Dues</p>
                            <p className="text-2xl font-bold text-red-400">₹{totalUnpaidAmount}</p>
                        </div>
                    </div>

                    {!flats || flats.length === 0 ? (
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                            <AlertTriangle size={36} className="text-yellow-500 mb-4 opacity-80" />
                            <h3 className="text-xl font-bold text-white mb-2">No Directory Data Found</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-sm">It looks like the flats data hasn't been generated yet for your session state.</p>
                            <button
                                onClick={seedDemoData}
                                className="bg-[#4ade80] text-[#0a120d] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#22c55e] transition-colors"
                            >
                                Populate Demo Directory
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBuildings?.map(building => {
                            const buildingFlats = getBuildingFlats(building.id);
                            const avgCompliance = buildingFlats.reduce((s, f) => s + f.complianceScore, 0) / (buildingFlats.length || 1);
                            
                            return (
                                <motion.div
                                    key={building.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedBuilding(building)}
                                    className="bg-[#141f18] border border-white/8 rounded-2xl p-5 cursor-pointer hover:border-[#4ade80]/30 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-white/5 rounded-xl text-gray-400 group-hover:text-[#4ade80] transition-colors">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-[#4ade80] transition-colors">{building.name}</h3>
                                                <p className="text-xs text-gray-500">{building.totalFlats} Flats Registered</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-600 group-hover:text-[#4ade80]" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                        <p className="text-xs text-gray-400">Wing Compliance Avg</p>
                                        <p className={`text-sm font-bold ${avgCompliance >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {avgCompliance.toFixed(1)}%
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button 
                            onClick={() => { setSelectedBuilding(null); setSelectedFlat(null); }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronRight size={20} className="transform rotate-180" />
                        </button>
                        <h2 className="text-2xl font-bold text-white">{selectedBuilding.name} Directory</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Flats List */}
                        <div className="md:col-span-1 bg-[#141f18] border border-white/8 rounded-2xl overflow-hidden h-[60vh] flex flex-col">
                            <div className="p-4 border-b border-white/5 bg-black/20">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Select Flat</p>
                            </div>
                            <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                {getBuildingFlats(selectedBuilding.id).map(flat => (
                                    <button
                                        key={flat.id}
                                        onClick={() => setSelectedFlat(flat)}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${selectedFlat?.id === flat.id ? 'bg-[#4ade80]/10 border border-[#4ade80]/20' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div>
                                            <p className={`font-bold ${selectedFlat?.id === flat.id ? 'text-[#4ade80]' : 'text-white'}`}>Flat {flat.flatNumber}</p>
                                        </div>
                                        {flat.fines.length > 0 ? (
                                            <AlertTriangle size={14} className="text-red-400" />
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${flat.complianceScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Flat Details Panel */}
                        <div className="md:col-span-3">
                            {selectedFlat ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={selectedFlat.id}
                                    className="space-y-6"
                                >
                                    {/* Detailed Header */}
                                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-3xl font-bold text-white mb-1">
                                                    {selectedBuilding.name} - {selectedFlat.flatNumber}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4">{selectedFlat.residentName}</p>
                                                <Link 
                                                    to={`/flat-report/${selectedFlat.id}`}
                                                    className="inline-flex items-center gap-2 bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#4ade80]/20 transition-all"
                                                >
                                                    <FileText size={14} /> Generate Detailed Habit Report
                                                </Link>
                                                
                                                {/* Automated Warning Trigger: 3 consecutive non-segregated days */}
                                                {selectedFlat.recentHistory.slice(0, 3).every(h => !h.segregated) && (
                                                    <Link 
                                                        to={`/warning-notice/${selectedFlat.id}`}
                                                        className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all ml-3 animate-pulse"
                                                    >
                                                        <ShieldAlert size={14} /> Issue Three-Day Warning
                                                    </Link>
                                                )}
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl border flex flex-col items-end ${selectedFlat.complianceScore >= 80 ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">Compliance</p>
                                                <p className={`text-xl font-bold ${selectedFlat.complianceScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {selectedFlat.complianceScore}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fines Section */}
                                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                                        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                            <FileText size={16} className="text-red-400" />
                                            Active Notices & Penalties
                                        </h4>
                                        
                                        {selectedFlat.fines.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-6 text-gray-500 bg-black/20 rounded-xl">
                                                <CheckCircle size={24} className="text-green-500/50 mb-2" />
                                                <p className="text-sm">No active violations or fines.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedFlat.fines.map(fine => (
                                                    <div key={fine.id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{fine.reason}</p>
                                                            <p className="text-xs text-gray-500 mt-1">Issued: {fine.date} • ID: {fine.id.slice(0, 6).toUpperCase()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-red-400">₹{fine.amount}</p>
                                                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${fine.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {fine.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Waste Collection History */}
                                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                                        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                            <Building2 size={16} className="text-teal-400" />
                                            Recent Waste Collection Logs
                                        </h4>
                                        {selectedFlat.recentHistory.length === 0 ? (
                                            <p className="text-sm text-gray-500">No recent collection data available.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedFlat.recentHistory.map(log => (
                                                    <div key={log.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <p className="text-sm font-semibold text-white">{log.date}</p>
                                                            {log.segregated ? (
                                                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                                                                    <CheckCircle size={10} /> Segregated
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                                                                    <AlertTriangle size={10} /> Mixed Waste
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="bg-teal-500/10 rounded-lg p-2 text-center">
                                                                <p className="text-[10px] uppercase tracking-widest text-teal-400/70 mb-1">Wet</p>
                                                                <p className="font-mono text-sm text-teal-400">{log.wet}kg</p>
                                                            </div>
                                                            <div className="bg-amber-500/10 rounded-lg p-2 text-center">
                                                                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-1">Dry</p>
                                                                <p className="font-mono text-sm text-amber-400">{log.dry}kg</p>
                                                            </div>
                                                            <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                                                                <p className="text-[10px] uppercase tracking-widest text-blue-400/70 mb-1">Recycle</p>
                                                                <p className="font-mono text-sm text-blue-400">{log.recyclable}kg</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions Note */}
                                    <div className="bg-black/30 border-l-2 border-[#4ade80] p-4 text-sm text-gray-400">
                                        <p>As an admin, you are viewing oversight records. Use official channels to communicate warnings before imposing financial penalties directly.</p>
                                    </div>

                                </motion.div>
                            ) : (
                                <div className="h-full bg-black/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                                    <Building2 size={32} className="mb-3 opacity-20" />
                                    <p className="text-sm">Select a flat from the list to view granular history.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
