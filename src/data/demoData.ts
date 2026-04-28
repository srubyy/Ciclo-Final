export const wards = ['S', 'K-East', 'G-North', 'D', 'H-West', 'P-North'];

export const societiesByWard: Record<string, string[]> = {
    'S': ['Mayuresh Park', 'Neptune Living Point', 'Dreams Complex'],
    'K-East': ['Vasant Oasis', 'Kalpataru Estate', 'Oberoi Splendor'],
    'G-North': ['Kohinoor Square', 'Ruparel Orion', 'Sugee Sadan'],
    'D': ['Lodha Altamount', 'Sea Face Park', 'Imperial Towers'],
    'H-West': ['Bandra Reclamation', 'Mount Mary CHS', 'Carter Road Residency'],
    'P-North': ['Mindspace Heights', 'Liberty Garden', 'Raheja Exotica'],
};

export const wardMetadata: Record<string, { totalSocieties: number, complianceRate: number, tonnage: number }> = {
    'S': { totalSocieties: 142, complianceRate: 74, tonnage: 42.5 },
    'K-East': { totalSocieties: 215, complianceRate: 82, tonnage: 68.2 },
    'G-North': { totalSocieties: 188, complianceRate: 65, tonnage: 55.4 },
    'D': { totalSocieties: 95, complianceRate: 91, tonnage: 28.7 },
    'H-West': { totalSocieties: 164, complianceRate: 78, tonnage: 48.9 },
    'P-North': { totalSocieties: 230, complianceRate: 71, tonnage: 72.1 },
};
