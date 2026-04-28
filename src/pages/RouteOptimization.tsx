import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../layouts/Layout';
import { 
    Truck, Map as MapIcon, Navigation, Clock, 
    Droplets, Zap, ShieldCheck, AlertCircle,
    CheckCircle2, TrendingDown, Info, ArrowRight,
    Gauge, Activity, Battery, X, ShieldAlert, Building2
} from 'lucide-react';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const fleetStatus = [
    { id: 'T-101', area: 'Bhandup West', status: 'In Transit', fuel: '45%', load: '82%', nextStop: 'Mayuresh Park' },
    { id: 'T-102', area: 'Kanjurmarg', status: 'Collecting', fuel: '72%', load: '45%', nextStop: 'Dreams Complex' },
    { id: 'T-103', area: 'LBS Road', status: 'At Facility', fuel: '98%', load: '0%', nextStop: 'Route Start' },
];

const nodes = [
    { id: 'N1', x: 20, y: 30, name: 'Mayuresh Park' },
    { id: 'N2', x: 50, y: 20, name: 'Dreams Complex' },
    { id: 'N3', x: 80, y: 40, name: 'Skyline' },
    { id: 'N4', x: 70, y: 70, name: 'Vasant Oasis' },
    { id: 'N5', x: 30, y: 80, name: 'LBS Hub' },
];

const routePaths = {
    priority: { path: ['N5', 'N1', 'N2', 'N4', 'N3'], color: '#fbbf24' },
    green: { path: ['N5', 'N1', 'N2', 'N3', 'N4'], color: '#4ade80' },
    balanced: { path: ['N5', 'N4', 'N3', 'N2', 'N1'], color: '#3b82f6' },
};

const routeOptions = [
    { id: 'priority', name: 'Priority Path', desc: 'Focus on high-tonnage societies first.', stats: '98% Efficiency', icon: Zap, color: 'text-amber-400' },
    { id: 'green', name: 'Eco-Optimized', desc: 'Minimum distance to reduce fuel & CO2.', stats: '-12% Emissions', icon: Droplets, color: 'text-[#4ade80]' },
    { id: 'balanced', name: 'Balanced Municipal', desc: 'Standard collection route.', stats: 'Standard Timing', icon: Activity, color: 'text-blue-400' },
];

