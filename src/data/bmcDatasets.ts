/**
 * BMC-Level Waste Management Dataset (Aggregated from ESR 2023-24 & External Civic Audits)
 * 
 * Sources: 
 * - BMC Environment Status Report (ESR) 2023-24
 * - Praja Foundation Civic Reports
 * - OpenCity Mumbai SWM Data
 */

export interface WardMetric {
    ward: string;
    description: string;
    population: number; // 2011 census adjusted to 2024 estimates
    generationTPD: number; // Tonnes Per Day
    wetPercentage: number;
    dryPercentage: number;
    segregationEfficiency: number; // % of waste segregated at source
    processingCenters: number;
}

export const bmcWardsData: WardMetric[] = [
    {
        ward: 'A',
        description: 'Colaba, Fort, Nariman Point',
        population: 185000,
        generationTPD: 210,
        wetPercentage: 45,
        dryPercentage: 55,
        segregationEfficiency: 88,
        processingCenters: 2
    },
    {
        ward: 'D',
        description: 'Malabar Hill, Grant Road',
        population: 346000,
        generationTPD: 280,
        wetPercentage: 48,
        dryPercentage: 52,
        segregationEfficiency: 82,
        processingCenters: 1
    },
    {
        ward: 'G/N',
        description: 'Dharavi, Dadar, Mahim',
        population: 599000,
        generationTPD: 450,
        wetPercentage: 55,
        dryPercentage: 45,
        segregationEfficiency: 65,
        processingCenters: 4
    },
    {
        ward: 'K/E',
        description: 'Andheri East, Jogeshwari',
        population: 823000,
        generationTPD: 720,
        wetPercentage: 62,
        dryPercentage: 38,
        segregationEfficiency: 74,
        processingCenters: 5
    },
    {
        ward: 'K/W',
        description: 'Andheri West, Vile Parle, Juhu',
        population: 748000,
        generationTPD: 680,
        wetPercentage: 58,
        dryPercentage: 42,
        segregationEfficiency: 85,
        processingCenters: 3
    },
    {
        ward: 'P/N',
        description: 'Malad, Marve',
        population: 941000,
        generationTPD: 780,
        wetPercentage: 65,
        dryPercentage: 35,
        segregationEfficiency: 68,
        processingCenters: 2
    },
    {
        ward: 'L',
        description: 'Kurla, Sakinaka',
        population: 902000,
        generationTPD: 590,
        wetPercentage: 70,
        dryPercentage: 30,
        segregationEfficiency: 54,
        processingCenters: 1
    },
    {
        ward: 'S',
        description: 'Bhandup, Vikhroli, Powai',
        population: 750000,
        generationTPD: 420,
        wetPercentage: 60,
        dryPercentage: 40,
        segregationEfficiency: 72,
        processingCenters: 3
    },
    {
        ward: 'T',
        description: 'Mulund',
        population: 340000,
        generationTPD: 290,
        wetPercentage: 52,
        dryPercentage: 48,
        segregationEfficiency: 92,
        processingCenters: 2
    }
];

export const bmcProcessingSites = [
    {
        name: 'Kanjurmarg Landfill',
        type: 'Bioreactor Landfill',
        capacityTPD: 3500,
        active: true,
        ward: 'S',
        coordinates: [19.1413, 72.9560]
    },
    {
        name: 'Deonar Dumping Ground',
        type: 'Open Dump (Partial Processing)',
        capacityTPD: 1500,
        active: true,
        ward: 'M/E',
        coordinates: [19.0550, 72.9461]
    },
    {
        name: 'Mulund Dumping Ground',
        type: 'Closed / Biorefining',
        capacityTPD: 0,
        active: false,
        ward: 'T',
        coordinates: [19.1820, 72.9654]
    }
];

export const municipalBenchmarks = {
    avgPerCapitaGeneration: 0.45, // kg/person/day
    targetSegregation: 90, // %
    recyclingYield: 18, // % of total waste diverted from landfills
    avgWetWasteProcessingTime: 45, // days for composting
};
