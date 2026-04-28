import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import { learnArticles } from '../utils/tips';
import { Clock, ChevronRight, X } from 'lucide-react';

export default function Learn() {
    const [selected, setSelected] = useState<typeof learnArticles[0] | null>(null);

    return (
        <Layout title="Learn" subtitle="Knowledge hub — segregation, composting, recycling, and sustainability.">
            {selected ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                    <button
                        onClick={() => setSelected(null)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
                    >
                        <X size={16} /> Close article
                    </button>
                    <div className="bg-[#141f18] border border-white/8 rounded-2xl p-6">
                        <span className="text-3xl mb-4 block">{selected.icon}</span>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] uppercase tracking-widest text-[#4ade80] border border-[#4ade80]/30 px-2 py-0.5 rounded-full">{selected.category}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} /> {selected.readTime} min read</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-4">{selected.title}</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 italic border-l-2 border-[#4ade80]/40 pl-4">{selected.summary}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{selected.content}</p>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {learnArticles.map((article, i) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => setSelected(article)}
                            className="bg-[#141f18] border border-white/8 rounded-2xl p-5 cursor-pointer hover:border-[#4ade80]/30 transition-all group"
                        >
                            <span className="text-2xl mb-3 block">{article.icon}</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#4ade80] mb-2 block">{article.category}</span>
                            <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-[#4ade80] transition-colors">{article.title}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed mb-4">{article.summary}</p>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min</span>
                                <ChevronRight size={14} className="group-hover:text-[#4ade80] transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Quick Reference */}
            {!selected && (
                <div className="mt-8 bg-[#141f18] border border-white/8 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Quick Reference: What Goes Where?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                type: 'Wet (Biodegradable)',
                                color: 'border-teal-500/30 bg-teal-500/8 text-teal-400',
                                items: ['Vegetable peels', 'Fruit scraps', 'Cooked food', 'Tea/coffee grounds', 'Garden cuttings', 'Eggshells'],
                            },
                            {
                                type: 'Dry Non-Recyclable',
                                color: 'border-amber-500/30 bg-amber-500/8 text-amber-400',
                                items: ['Soiled plastic', 'Chips bags', 'Diapers/sanitary', 'Styrofoam', 'Ceramic/broken glass', 'Composite packaging'],
                            },
                            {
                                type: 'Recyclable',
                                color: 'border-blue-500/30 bg-blue-500/8 text-blue-400',
                                items: ['Clean PET bottles', 'Cardboard & paper', 'Aluminum cans', 'Glass bottles', 'Metal scraps', 'Clean HDPE plastic'],
                            },
                        ].map(({ type, color, items }) => (
                            <div key={type} className={`rounded-xl border ${color} p-4`}>
                                <p className="text-xs font-semibold mb-3">{type}</p>
                                <ul className="space-y-1">
                                    {items.map((item) => (
                                        <li key={item} className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
}
