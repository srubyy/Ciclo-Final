import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../layouts/Layout';
import { 
    Gavel, ShieldAlert, FileText, Scale, 
    Search, Download, AlertTriangle, CheckCircle2, 
    TrendingUp, Calendar, Filter, MoreVertical,
    Clock, DollarSign, Building2, X
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';

const notices = [
    { id: 'NOT-2401', society: 'Dreams Complex', date: '2026-04-25', violation: 'Mixed Waste Contamination', status: 'Pending Approval', severity: 'High', penalty: '₹5,000' },
    { id: 'NOT-2402', society: 'Ruparel Orion', date: '2026-04-24', violation: 'Non-functional Composter', status: 'Issued', severity: 'Critical', penalty: '₹12,000' },
    { id: 'NOT-2403', society: 'Skyline Residency', date: '2026-04-22', violation: 'Incomplete Log Maintenance', status: 'Resolved', severity: 'Low', penalty: '₹2,500' },
    { id: 'NOT-2404', society: 'Vasant Oasis', date: '2026-04-20', violation: 'Incomplete Segregation', status: 'Fined', severity: 'Medium', penalty: '₹7,500' },
];

const violationData = [
    { name: 'Wet/Dry Mix', value: 45 },
    { name: 'Composter Fail', value: 25 },
    { name: 'Missing Logs', value: 15 },
    { name: 'Illegal Dumping', value: 15 },
];

const COLORS = ['#f87171', '#fbbf24', '#60a5fa', '#a78bfa'];

export default function EnforcementCenter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCase, setSelectedCase] = useState<typeof notices[0] | null>(null);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const handleIssueFine = (society: string) => {
        setNotification(`LEGAL NOTICE: Fine of ₹5,000 issued to ${society}. Municipal records updated.`);
        setSelectedCase(null);
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <Layout 
            title="Enforcement Center" 
            subtitle="Municipal Legal Oversight & Violation Management"
        >
            {/* Authority Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-xl px-4">
                        <div className="bg-blue-600 border border-blue-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                            <ShieldAlert size={20} />
                            <p className="text-sm font-bold flex-1">{notification}</p>
                            <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Active Notices', value: '28', icon: FileText, color: 'text-amber-400', trend: '+12% this month' },
                    { label: 'Fines Collected', value: '₹1.42L', icon: DollarSign, color: 'text-[#4ade80]', trend: '+₹15k this week' },
                    { label: 'Compliance Rate', value: '72%', icon: Scale, color: 'text-blue-400', trend: 'Improved by 4%' },
                    { label: 'Pending Audits', value: '14', icon: Clock, color: 'text-purple-400', trend: 'Due in 48h' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#141f18] border border-white/8 p-6 rounded-[32px] hover:border-white/15 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authority Log</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                        <p className="text-xs font-bold text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-[10px] text-gray-600">{stat.trend}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* Violation Analytics */}
                <div className="xl:col-span-2 bg-[#141f18] border border-white/8 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Violation Distribution</h3>
                            <p className="text-sm text-gray-500">Categorical analysis of municipal code infractions</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={violationData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} width={120} />
                                <Tooltip 
                                    contentStyle={{ background: '#0a120d', border: '1px solid #ffffff15', borderRadius: '16px' }}
                                />
                                <Bar dataKey="value" fill="#f87171" radius={[0, 4, 4, 0]} barSize={30}>
                                    {violationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Severity Mix */}
                <div className="bg-[#141f18] border border-white/8 rounded-[32px] p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-8">Compliance Status</h3>
                    <div className="h-[220px] w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Resolved', value: 65 },
                                        { name: 'Pending', value: 35 },
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="#4ade80" />
                                    <Cell fill="#1e2923" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Notice Recovery Rate</p>
                            <p className="text-xl font-black text-white">88.5%</p>
                            <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                                <TrendingUp size={10} /> +5.2% from last month
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsAuditModalOpen(true)}
                        className="w-full mt-6 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <FileText size={18} /> Generate Ward Audit
                    </button>
                </div>
            </div>

            {/* Legal Notice Queue */}
            <div className="bg-[#141f18] border border-white/8 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center text-red-400">
                            <Gavel size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Notice Dispatch Queue</h3>
                            <p className="text-xs text-gray-500">Tracking and managing active municipal violations</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search society..."
                                className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-400/50 transition-all w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/20 text-gray-500 text-[10px] uppercase tracking-widest">
                                <th className="px-8 py-5 font-bold">Reference ID</th>
                                <th className="px-8 py-5 font-bold">Society Entity</th>
                                <th className="px-8 py-5 font-bold">Violation</th>
                                <th className="px-8 py-5 font-bold text-center">Status</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {notices.map((notice) => (
                                <tr key={notice.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs text-gray-400">{notice.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                                <Building2 size={16} />
                                            </div>
                                            <span className="font-bold text-white">{notice.society}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white">{notice.violation}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                                                notice.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'
                                            }`}>
                                                Severity: {notice.severity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                            notice.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {notice.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedCase(notice)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all border border-white/5"
                                        >
                                            View Case
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CASE DETAILS MODAL */}
            <AnimatePresence>
                {selectedCase && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCase(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-[#0a120d] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">Municipal Case File</p>
                                        <h2 className="text-3xl font-black text-white">{selectedCase.society}</h2>
                                    </div>
                                    <span className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs">ID: {selectedCase.id}</span>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Violation Type</p>
                                        <p className="text-sm text-white font-bold">{selectedCase.violation}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Recommended Fine</p>
                                        <p className="text-sm text-[#4ade80] font-bold">{selectedCase.penalty}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Evidence Log (Past 3 Days)</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex-1 aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-[10px] text-gray-600 font-bold italic">
                                                CCTV_IMG_00{i}.jpg
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white/2 flex gap-4">
                                <button onClick={() => setSelectedCase(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10">Close File</button>
                                <button onClick={() => handleIssueFine(selectedCase.society)} className="flex-[2] py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">Authorize Legal Notice & Fine</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* WARD AUDIT MODAL */}
            <AnimatePresence>
                {isAuditModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-[#0a120d] border border-white/10 rounded-[32px] p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                                    <FileText size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-white">Generate Ward Audit</h2>
                                <p className="text-sm text-gray-500 mt-2">Comprehensive municipal compliance report for current jurisdiction</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm text-gray-400 font-bold">Total Societies</span>
                                    <span className="text-sm text-white font-black">142</span>
                                </div>
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm text-gray-400 font-bold">Active Violations</span>
                                    <span className="text-sm text-red-400 font-black">28</span>
                                </div>
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm text-gray-400 font-bold">Pending Revenue</span>
                                    <span className="text-sm text-[#4ade80] font-black">₹1.24L</span>
                                </div>
                            </div>
                            <button onClick={() => setIsAuditModalOpen(false)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">Download Municipal PDF Audit</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
