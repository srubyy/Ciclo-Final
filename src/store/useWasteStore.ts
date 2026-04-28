import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WasteEntry, SocietyProfile, WasteStats, FlatRecord } from '../types';

interface WasteStore {
    entries: WasteEntry[];
    flats: FlatRecord[];
    profile: SocietyProfile;
    addEntry: (entry: Omit<WasteEntry, 'id'>) => void;
    removeEntry: (id: string) => void;
    updateProfile: (profile: Partial<SocietyProfile>) => void;
    getStats: (entries: WasteEntry[]) => WasteStats;
    getWeeklyData: () => { date: string; wet: number; dry: number; recyclable: number; total: number }[];
    getMonthlyData: () => { month: string; wet: number; dry: number; recyclable: number; total: number }[];
    seedDemoData: (societyName?: string, ward?: string) => void;
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
}

function formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
}

export const useWasteStore = create<WasteStore>()(
    persist(
        (set, get) => ({
            entries: [],
            flats: [],
            profile: {
                societyName: '',
                totalHouseholds: 50,
                buildings: [],
                location: 'Mumbai',
                onboarded: false,
            },

            addEntry: (entry) =>
                set((state) => ({
                    entries: [{ ...entry, id: generateId() }, ...state.entries],
                })),

            removeEntry: (id) =>
                set((state) => ({
                    entries: state.entries.filter((e) => e.id !== id),
                })),

            updateProfile: (profileUpdate) =>
                set((state) => ({
                    profile: { ...state.profile, ...profileUpdate },
                })),

            getStats: (entries: WasteEntry[]): WasteStats => {
                if (!entries.length) {
                    return { totalWet: 0, totalDry: 0, totalRecyclable: 0, totalAll: 0, totalUnsegregatedFlats: 0, uniqueDays: 0, avgDaily: 0, perHousehold: 0, dryPercentage: 0, wetPercentage: 0, recyclablePercentage: 0 };
                }
                const totalWet = entries.reduce((s, e) => s + e.wet, 0);
                const totalDry = entries.reduce((s, e) => s + e.dry, 0);
                const totalRecyclable = entries.reduce((s, e) => s + e.recyclable, 0);
                const totalAll = totalWet + totalDry + totalRecyclable;
                const totalUnsegregatedFlats = entries.reduce((s, e) => s + (e.nonSegregatedFlats || 0), 0);

                // calculate unique days for daily average
                const uniqueDays = new Set(entries.map(e => e.date)).size;
                const avgDaily = uniqueDays ? totalAll / uniqueDays : 0;
                
                const totalHouseholds = get().profile.totalHouseholds || 1;
                return {
                    totalWet: parseFloat(totalWet.toFixed(2)),
                    totalDry: parseFloat(totalDry.toFixed(2)),
                    totalRecyclable: parseFloat(totalRecyclable.toFixed(2)),
                    totalAll: parseFloat(totalAll.toFixed(2)),
                    totalUnsegregatedFlats,
                    uniqueDays,
                    avgDaily: parseFloat(avgDaily.toFixed(2)),
                    perHousehold: parseFloat((avgDaily / totalHouseholds).toFixed(2)),
                    dryPercentage: totalAll ? parseFloat(((totalDry / totalAll) * 100).toFixed(1)) : 0,
                    wetPercentage: totalAll ? parseFloat(((totalWet / totalAll) * 100).toFixed(1)) : 0,
                    recyclablePercentage: totalAll ? parseFloat(((totalRecyclable / totalAll) * 100).toFixed(1)) : 0,
                };
            },

            getWeeklyData: () => {
                const entries = get().entries;
                const result: { date: string; wet: number; dry: number; recyclable: number; total: number }[] = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = formatDate(d);
                    const dayEntries = entries.filter((e) => e.date === dateStr);
                    const wet = parseFloat(dayEntries.reduce((s, e) => s + e.wet, 0).toFixed(2));
                    const dry = parseFloat(dayEntries.reduce((s, e) => s + e.dry, 0).toFixed(2));
                    const recyclable = parseFloat(dayEntries.reduce((s, e) => s + e.recyclable, 0).toFixed(2));
                    result.push({
                        date: d.toLocaleDateString('en', { weekday: 'short' }),
                        wet,
                        dry,
                        recyclable,
                        total: parseFloat((wet + dry + recyclable).toFixed(2)),
                    });
                }
                return result;
            },

            getMonthlyData: () => {
                const entries = get().entries;
                const months: Record<string, { wet: number; dry: number; recyclable: number }> = {};
                entries.forEach((e) => {
                    const month = e.date.substring(0, 7);
                    if (!months[month]) months[month] = { wet: 0, dry: 0, recyclable: 0 };
                    months[month].wet += e.wet;
                    months[month].dry += e.dry;
                    months[month].recyclable += e.recyclable;
                });
                return Object.entries(months)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .slice(-6)
                    .map(([month, data]) => ({
                        month: new Date(month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
                        wet: parseFloat(data.wet.toFixed(2)),
                        dry: parseFloat(data.dry.toFixed(2)),
                        recyclable: parseFloat(data.recyclable.toFixed(2)),
                        total: parseFloat((data.wet + data.dry + data.recyclable).toFixed(2)),
                    }));
            },

            seedDemoData: (societyName = 'Mayuresh Park', ward = 'S') => {
                console.log('Seeding demo data...', { societyName, ward });
                
                try {
                    // Defensive checks
                    const safeSocietyName = typeof societyName === 'string' ? societyName : 'Mayuresh Park';
                    const safeWard = typeof ward === 'string' ? ward : 'S';

                    const demoEntries: WasteEntry[] = [];
                    
                    // Realistic Ward Coordinates (Mumbai)
                    const wardCoords: Record<string, [number, number]> = {
                        'S': [19.145, 72.935],        // Bhandup/Kanjur
                        'K/E': [19.115, 72.875],   // Andheri East
                        'G/N': [19.035, 72.845],  // Dadar/Dharavi
                        'D': [18.965, 72.805],        // Malabar Hill
                        'H/W': [19.055, 72.835],   // Bandra West
                        'P/N': [19.185, 72.845],  // Malad
                        'A': [18.925, 72.825],        // Colaba
                        'K/W': [19.115, 72.825],   // Andheri West
                        'L': [19.075, 72.875],        // Kurla
                        'T': [19.175, 72.955],        // Mulund
                    };

                    const baseCoord = wardCoords[safeWard] || [19.076, 72.877];
                    const lat = baseCoord[0] + (Math.random() - 0.5) * 0.01;
                    const lng = baseCoord[1] + (Math.random() - 0.5) * 0.01;

                    const isHighCompliance = safeSocietyName.includes('Park') || safeSocietyName.includes('Heights') || safeSocietyName.includes('Lodha');
                    const wingCount = safeSocietyName.length % 2 === 0 ? 3 : 2;
                    const households = safeSocietyName.length * 4;

                    const mockBuildings = Array.from({ length: wingCount }).map((_, i) => ({
                        id: `b${i}`,
                        name: `Wing ${String.fromCharCode(65 + i)}`,
                        totalFlats: Math.floor(households / wingCount)
                    }));

                    for (let i = 29; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        mockBuildings.forEach(building => {
                            const baseWet = isHighCompliance ? 8 : 15;
                            const baseDry = isHighCompliance ? 4 : 10;
                            const wet = parseFloat((baseWet + Math.random() * 5).toFixed(2));
                            const dry = parseFloat((baseDry + Math.random() * 5).toFixed(2));
                            const recyclable = parseFloat((2.0 + Math.random() * 4).toFixed(2));
                            const nonSegregatedFlats = isHighCompliance ? (Math.random() > 0.8 ? 1 : 0) : Math.floor(Math.random() * 6);
                            demoEntries.push({ id: generateId(), date: formatDate(d), buildingId: building.id, wet, dry, recyclable, nonSegregatedFlats });
                        });
                    }

                    const mockFlats: FlatRecord[] = [];
                    const firstNames = ['Aditya', 'Sneha', 'Rajesh', 'Priya', 'Vikram', 'Anjali', 'Suresh', 'Meera'];
                    const lastNames = ['Patil', 'Kulkarni', 'Deshmukh', 'Pawar', 'Joshi', 'Sawant', 'Gokhale', 'Mane'];

                    mockBuildings.forEach(building => {
                        for (let i = 1; i <= building.totalFlats; i++) {
                            const floor = Math.ceil(i / 4);
                            const flatNumber = `${floor}${String(i % 4 || 4).padStart(2, '0')}`;
                            const isNonCompliant = isHighCompliance ? Math.random() > 0.9 : Math.random() > 0.6;
                            mockFlats.push({
                                id: generateId(),
                                buildingId: building.id,
                                flatNumber,
                                residentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                                fines: isNonCompliant ? [{ id: generateId(), date: formatDate(new Date()), amount: 500, reason: 'Incomplete Segregation', status: 'unpaid' }] : [],
                                complianceScore: isNonCompliant ? 45 : 92,
                                recentHistory: []
                            });
                        }
                    });

                    set(() => ({
                        entries: demoEntries,
                        flats: mockFlats,
                        profile: { 
                            societyName: safeSocietyName, 
                            ward: safeWard, 
                            totalHouseholds: households, 
                            buildings: mockBuildings, 
                            location: 'Mumbai', 
                            onboarded: true,
                            coordinates: [lat, lng] as [number, number]
                        },
                    }));
                    console.log('Demo data seeded successfully!');
                } catch (error) {
                    console.error('Failed to seed demo data:', error);
                }
            },
        }),
        { 
            name: 'ciclo-waste-store',
            version: 2,
        }
    )
);
