import React from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { Trophy, TrendingUp, AlertCircle, Award, Target } from 'lucide-react';

export default function Leaderboard() {
    const { profile, entries } = useWasteStore();
    
    // Calculate SEI for each building
    const leaderboardData = profile.buildings.map(building => {
        const buildingEntries = entries.filter(e => e.buildingId === building.id);
        const days = new Set(buildingEntries.map(e => e.date)).size || 1;
        const totalUnsegregated = buildingEntries.reduce((sum, e) => sum + (e.nonSegregatedFlats || 0), 0);
        
        // SEI = (Successful Segregations / Total Possible Segregations) * 100
        const totalPossible = building.totalFlats * days;
        const sei = totalPossible > 0 
            ? parseFloat(((1 - (totalUnsegregated / totalPossible)) * 100).toFixed(1))
            : 0;

        // Calculate Trend (comparing last 7 days vs previous 7 days)
        const recentEntries = buildingEntries.slice(0, 7);
        const previousEntries = buildingEntries.slice(7, 14);
        
        const recentUnseg = recentEntries.reduce((s, e) => s + (e.nonSegregatedFlats || 0), 0);
        const prevUnseg = previousEntries.reduce((s, e) => s + (e.nonSegregatedFlats || 0), 0);
        
        const trend = prevUnseg > 0 ? ((prevUnseg - recentUnseg) / prevUnseg) * 100 : 0;

        return {
            name: building.name,
            sei: sei,
            trend: parseFloat(trend.toFixed(1)),
            totalFlats: building.totalFlats,
            color: sei >= 90 ? '#4ade80' : sei >= 75 ? '#facc15' : '#f87171'
        };
    }).sort((a, b) => b.sei - a.sei);

    const topWing = leaderboardData[0];

    return (
        <Layout 
            title="Wing-Wise SEI Leaderboard" 
            subtitle="Ranking buildings by their Segregation Efficiency Index (SEI)"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Top Performer Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 bg-gradient-to-br from-[#141f18] to-[#0a120d] border border-[#4ade80]/20 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy size={120} className="text-[#4ade80]" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-[#4ade80] mb-4">
                            <Award size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Current Champion</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{topWing?.name || '---'}</h3>
                        <p className="text-gray-400 text-sm mb-6">Leading with {topWing?.sei}% Efficiency</p>
                        
                        <div className="flex items-center gap-4">
                            <div className="bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-xl px-4 py-2">
                                <p className="text-[10px] text-gray-500 uppercase">SEI Score</p>
                                <p className="text-xl font-bold text-[#4ade80]">{topWing?.sei}%</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                                <p className="text-[10px] text-gray-500 uppercase">Growth</p>
                                <p className="text-xl font-bold text-white">+{topWing?.trend || 0}%</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Index Info Card */}
                <div className="lg:col-span-2 bg-[#141f18] border border-white/8 rounded-2xl p-6 flex flex-col justify-center">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Target size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">What is SEI?</h4>
                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                The <span className="text-white font-medium">Segregation Efficiency Index (SEI)</span> measures the percentage of households in a wing that correctly separate wet and dry waste daily. Use this list to publish rankings in society newsletters and encourage healthy competition.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#4ade80]">90%+</p>
                            <p className="text-[10px] text-gray-500 uppercase">Green Zone</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-lg font-bold text-yellow-400">75-89%</p>
                            <p className="text-[10px] text-gray-500 uppercase">Buffer Zone</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-red-500">&lt;75%</p>
                            <p className="text-[10px] text-gray-500 uppercase">Needs Action</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Ranking Chart */}
            <div className="bg-[#141f18] border border-white/8 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#4ade80]" />
                        Real-Time Wing Performance
                    </h3>
                    <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Updated Daily
                    </div>
                </div>

                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={leaderboardData}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ffffff08" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ 
                                    background: '#0a120d', 
                                    border: '1px solid #ffffff15', 
                                    borderRadius: '12px',
                                    padding: '12px'
                                }}
                            />
                            <Bar 
                                dataKey="sei" 
                                radius={[0, 8, 8, 0]} 
                                barSize={32}
                            >
                                {leaderboardData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList 
                                    dataKey="sei" 
                                    position="right" 
                                    content={(props: any) => {
                                        const { x, y, width, value } = props;
                                        return (
                                            <text x={x + width + 10} y={y + 20} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="start">
                                                {value}%
                                            </text>
                                        );
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Action Items */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">Management Action Required</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Wings below 80% should receive physical segregation awareness leaflets. Consider acknowledging top-performing wings in the next society meet.
                    </p>
                </div>
                <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Generate Circular
                </button>
            </div>
        </Layout>
    );
}
