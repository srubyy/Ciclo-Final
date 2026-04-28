import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useWasteStore } from '../store/useWasteStore';

interface WasteFormProps {
    onSuccess?: () => void;
}

export default function WasteForm({ onSuccess }: WasteFormProps) {
    const addEntry = useWasteStore((s) => s.addEntry);
    const profile = useWasteStore((s) => s.profile);
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], buildingId: '', wet: '', dry: '', recyclable: '', nonSegregatedFlats: '', notes: '' });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const wet = parseFloat(form.wet) || 0;
        const dry = parseFloat(form.dry) || 0;
        const recyclable = parseFloat(form.recyclable) || 0;
        const nonSegregatedFlats = parseInt(form.nonSegregatedFlats, 10) || 0;
        if (wet + dry + recyclable === 0) return;
        addEntry({ date: form.date, buildingId: form.buildingId || undefined, wet, dry, recyclable, nonSegregatedFlats, notes: form.notes });
        setForm({ date: new Date().toISOString().split('T')[0], buildingId: '', wet: '', dry: '', recyclable: '', nonSegregatedFlats: '', notes: '' });
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onSuccess?.(); }, 1500);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141f18] rounded-2xl border border-white/8 p-6 space-y-5"
        >
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                    />
                </div>
                {profile.buildings && profile.buildings.length > 0 && (
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Building/Wing</label>
                        <select
                            value={form.buildingId}
                            onChange={(e) => setForm((f) => ({ ...f, buildingId: e.target.value }))}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                        >
                            <option value="">Entire Society</option>
                            {profile.buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name} ({b.totalFlats} flats)</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    { key: 'wet', label: '🫧 Wet', hint: 'Biodegradable', accent: 'focus:border-teal-400/50' },
                    { key: 'dry', label: '🧴 Dry', hint: 'Non-recyclable', accent: 'focus:border-amber-400/50' },
                    { key: 'recyclable', label: '♻️ Recyclable', hint: 'Clean plastics, paper', accent: 'focus:border-blue-400/50' },
                ].map(({ key, label, hint, accent }) => (
                    <div key={key} className="space-y-1">
                        <label className="text-xs text-gray-400">{label}</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={form[key as 'wet' | 'dry' | 'recyclable']}
                            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                            className={`w-full bg-black/30 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none ${accent} transition-colors`}
                        />
                        <span className="text-[10px] text-gray-600">{hint} · kg</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Notes (optional)</label>
                    <input
                        type="text"
                        placeholder="e.g. Extra plastic from deliveries..."
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Non-Segregated Flats</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.nonSegregatedFlats}
                        onChange={(e) => setForm((f) => ({ ...f, nonSegregatedFlats: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-400/50 transition-colors"
                    />
                </div>
            </div>

            <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${success
                        ? 'bg-green-500 text-white'
                        : 'bg-[#4ade80] text-[#0a120d] hover:bg-[#22c55e]'
                    }`}
            >
                <PlusCircle size={18} />
                {success ? '✓ Logged Successfully!' : 'Log Waste Entry'}
            </motion.button>
        </motion.form>
    );
}
