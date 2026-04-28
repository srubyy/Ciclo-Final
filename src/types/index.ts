export type WasteCategory = 'wet' | 'dry' | 'recyclable';

export interface Fine {
    id: string;
    date: string;
    amount: number;
    reason: string;
    status: 'paid' | 'unpaid';
}

export interface FlatRecord {
    id: string;
    buildingId: string;
    flatNumber: string;
    residentName: string;
    fines: Fine[];
    complianceScore: number;
    recentHistory: { id: string; date: string; wet: number; dry: number; recyclable: number; segregated: boolean }[];
}

export interface Building {
    id: string;
    name: string;
    totalFlats: number;
}

export interface WasteEntry {
    id: string;
    date: string; // ISO date string YYYY-MM-DD
    buildingId?: string; // which building this log belongs to (optional for backward comp)
    wet: number;   // kg
    dry: number;   // kg
    recyclable: number; // kg
    nonSegregatedFlats?: number; // count of flats that failed to segregate
    notes?: string;
}

export interface SocietyProfile {
    societyName: string;
    totalHouseholds: number;
    buildings: Building[];
    location: string;
    onboarded: boolean;
    ward?: string;
    coordinates?: [number, number];
}

export interface WasteStats {
    totalWet: number;
    totalDry: number;
    totalRecyclable: number;
    totalAll: number;
    totalUnsegregatedFlats: number;
    uniqueDays: number;
    avgDaily: number;
    perHousehold: number;
    dryPercentage: number;
    wetPercentage: number;
    recyclablePercentage: number;
}

export interface Tip {
    id: string;
    category: WasteCategory | 'general';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    icon: string;
}

export interface LearnArticle {
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    icon: string;
    readTime: number;
}
