import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Leaf, Lightbulb, Users, ChevronRight } from 'lucide-react';
import { useWasteStore } from '../store/useWasteStore';
import Navbar from '../components/Navbar';

export default function Landing() {
    const { seedDemoData, entries, profile } = useWasteStore();

    const features = [
        { icon: '🗓️', title: 'Bulk Collection Logging', desc: 'Track daily society-level pickups for wet, dry & recyclable waste streams.' },
        { icon: '📊', title: 'Integrated Dashboard', desc: 'Real-time master trends and macro-analytics for society-wide oversight.' },
        { icon: '🏢', title: 'Wing & Flat Directory', desc: 'Manage every unit, track segregation compliance, and manage trash-related fines.' },
        { icon: '🌍', title: 'District Benchmarks', desc: 'See how your society ranks against other residential complexes in Mumbai MMR.' },
        { icon: '🏛️', title: 'BMC Compliance', desc: 'Auto-generate official segregation reports for municipal oversight and inspections.' },
        { icon: '🎯', title: 'SDG Impact', desc: 'Directly supporting UN SDGs 11, 12, and 13 — Sustainable Cities, Responsible Consumption, and Climate Action.' },
    ];

    return (
        <div className="min-h-screen bg-[#0a120d] text-white">
            <Navbar />
            <div className="md:ml-56">
                {/* Hero */}
                <section className="relative min-h-[90vh] flex flex-col justify-center px-6 py-20 overflow-hidden">
                    {/* Background gradient blobs */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] text-xs font-medium mb-6 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                            SDG 12 · Responsible Consumption
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                            Know your<br />
                            <span className="text-[#4ade80]">waste</span>, change<br />
                            your <span className="text-[#4ade80]">world.</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                            Ciclo bridges the management awareness gap — track daily society waste across wet, dry, and recyclable streams. Manage your vendors efficiently.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/log">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-[#4ade80] text-[#0a120d] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#22c55e] transition-colors"
                                >
                                    Start Logging <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                            {entries.length === 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={seedDemoData}
                                    className="flex items-center gap-2 bg-white/8 text-white border border-white/15 px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-white/12 transition-colors"
                                >
                                    Load Demo Data
                                </motion.button>
                            )}
                            {entries.length > 0 && (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 bg-white/8 text-white border border-white/15 px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-white/12 transition-colors"
                                    >
                                        View Dashboard <BarChart2 size={18} />
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-16 flex flex-wrap gap-8"
                    >
                        {[
                            { label: 'Societies Surveyed', value: '12+' },
                            { label: 'Households Impacted', value: '600+' },
                            { label: 'Management Gap', value: '80%' },
                            { label: 'SDGs Supported', value: '3' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-2xl font-bold text-[#4ade80]">{value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="px-6 py-16 border-t border-white/5">
                    <div className="max-w-5xl">
                        <p className="text-xs uppercase tracking-widest text-[#4ade80] mb-3">What Ciclo does</p>
                        <h2 className="text-3xl font-bold mb-12">A complete waste intelligence platform</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="bg-[#141f18] border border-white/6 rounded-2xl p-5 hover:border-[#4ade80]/30 transition-colors group"
                                >
                                    <span className="text-2xl mb-3 block">{f.icon}</span>
                                    <h3 className="font-semibold text-white mb-1.5 text-sm">{f.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SDG Section */}
                <section className="px-6 py-16 border-t border-white/5">
                    <div className="max-w-4xl">
                        <p className="text-xs uppercase tracking-widest text-[#4ade80] mb-3">UN Sustainable Development Goals</p>
                        <h2 className="text-3xl font-bold mb-8">Aligned with global impact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { num: '11', title: 'Sustainable Cities', desc: 'Empowering communities with localized waste management data.', color: 'border-orange-500/30 bg-orange-500/8' },
                                { num: '12', title: 'Responsible Consumption', desc: 'Driving waste reduction at the source through personalized data.', color: 'border-yellow-500/30 bg-yellow-500/8' },
                                { num: '13', title: 'Climate Action', desc: 'Reducing methane emissions by diverting organic waste from landfill.', color: 'border-green-500/30 bg-green-500/8' },
                            ].map((sdg) => (
                                <div key={sdg.num} className={`rounded-2xl border ${sdg.color} p-5`}>
                                    <div className="text-3xl font-black text-white/20 mb-2">SDG {sdg.num}</div>
                                    <h3 className="font-semibold text-white text-sm mb-1.5">{sdg.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{sdg.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Bottom */}
                <section className="px-6 py-16 border-t border-white/5">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to manage waste better?</h2>
                        <p className="text-gray-400 mb-8">Your society data is the first step toward a measurable environmental impact. Start tracking your vendors today.</p>
                        <div className="flex gap-4 flex-wrap">
                            <Link to="/log">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    className="flex items-center gap-2 bg-[#4ade80] text-[#0a120d] px-6 py-3 rounded-xl font-bold text-sm"
                                >
                                    Log Your First Entry <ChevronRight size={16} />
                                </motion.button>
                            </Link>
                            <Link to="/directory">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    className="flex items-center gap-2 bg-white/8 text-white border border-white/15 px-6 py-3 rounded-xl font-medium text-sm"
                                >
                                    Manage Directory <Users size={16} />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </section>

                <footer className="px-6 py-8 border-t border-white/5 text-gray-600 text-xs">
                    <p>Ciclo — Society Waste Intelligence · VESIT Dept. of IT · Project 2025-26</p>
                    <p className="mt-1">Group 5: Sruti Baliga · Hritik Pandey · Kaushal Gunjal · Sabaresh Iyer · Guide: Dr. Rupali Kale</p>
                </footer>
            </div>
        </div>
    );
}
