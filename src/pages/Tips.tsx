import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { generateTips } from '../utils/tips';
import { Link } from 'react-router-dom';

const impactColors = { high: 'border-red-500/30 bg-red-500/8 text-red-400', medium: 'border-yellow-500/30 bg-yellow-500/8 text-yellow-400', low: 'border-green-500/30 bg-green-500/8 text-green-400' };

export default function Tips() {
    const { entries, getStats } = useWasteStore();
    const stats = getStats(entries);
    const tips = generateTips(stats);

    if (entries.length === 0) {
        return (
            <Layout title="Tips" subtitle="Personalized waste-reduction recommendations">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="text-5xl mb-4">💡</span>
                    <p className="text-gray-400 mb-6">Log some waste data first to receive personalized tips.</p>
                    <Link to="/log" className="bg-[#4ade80] text-[#0a120d] px-5 py-2.5 rounded-xl font-bold text-sm">Log Waste</Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Tips" subtitle="Personalized recommendations based on your society's waste data">
            {/* Composition Summary */}
            <div className="bg-[#141f18] border border-white/8 rounded-2xl p-5 mb-6">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">Your Society Waste Profile</p>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Wet', pct: stats.wetPercentage, color: 'text-teal-400', bar: 'bg-teal-400' },
                        { label: 'Dry', pct: stats.dryPercentage, color: 'text-amber-400', bar: 'bg-amber-400' },
                        { label: 'Recyclable', pct: stats.recyclablePercentage, color: 'text-blue-400', bar: 'bg-blue-400' },
                    ].map(({ label, pct, color, bar }) => (
                        <div key={label} className="flex-1 min-w-24">
                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                            <p className={`text-2xl font-bold ${color}`}>{pct}%</p>
                            <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8 }}
                                    className={`h-full ${bar} rounded-full`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, i) => (
                    <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-[#141f18] border border-white/8 rounded-2xl p-5 hover:border-[#4ade80]/25 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <span className="text-2xl">{tip.icon}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${impactColors[tip.impact]}`}>
                                {tip.impact} impact
                            </span>
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1.5">{tip.title}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">{tip.description}</p>
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <span className={`text-[10px] uppercase tracking-widest ${tip.category === 'wet' ? 'text-teal-400' :
                                    tip.category === 'dry' ? 'text-amber-400' :
                                        tip.category === 'recyclable' ? 'text-blue-400' : 'text-green-400'
                                }`}>
                                {tip.category === 'general' ? '🌍 General' :
                                    tip.category === 'wet' ? '🫧 Wet Waste' :
                                        tip.category === 'dry' ? '🧴 Dry Waste' : '♻️ Recyclable'}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Layout>
    );
}
