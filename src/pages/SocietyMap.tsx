import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { Building2, Info, ArrowUpRight, AlertCircle, Droplets, Box, Recycle, MapPin, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper to handle map centering
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function SocietyMap() {
    const { profile, entries } = useWasteStore();
    const location = useLocation();
    const [selectedWing, setSelectedWing] = useState<string | null>(null);
    const [isNotifying, setIsNotifying] = useState(false);
    const [notifiedWings, setNotifiedWings] = useState<Set<string>>(new Set());

    const defaultCenter: [number, number] = profile.coordinates || [19.1413, 72.9360];

    useEffect(() => {
        const state = location.state as { selectedWing?: string };
        if (state?.selectedWing && state.selectedWing !== 'all') {
            setSelectedWing(state.selectedWing);
        }
    }, [location]);

    const handleNotify = (wingId: string) => {
        setIsNotifying(true);
        // Simulate network request
        setTimeout(() => {
            setIsNotifying(false);
            setNotifiedWings(prev => new Set(prev).add(wingId));
            
            // Reset after 3 seconds
            setTimeout(() => {
                setNotifiedWings(prev => {
                    const next = new Set(prev);
                    next.delete(wingId);
                    return next;
                });
            }, 3000);
        }, 1200);
    };

    // Calculate wing data for the heatmap
    const wingStats = profile.buildings.map(building => {
        const buildingEntries = entries.filter(e => e.buildingId === building.id);
        const days = new Set(buildingEntries.map(e => e.date)).size || 1;
        const totalUnsegregated = buildingEntries.reduce((sum, e) => sum + (e.nonSegregatedFlats || 0), 0);
        
        const wet = buildingEntries.reduce((sum, e) => sum + e.wet, 0);
        const dry = buildingEntries.reduce((sum, e) => sum + e.dry, 0);
        const rec = buildingEntries.reduce((sum, e) => sum + e.recyclable, 0);
        
        const totalPossible = building.totalFlats * days;
        const sei = totalPossible > 0 
            ? parseFloat(((1 - (totalUnsegregated / totalPossible)) * 100).toFixed(1))
            : 0;

        let status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (sei < 75) status = 'critical';
        else if (sei < 90) status = 'warning';

        return {
            ...building,
            sei,
            wet: wet.toFixed(1),
            dry: dry.toFixed(1),
            rec: rec.toFixed(1),
            total: (wet + dry + rec).toFixed(1),
            status
        };
    });

    const activeWing = wingStats.find(w => w.id === selectedWing);

    return (
        <Layout 
            title="Society Tonnage Heatmap" 
            subtitle="Spatial visualization of waste generation and segregation efficiency"
        >
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Left: Heatmap Grid */}
                <div className="xl:col-span-3">
                    <div className="bg-[#141f18] border border-white/8 rounded-3xl p-8 shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Wing-Wise Efficiency Map</h3>
                                <p className="text-sm text-gray-500">Click a wing block to view detailed generation metrics</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Healthy (90%+)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Warning (75-89%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Critical (&lt;75%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Geographical Heatmap via Leaflet */}
                        <div className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10">
                            <MapContainer 
                                center={defaultCenter} 
                                zoom={18} 
                                scrollWheelZoom={false}
                                className="h-full w-full outline-none"
                                style={{ height: '600px', width: '100%' }}
                            >
                                <ChangeView center={defaultCenter} zoom={18} />
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                
                                <Circle 
                                    center={defaultCenter} 
                                    radius={100} 
                                    pathOptions={{ 
                                        color: '#4ade80', 
                                        weight: 1, 
                                        dashArray: '5, 10', 
                                        fillOpacity: 0.05,
                                        interactive: false 
                                    }} 
                                />
                                
                                {wingStats.map((wing, index) => {
                                    // Generate coordinates relative to society center
                                    const offsets = [
                                        [0.0002, -0.0002],
                                        [-0.0002, -0.0003],
                                        [0.0001, 0.0003],
                                        [-0.0001, 0.0002],
                                    ];
                                    const offset = offsets[index] || [0, 0];
                                    const position: [number, number] = [
                                        defaultCenter[0] + offset[0],
                                        defaultCenter[1] + offset[1]
                                    ];

                                    const isSelected = selectedWing === wing.id;
                                    const color = wing.status === 'healthy' ? '#22c55e' : wing.status === 'warning' ? '#eab308' : '#ef4444';

                                    return (
                                        <Circle
                                            key={wing.id}
                                            center={position}
                                            radius={20}
                                            pathOptions={{
                                                fillColor: color,
                                                fillOpacity: isSelected ? 0.7 : 0.4,
                                                color: isSelected ? '#ffffff' : color,
                                                weight: isSelected ? 3 : 2,
                                                className: 'cursor-pointer'
                                            }}
                                            eventHandlers={{
                                                click: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    setSelectedWing(wing.id);
                                                }
                                            }}
                                        >
                                            <Popup closeButton={false} autoPan={false}>
                                                <div className="p-1">
                                                    <p className="font-bold text-sm text-gray-900 mb-1">{wing.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono tracking-tighter">Click to inspect logs</p>
                                                </div>
                                            </Popup>
                                        </Circle>
                                    );
                                })}
                            </MapContainer>

                            {/* External Map Control Legend Overlay */}
                            <div className="absolute bottom-6 left-6 z-[1000] p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 space-y-2 pointer-events-none no-print">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin size={14} className="text-[#4ade80]" />
                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                                        {profile.societyName}, {profile.ward} Ward
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                                    <span className="text-[10px] text-white/60">Contamination Alert</span>
                                </div>
                            </div>

                            {/* Interaction Hint */}
                            <div className="absolute top-6 right-6 z-[1000] px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 flex items-center gap-2 pointer-events-none no-print">
                                <MapPin size={12} className="text-gray-400" />
                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Interactive GIS View</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Wing Inspector */}
                <div className="xl:col-span-1">
                    <AnimatePresence mode="wait">
                        {activeWing ? (
                            <motion.div
                                key={activeWing.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#141f18] border border-white/8 rounded-3xl p-6 h-full flex flex-col"
                            >
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-2xl ${activeWing.status === 'healthy' ? 'bg-green-500/10 text-green-400' : activeWing.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                            <Building2 size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{activeWing.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest leading-none mt-1">Wing Detailed View</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Efficiency Index</p>
                                        <div className="flex items-end gap-2">
                                            <p className={`text-4xl font-black ${activeWing.status === 'healthy' ? 'text-green-400' : activeWing.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {activeWing.sei}%
                                            </p>
                                            <span className="text-xs text-gray-500 mb-2">Segregation Accuracy</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tonnage Breakdown</h4>
                                    
                                    <div className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-teal-400">
                                                <Droplets size={16} />
                                                <span className="text-xs font-bold uppercase">Wet Waste</span>
                                            </div>
                                            <span className="text-sm font-mono text-white">{activeWing.wet} kg</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(parseFloat(activeWing.wet) / parseFloat(activeWing.total)) * 100}%` }}
                                                className="h-full bg-teal-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-amber-400">
                                                <Box size={16} />
                                                <span className="text-xs font-bold uppercase">Dry Waste</span>
                                            </div>
                                            <span className="text-sm font-mono text-white">{activeWing.dry} kg</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(parseFloat(activeWing.dry) / parseFloat(activeWing.total)) * 100}%` }}
                                                className="h-full bg-amber-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Recycle size={16} />
                                                <span className="text-xs font-bold uppercase">Recyclable</span>
                                            </div>
                                            <span className="text-sm font-mono text-white">{activeWing.rec} kg</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(parseFloat(activeWing.rec) / parseFloat(activeWing.total)) * 100}%` }}
                                                className="h-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button 
                                        onClick={() => handleNotify(activeWing.id)}
                                        disabled={isNotifying || notifiedWings.has(activeWing.id)}
                                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2
                                            ${notifiedWings.has(activeWing.id)
                                                ? 'bg-[#4ade80] text-black hover:bg-[#4ade80]'
                                                : isNotifying
                                                    ? 'bg-gray-300 text-gray-500 cursor-wait'
                                                    : 'bg-white text-black hover:bg-gray-200'
                                            }`}
                                    >
                                        {notifiedWings.has(activeWing.id) ? (
                                            <>
                                                <CheckCircle2 size={18} />
                                                Manager Notified
                                            </>
                                        ) : isNotifying ? (
                                            'Sending Alert...'
                                        ) : (
                                            'Notify Wing Manager'
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed">
                                        Data based on the last 30 days of society-wide collective records.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-[#141f18]/50 border border-white/5 border-dashed rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center">
                                <Info size={48} className="text-gray-700 mb-6" />
                                <h4 className="text-white font-bold mb-2">No Wing Selected</h4>
                                <p className="text-sm text-gray-500">Pick a wing on the map grid to see its tonnage profile and contamination alerts.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
}
