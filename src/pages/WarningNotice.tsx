import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import { useWasteStore } from '../store/useWasteStore';
import { 
    AlertTriangle, ArrowLeft, Download, ShieldAlert, 
    FileText, User, MapPin, Scale, HelpCircle
} from 'lucide-react';

export default function WarningNotice() {
    const { flatId } = useParams();
    const { flats, profile } = useWasteStore();

    const flat = flats.find(f => f.id === flatId);
    const building = profile.buildings.find(b => b.id === flat?.buildingId);

    if (!flat || !building) {
        return (
            <Layout title="Notice Generator">
                <div className="flex flex-col items-center justify-center py-20">
                    <AlertTriangle size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-white">Record Not Found</h2>
                    <Link to="/directory" className="text-[#4ade80] mt-4 flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Directory
                    </Link>
                </div>
            </Layout>
        );
    }

    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const noticeID = `WRN-${building.id.toUpperCase()}-${flat.flatNumber}-${Date.now().toString().slice(-4)}`;

    return (
        <Layout 
            title="Warning Notice Generator" 
            subtitle="Formal non-compliance documentation for society committee"
        >
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-10 no-print">
                <Link to={`/flat-report/${flat.id}`} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Habit Analysis
                </Link>
                <div className="flex gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-red-600 transition-all"
                    >
                        <Download size={18} /> Print Official Notice
                    </motion.button>
                </div>
            </div>

            {/* THE ACTUAL NOTICE (Styled for Print) */}
            <div className="max-w-4xl mx-auto bg-white text-black p-12 md:p-16 shadow-2xl rounded-sm border-t-[12px] border-red-600 print:shadow-none print:border-t-[8px]">
                
                {/* Formal Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">{profile.societyName || 'Green Valley Residences'}</h1>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                            <MapPin size={10} /> {profile.location}, Mumbai
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded mb-2 inline-block">FORMAL NOTICE</div>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {noticeID}</p>
                        <p className="text-sm font-bold mt-1">Date: {today}</p>
                    </div>
                </div>

                {/* Recipient Details */}
                <div className="mb-10 text-sm">
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-1">To the resident(s) of:</p>
                    <p className="text-lg font-black">{building.name} — Flat {flat.flatNumber}</p>
                    <p className="text-gray-600">CC: Society Management Committee (SMC)</p>
                </div>

                <div className="space-y-8">
                    {/* Subject */}
                    <div>
                        <h2 className="text-lg font-bold border-l-4 border-red-600 pl-4">
                            Subject: Formal Warning Regarding Recurring Non-Compliance in Waste Segregation
                        </h2>
                    </div>

                    {/* Violation Detail */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <div className="flex items-start gap-4 text-red-700">
                            <ShieldAlert size={24} className="flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm uppercase mb-1">Violation Detected</h4>
                                <p className="text-sm leading-relaxed">
                                    Our automated audit system has flagged your unit for **consistently high non-recyclable contamination** in the wet-waste stream. Records indicate that waste was handed over in a non-segregated (mixed) state for **three consecutive collection cycles**.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Corrective Action */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase flex items-center gap-2 text-gray-700">
                            <HelpCircle size={16} /> Required Corrective Actions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 p-4 rounded-xl">
                                <p className="text-xs font-bold text-black mb-1">Immediate Fix</p>
                                <p className="text-xs text-gray-600 leading-relaxed">Ensure all soiled plastics and multi-layered packaging (MLP) are washed and placed in the Blue Recyclable Bin only.</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-xl">
                                <p className="text-xs font-bold text-black mb-1">Prohibited Practice</p>
                                <p className="text-xs text-gray-600 leading-relaxed">Do not use black plastic liners for wet waste. Use compostable liners or hand over loose waste in the green bin.</p>
                            </div>
                        </div>
                    </div>

                    {/* Policy Reference */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-4 text-gray-700">
                            <Scale size={20} className="flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-xs uppercase mb-1">Legal & Policy Reference</h4>
                                <p className="text-[11px] leading-relaxed text-gray-600">
                                    This notice is issued under the **Solid Waste Management Rules (2016)** and local **Municipal Bylaws**. Continued non-compliance forces the society to pay collective fines, which will be directly debited from your unit's maintenance bill. Formal complaints may also be escalated to the **Municipal Corporation (BMC/TMC)** health department.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Closing */}
                    <div className="pt-10 border-t border-gray-100 flex justify-between items-end">
                        <div>
                            <p className="text-sm font-bold">On behalf of Management,</p>
                            <div className="mt-8 border-t border-black w-48 pt-2">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Authorized Signatory</p>
                                <p className="text-[9px] text-gray-400 italic">Ciclo Verified Society Admin</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                                <FileText size={24} className="text-gray-300" />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-bold leading-none">DOCUMENT ID</p>
                                <p className="text-[10px] font-mono font-bold text-gray-900">{noticeID}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Disclaimer (Dark Mode for App View) */}
            <div className="mt-8 text-center no-print">
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    This document is optimized for A4 printing. The background and formatting will automatically adjust to a professional black-on-white style when printing.
                </p>
            </div>
        </Layout>
    );
}
