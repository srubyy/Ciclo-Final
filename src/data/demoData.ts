export const wards = ['S', 'K/E', 'G/N', 'D', 'H/W', 'P/N', 'A', 'K/W', 'L', 'T'];

export const societiesByWard: Record<string, string[]> = {
    'S': ['Mayuresh Park', 'Neptune Living Point', 'Dreams Complex'],
    'K/E': ['Vasant Oasis', 'Kalpataru Estate', 'Oberoi Splendor'],
    'G/N': ['Kohinoor Square', 'Ruparel Orion', 'Sugee Sadan'],
    'D': ['Lodha Altamount', 'Sea Face Park', 'Imperial Towers'],
    'H/W': ['Bandra Reclamation', 'Mount Mary CHS', 'Carter Road Residency'],
    'P/N': ['Mindspace Heights', 'Liberty Garden', 'Raheja Exotica'],
    'A': ['Colaba Heritage', 'Marine Drive Residency'],
    'K/W': ['Juhu Vile Parle', 'Versova Heights'],
    'L': ['Kurla Complex', 'Phoenix Heights'],
    'T': ['Mulund Meadows', 'Thane Border CHS']
};

export const wardMetadata: Record<string, { totalSocieties: number, complianceRate: number, tonnage: number }> = {
    'S': { totalSocieties: 142, complianceRate: 74, tonnage: 42.5 },
    'K/E': { totalSocieties: 215, complianceRate: 82, tonnage: 68.2 },
    'G/N': { totalSocieties: 188, complianceRate: 65, tonnage: 55.4 },
    'D': { totalSocieties: 95, complianceRate: 91, tonnage: 28.7 },
    'H/W': { totalSocieties: 164, complianceRate: 78, tonnage: 48.9 },
    'P/N': { totalSocieties: 230, complianceRate: 71, tonnage: 72.1 },
    'A': { totalSocieties: 80, complianceRate: 88, tonnage: 21.0 },
    'K/W': { totalSocieties: 190, complianceRate: 85, tonnage: 68.0 },
    'L': { totalSocieties: 250, complianceRate: 54, tonnage: 59.0 },
    'T': { totalSocieties: 120, complianceRate: 92, tonnage: 29.0 },
};
