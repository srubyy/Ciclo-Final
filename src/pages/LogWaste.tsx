import React from 'react';
import Layout from '../layouts/Layout';
import WasteForm from '../components/WasteForm';
import WasteBadge from '../components/WasteBadge';
import { useWasteStore } from '../store/useWasteStore';
import { Trash2 } from 'lucide-react';

export default function LogWaste() {
    const { entries, removeEntry, profile } = useWasteStore();
    const recent = entries.slice(0, 10);
    
    // helper to get building name
    const getBuildingName = (id?: string) => {
        if (!id) return 'Entire Society';
        const building = profile.buildings?.find(b => b.id === id);
        return building ? building.name : 'Unknown Wing';
    };

    return (
        <Layout title="Log Waste" subtitle="Record today's society bulk waste collections — wet, dry & recyclable.">
            <div className="max-w-xl mx-auto">
                <WasteForm />

                <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 bg-[#141f18] border border-white/6 rounded-xl p-4">
                    <span className="text-xl">💡</span>
                    <div>
                        <p className="font-medium text-gray-300">Tip: Vendor estimates work</p>
                        <p>Ask your collection vendor for approximate weights, or use standard bin volume conversions (e.g., 1 large drum ≈ 50 kg wet waste).</p>
                    </div>
                </div>

                {recent.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-white mb-3">Recent Logs</h3>
                        <div className="space-y-2">
                            {recent.map((entry) => (
                                <div key={entry.id} className="bg-[#141f18] border border-white/6 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-white">{entry.date} <span className="text-xs text-gray-400 ml-2 border border-gray-600 rounded px-1.5 py-0.5">{getBuildingName(entry.buildingId)}</span></p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                            {entry.notes && <p className="text-xs text-gray-500">{entry.notes}</p>}
                                            {entry.nonSegregatedFlats ? (
                                                <p className="text-[10px] text-red-400 font-medium">⚠️ {entry.nonSegregatedFlats} unsegregated flats</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                        <WasteBadge type="wet" value={entry.wet} showLabel={false} />
                                        <WasteBadge type="dry" value={entry.dry} showLabel={false} />
                                        <WasteBadge type="recyclable" value={entry.recyclable} showLabel={false} />
                                        <button
                                            onClick={() => removeEntry(entry.id)}
                                            className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