export default function RouteOptimization() {
    const [selectedTruck, setSelectedTruck] = useState<typeof fleetStatus[0] | null>(null);
    const [activeRouteId, setActiveRouteId] = useState<'priority' | 'green' | 'balanced'>('balanced');
    const [notification, setNotification] = useState<string | null>(null);

    const handleApplyRoute = (id: 'priority' | 'green' | 'balanced') => {
        setActiveRouteId(id);
        setNotification(`GPS UPLINK: ${routeOptions.find(r => r.id === id)?.name} pushed to Truck ${selectedTruck?.id}.`);
        setSelectedTruck(null);
        setTimeout(() => setNotification(null), 4000);
    };

    const getPathData = (nodeIds: string[]) => {
        return nodeIds.map(id => {
            const node = nodes.find(n => n.id === id);
            return `${node?.x},${node?.y}`;
        }).join(' L ');
    };

    return (
        <Layout 
            title="Route Optimization" 
            subtitle="Municipal Logistics & Collection Fleet Management"
        >
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-xl px-4">
                        <div className="bg-blue-600 border border-blue-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                            <Truck size={20} />
                            <p className="text-sm font-bold flex-1">{notification}</p>
                            <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg"><X size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-[#141f18] border border-white/8 rounded-[32px] p-8 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white">Live Logistics Heatmap</h3>
                            <p className="text-sm text-gray-500">Visualizing active paths and alternative route options</p>
                        </div>
                        <div className="flex gap-4">
                            {Object.entries(routePaths).map(([id, info]) => (
                                <div key={id} className="flex items-center gap-2">
                                    <div className="w-3 h-1 rounded-full" style={{ backgroundColor: info.color }} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="aspect-[16/9] w-full bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-10">
                            {/* Render All Paths */}
                            {Object.entries(routePaths).map(([id, info]) => (
                                <motion.path
                                    key={id}
                                    d={`M ${getPathData(info.path)}`}
                                    fill="none"
                                    stroke={info.color}
                                    strokeWidth={id === activeRouteId ? "0.8" : "0.3"}
                                    strokeDasharray={id === activeRouteId ? "0" : "2,2"}
                                    opacity={id === activeRouteId ? 1 : 0.2}
                                    animate={id === activeRouteId ? { strokeWidth: [0.8, 1.2, 0.8] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            ))}

                            {/* Render Nodes */}
                            {nodes.map(node => (
                                <g key={node.id}>
                                    <circle cx={node.x} cy={node.y} r="1.5" fill="#1e2923" stroke="white" strokeWidth="0.5" />
                                    <text x={node.x} y={node.y - 4} textAnchor="middle" fill="#6b7280" fontSize="2.5" fontWeight="bold" className="uppercase tracking-tighter">
                                        {node.name}
                                    </text>
                                </g>
                            ))}

                            {/* Animated Truck on Active Path */}
                            <motion.circle
                                r="2"
                                fill={routePaths[activeRouteId].color}
                                style={{ filter: `drop-shadow(0 0 5px ${routePaths[activeRouteId].color})` }}
                            >
                                <animateMotion
                                    dur="10s"
                                    repeatCount="indefinite"
                                    path={`M ${getPathData(routePaths[activeRouteId].path)}`}
                                />
                            </motion.circle>
                        </svg>

                        {/* Map Grid Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg width="100%" height="100%"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-[#141f18] border border-white/8 rounded-[32px] p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Route Efficiency</h3>
                    <div className="space-y-6">
                        {routeOptions.map(opt => (
                            <div key={opt.id} className={`p-4 rounded-2xl border transition-all ${activeRouteId === opt.id ? 'bg-white/5 border-blue-500/50' : 'bg-transparent border-white/5'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg bg-white/5 ${opt.color}`}><opt.icon size={16} /></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{opt.name}</p>
                                        <p className="text-[10px] text-gray-500">{opt.stats}</p>
                                    </div>
                                    {activeRouteId === opt.id && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active</span>}
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${opt.id === 'green' ? 'bg-[#4ade80]' : 'bg-blue-500'}`} style={{ width: opt.id === 'green' ? '92%' : opt.id === 'priority' ? '85%' : '75%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-[24px]">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Municipal Impact</p>
                        <p className="text-sm text-white leading-relaxed">Switching to <span className="text-[#4ade80] font-bold">Eco-Optimized</span> saves approx. <span className="font-bold">₹12,400</span> per week in fuel.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {fleetStatus.map((truck) => (
                    <div key={truck.id} className="bg-[#141f18] border border-white/8 p-6 rounded-[32px] group hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-white/5 text-blue-400"><Truck size={24} /></div>
                            <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{truck.status}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{truck.id}</h4>
                        <p className="text-xs text-gray-500 mb-6">{truck.area}</p>
                        <div className="space-y-4 mb-6">
                            <div><div className="flex justify-between text-[10px] font-bold uppercase mb-1"><span className="text-gray-500">Fuel Level</span><span className="text-white">{truck.fuel}</span></div><div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: truck.fuel }} /></div></div>
                        </div>
                        <button onClick={() => setSelectedTruck(truck)} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all border border-white/5">Re-route Truck</button>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedTruck && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTruck(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-[#0a120d] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/2"><h2 className="text-3xl font-black text-white">Re-route {selectedTruck.id}</h2></div>
                            <div className="p-8 space-y-4">
                                {routeOptions.map((route) => (
                                    <button key={route.id} onClick={() => handleApplyRoute(route.id as any)} className={`w-full p-6 border rounded-2xl transition-all text-left group ${activeRouteId === route.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}>
                                        <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-white/5 ${route.color}`}><route.icon size={18} /></div><span className="font-bold text-white">{route.name}</span></div><span className="text-[10px] font-black text-gray-500 uppercase">{route.stats}</span></div>
                                        <p className="text-xs text-gray-500 pl-11">{route.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <div className="p-8 bg-white/2"><button onClick={() => setSelectedTruck(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10">Cancel</button></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
