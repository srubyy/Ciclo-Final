import { Tip, WasteStats, LearnArticle } from '../types';

export function generateTips(stats: WasteStats): Tip[] {
    const tips: Tip[] = [];

    if (stats.dryPercentage > 30) {
        tips.push({
            id: 't1',
            category: 'dry',
            title: 'Switch to Reusable Bags',
            description: 'Your dry waste exceeds 30% of total output. Replace single-use plastic bags with cloth or jute bags for daily shopping.',
            impact: 'high',
            icon: '🛍️',
        });
    }
    if (stats.dryPercentage > 20) {
        tips.push({
            id: 't2',
            category: 'dry',
            title: 'Refuse Single-Use Plastics',
            description: 'Carry a reusable water bottle and refuse plastic straws, cutlery, and wrappers when ordering or shopping.',
            impact: 'high',
            icon: '♻️',
        });
    }
    if (stats.wetPercentage > 50) {
        tips.push({
            id: 't3',
            category: 'wet',
            title: 'Start Home Composting',
            description: 'Your wet waste is high. Start a compost bin with kitchen scraps — it converts food waste into rich fertilizer.',
            impact: 'high',
            icon: '🌱',
        });
    }
    if (stats.wetPercentage > 40) {
        tips.push({
            id: 't4',
            category: 'wet',
            title: 'Plan Meals in Advance',
            description: 'Reduce food waste by planning weekly meals. Buy only what you need to avoid spoilage and excess cooking.',
            impact: 'medium',
            icon: '🥗',
        });
    }
    if (stats.recyclablePercentage < 15 && stats.totalAll > 0) {
        tips.push({
            id: 't5',
            category: 'recyclable',
            title: 'Improve Segregation Habits',
            description: 'Your recyclable capture rate is low. Clean plastic bottles, paper, and glass before placing in the recyclables bin.',
            impact: 'medium',
            icon: '🔄',
        });
    }
    if (stats.avgDaily > 1.5) {
        tips.push({
            id: 't6',
            category: 'general',
            title: 'Buy in Bulk, Reduce Packaging',
            description: 'Your daily average is above 1.5 kg. Purchasing staples in bulk reduces packaging waste significantly.',
            impact: 'medium',
            icon: '🏪',
        });
    }
    if (stats.perHousehold > 1.5) {
        tips.push({
            id: 't7',
            category: 'general',
            title: 'Adopt the Zero-Waste 5Rs',
            description: 'Per household waste is high. Encourage Refuse, Reduce, Reuse, Recycle, and Rot (compost) in residents\' daily life.',
            impact: 'high',
            icon: '🌍',
        });
    }

    // Always include a few general tips
    tips.push(
        {
            id: 't8',
            category: 'general',
            title: 'Use Both Sides of Paper',
            description: 'Before recycling paper, use both sides for notes or drafts. Small changes accumulate into meaningful reduction.',
            impact: 'low',
            icon: '📄',
        },
        {
            id: 't9',
            category: 'wet',
            title: 'Store Food Properly',
            description: 'Use airtight containers in the fridge to extend food shelf life and prevent unnecessary spoilage.',
            impact: 'low',
            icon: '🥡',
        },
        {
            id: 't10',
            category: 'recyclable',
            title: 'Rinse Before Recycling',
            description: 'Contaminated recyclables (soiled plastics, greasy paper) end up in landfills. Always rinse containers before recycling.',
            impact: 'medium',
            icon: '🚿',
        }
    );

    return tips;
}

export const learnArticles: LearnArticle[] = [
    {
        id: 'a1',
        title: 'Wet vs. Dry: Know Your Waste',
        category: 'Segregation Basics',
        summary: 'Understanding the fundamental difference between wet and dry waste is the first step to effective society-level management.',
        content: 'Wet waste includes all biodegradable items: vegetable peels, fruit scraps, cooked food leftovers, tea/coffee grounds, and garden trimmings. Dry waste encompasses non-biodegradable materials that can still be recycled or must be sent to landfill — plastic wrappers, packaging, cardboard, glass bottles, and metal cans. The key rule: keep them separate from the point of generation for easier vendor pick-ups.',
        icon: '🗑️',
        readTime: 3,
    },
    {
        id: 'a2',
        title: 'The Plastic Problem in Societies',
        category: 'Plastics',
        summary: 'Single-use plastics dominate residential dry waste. Here\'s how to identify, reduce, and responsibly manage them.',
        content: 'Survey findings across Mumbai societies reveal that single-use plastics — bags, sachets, wrappers — constitute up to 40% of dry waste. To reduce: organize campaigns for cloth bags, work with vendors to reduce packaging, and set up designated plastic collection bins. When unavoidable, ensure plastics are clean and dry before placing in the society\'s recyclables bin.',
        icon: '🔬',
        readTime: 4,
    },
    {
        id: 'a3',
        title: 'Composting at Home',
        category: 'Wet Waste',
        summary: 'Transform kitchen scraps into nutrient-rich compost with a simple bin setup requiring just 10 minutes a week.',
        content: 'A basic compost bin needs: a ventilated container, brown materials (dry leaves, shredded paper) and green materials (kitchen scraps). Layer browns and greens in equal parts, keep moist, and turn weekly. In 6-8 weeks, you have compost for your plants. Items to compost: vegetable peels, eggshells, coffee grounds, fruit scraps. Avoid: meat, dairy, and oily foods.',
        icon: '🌱',
        readTime: 5,
    },
    {
        id: 'a4',
        title: 'Recycling Right: The Contamination Problem',
        category: 'Recycling',
        summary: 'Contaminated recyclables end up in landfills. Learn which materials are truly recyclable in Indian cities.',
        content: 'Recyclable dry waste includes: clean PET bottles (#1), HDPE containers (#2), paper/cardboard, glass bottles, aluminum cans, and ferrous metals. Non-recyclable dry waste includes: soiled plastics, composite packaging (chips bags, tetra packs), ceramic, styrofoam, and broken glass. The golden rule: when in doubt, throw it in landfill waste rather than contaminate a recyclable batch.',
        icon: '♻️',
        readTime: 4,
    },
    {
        id: 'a5',
        title: 'SDGs and Your Society',
        category: 'Sustainability',
        summary: 'How your daily society waste logging directly contributes to UN Sustainable Development Goals 11, 12, and 13.',
        content: 'SDG 12 (Responsible Consumption) calls for halving per capita food waste by 2030. SDG 11 (Sustainable Cities) requires accessible waste management for all urban residential communities. SDG 13 (Climate Action) recognizes that organic waste in landfills generates methane — a greenhouse gas 25x more potent than CO₂. By tracking and reducing your society\'s waste, you are a frontline actor in achieving these global goals.',
        icon: '🌍',
        readTime: 3,
    },
    {
        id: 'a6',
        title: 'Understanding Your Society Waste Analytics',
        category: 'App Guide',
        summary: 'Make the most of Ciclo\'s analytics — learn what each chart and metric means for your society management.',
        content: 'The composition pie chart shows the percentage split between wet, dry, and recyclable waste. Ideally, aim for: Wet < 50% (the rest composted within premises or properly processed), Dry < 20%, Recyclable > 30%. The weekly trend chart reveals peak generation days. The district benchmark compares your per-household average against surveyed residential complexes in Mumbai. Use these insights to optimize vendor contracts and set reduction targets.',
        icon: '📊',
        readTime: 4,
    },
];
