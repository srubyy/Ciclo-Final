import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../layouts/Layout';
import { 
    Recycle, MapPin, Truck, Factory, Leaf, Monitor, 
    Phone, ExternalLink, ShieldCheck, Cpu, Droplets, 
    Box, Newspaper, ChevronRight
} from 'lucide-react';

const wasteCategories = [
    {
        id: 'metal',
        name: 'Metal Scraps',
        currentLoad: '4,250',
        icon: Factory,
        color: 'from-gray-500 to-slate-700',
        textColor: 'text-gray-400',
        bgLight: 'bg-gray-500/10',
        borderLight: 'border-gray-500/20',
        ecoMethod: 'Industrial smelting & metallurgical recovery to prevent ore mining.',
        centers: [
            { name: 'Kurla Industrial Scrap Market', type: 'Large-Scale Smelting', ward: 'L Ward', phone: '+91 22 2503 8911', dist: '3.2 km', pricePerKg: '₹18' },
            { name: 'Sakinaka Metal Recovery', type: 'Alloy Separation', ward: 'L Ward', phone: '+91 22 2850 1123', dist: '5.1 km', pricePerKg: '₹22' }
        ]
    },
    {
        id: 'ewaste',
        name: 'E-Waste',
        currentLoad: '1,820',
        icon: Cpu,
        color: 'from-indigo-500 to-purple-700',
        textColor: 'text-indigo-400',
        bgLight: 'bg-indigo-500/10',
        borderLight: 'border-indigo-500/20',
        ecoMethod: 'Specialized dismantling and extraction of precious metals (Gold, Lithium, Copper) without soil leaching.',
        centers: [
            { name: 'EcoReco Recycling Facility', type: 'Authorized Dismantler', ward: 'K/E Ward', phone: '1800-102-1020', dist: '4.8 km', pricePerKg: '₹45' },
            { name: 'Mahim E-Waste Hub', type: 'PCB Extraction', ward: 'G/N Ward', phone: '+91 22 2444 5566', dist: '8.4 km', pricePerKg: '₹55' }
        ]
    },
    {
        id: 'organic',
        name: 'Organic / Wet',
        currentLoad: '12,400',
        icon: Droplets,
        color: 'from-emerald-500 to-teal-700',
        textColor: 'text-emerald-400',
        bgLight: 'bg-emerald-500/10',
        borderLight: 'border-emerald-500/20',
        ecoMethod: 'Biomethanation for renewable energy grid supply and large-scale municipal composting for agriculture.',
        centers: [
            { name: 'Kanjurmarg Bioreactor', type: 'Methane Recovery', ward: 'S Ward', phone: 'BMC Helpdesk', dist: '2.1 km', pricePerKg: '₹0 (Subsidized)' },
            { name: 'Deonar Composting Plant', type: 'Fertilizer Generation', ward: 'M/E Ward', phone: 'BMC Helpdesk', dist: '9.5 km', pricePerKg: '₹0 (Subsidized)' }
        ]
    },
    {
        id: 'plastic',
        name: 'Plastics',
        currentLoad: '5,600',
        icon: Box,
        color: 'from-amber-500 to-orange-700',
        textColor: 'text-amber-400',
        bgLight: 'bg-amber-500/10',
        borderLight: 'border-amber-500/20',
        ecoMethod: 'Polymer granulation and extrusion for mixing into durable bitumen road construction.',
        centers: [
            { name: 'Dharavi Polymer Processors', type: 'Granulation Unit', ward: 'G/N Ward', phone: '+91 98200 12345', dist: '11.0 km', pricePerKg: '₹12' },
            { name: 'Mulund Plastic Extrusions', type: 'Road Bitumen Mix', ward: 'T Ward', phone: '+91 98200 54321', dist: '6.5 km', pricePerKg: '₹14' }
        ]
    },
    {
        id: 'paper',
        name: 'Paper & Cardboard',
        currentLoad: '8,900',
        icon: Newspaper,
        color: 'from-blue-500 to-cyan-700',
        textColor: 'text-blue-400',
        bgLight: 'bg-blue-500/10',
        borderLight: 'border-blue-500/20',
        ecoMethod: 'Aqueous pulping and de-inking to manufacture recycled packaging cartons and eco-friendly stationary.',
        centers: [
            { name: 'Vikhroli Paper Mills', type: 'Pulping & De-inking', ward: 'S Ward', phone: '+91 22 2578 9900', dist: '3.8 km', pricePerKg: '₹10' },
            { name: 'Ghatkopar Carton Recyclers', type: 'Packaging Manufacturing', ward: 'N Ward', phone: '+91 22 2511 2233', dist: '5.2 km', pricePerKg: '₹11' }
        ]
    }
];

export default function DisposalGuide() {
    const [selectedCategory, setSelectedCategory] = useState(wasteCategories[0]);

    return (
        <Layout 
            title="Disposal & Recovery Guide" 
            subtitle="Eco-friendly disposal methods and official BMC recovery centers by waste category"
        >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
                
                {/* Left Sidebar: Category Selector */}
                <div className="xl:col-span-4 flex flex-col gap-4">
                    <div className="bg-[#141f18] border border-white/8 rounded-[32px] p-6 mb-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Waste Categories</h3>
                        <div className="space-y-3">
                            {wasteCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = selectedCategory.id === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                                            isSelected 
                                                ? `bg-white/10 border-white/20 shadow-lg` 
                                                : 'bg-black/20 border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? `bg-gradient-to-br ${cat.color} text-white` : 'bg-white/5 text-gray-500'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <span className={`block font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                    {cat.name}
                                                </span>
                                                <span className={`block text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-600'}`}>
                                                    {cat.currentLoad} kg pending
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={isSelected ? 'text-white' : 'text-gray-600'} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-[32px] p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="text-blue-400" size={24} />
                            <h4 className="text-white font-bold">BMC Verified</h4>
                        </div>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            These centers are officially partnered or verified by municipal authorities to ensure zero-landfill processing and ethical recycling practices.
                        </p>
                    </div>
                </div>

                {/* Right Content: Detailed Info */}
                <div className="xl:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full flex flex-col"
                        >
                            {/* Hero Card */}
                            <div className={`relative overflow-hidden rounded-[32px] p-10 mb-6 bg-gradient-to-br ${selectedCategory.color} shadow-2xl border border-white/10`}>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner">
                                        <selectedCategory.icon size={32} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                                        {selectedCategory.name}
                                    </h2>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                                            <span className="text-sm font-bold text-white tracking-wide">
                                                Current Ward Accumulation: {selectedCategory.currentLoad} kg
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-2xl">
                                        <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                            <Leaf size={14} /> Eco-Friendly Disposal Method
                                        </p>
                                        <p className="text-white text-base leading-relaxed font-medium">
                                            {selectedCategory.ecoMethod}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Background Icon */}
                                <div className="absolute -bottom-10 -right-10 text-white opacity-5 pointer-events-none">
                                    <selectedCategory.icon size={300} />
                                </div>
                            </div>

                            {/* Nearby Centers List */}
                            <div className="bg-[#141f18] border border-white/8 rounded-[32px] p-8 flex-1">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Authorized Recovery Centers</h3>
                                        <p className="text-xs text-gray-500">Official industrial partners for processing {selectedCategory.name.toLowerCase()}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border ${selectedCategory.borderLight} ${selectedCategory.bgLight}`}>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${selectedCategory.textColor} flex items-center gap-2`}>
                                            <Truck size={14} /> Routing
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedCategory.centers.map((center, idx) => (
                                        <div key={idx} className="bg-black/20 border border-white/5 hover:border-white/20 transition-all rounded-2xl p-6 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-[#4ade80] transition-colors">{center.name}</h4>
                                                    <p className={`text-xs font-medium ${selectedCategory.textColor}`}>{center.type}</p>
                                                </div>
                                                <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono text-gray-400">
                                                    {center.dist}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <MapPin size={14} />
                                                        <span>{center.ward}</span>
                                                    </div>
                                                    <div className="bg-[#4ade80]/10 border border-[#4ade80]/20 px-2 py-0.5 rounded text-[10px] font-bold text-[#4ade80] tracking-wider uppercase">
                                                        {center.pricePerKg} / KG
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Phone size={14} />
                                                        <span>{center.phone}</span>
                                                    </div>
                                                    <button className="text-[10px] uppercase tracking-widest font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                        Dispatch <ExternalLink size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </Layout>
    );
}
