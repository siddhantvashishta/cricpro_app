export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    description: string;
    specifications?: Record<string, string>;
    variants?: {
        sizes?: string[];
        weights?: string[];
        grips?: string[];
    };
    isTrending?: boolean;
    isFlashSale?: boolean;
    discount?: string;
}

export const STORE_CATEGORIES = [
    { id: 'bats', name: 'Bats', icon: 'cricket' },
    { id: 'balls', name: 'Balls', icon: 'baseball' },
    { id: 'gloves', name: 'Gloves', icon: 'hand-back-left' },
    { id: 'pads', name: 'Pads', icon: 'shield-outline' },
    { id: 'helmets', name: 'Helmets', icon: 'security' },
    { id: 'jerseys', name: 'Jerseys', icon: 'tshirt-crew' },
    { id: 'shoes', name: 'Shoes', icon: 'shoe-sneaker' },
    { id: 'training', name: 'Training', icon: 'weight-lifter' },
    { id: 'accessories', name: 'Accessories', icon: 'basketball-hoop' },
];

export const MOCK_PRODUCTS: Product[] = [
    // --- BATS (10) ---
    {
        id: 'b1',
        name: 'Kookaburra Ghost Pro Bat',
        brand: 'Kookaburra',
        price: 45000,
        originalPrice: 52000,
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=800',
        category: 'bats',
        description: 'The Ghost Pro is designed for the modern stroke maker. Featuring a massive profile and light pick-up.',
        specifications: {
            'Willow': 'Grade 1 English Willow',
            'Sweet Spot': 'Mid-to-Low Swell',
            'Weight Range': '2.8lb - 2.10lb',
            'Handle': '9-piece Sarawak Cane'
        },
        variants: { weights: ['2.8lb', '2.9lb', '2.10lb'], grips: ['Zig Zag', 'Octopus'] },
        isTrending: true,
        discount: '15% OFF'
    },
    {
        id: 'b2',
        name: 'SG Test Player Edition',
        brand: 'SG',
        price: 32499,
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'bats',
        description: 'Used by the legends of the game, the SG Test Player Edition provides unmatched balance and power.',
        specifications: {
            'Willow': 'Player Grade English Willow',
            'Handle': 'Sarawak Cane',
            'Edges': '38-40mm',
            'Spin': 'High Spine'
        },
        isFlashSale: true,
        discount: '10%'
    },
    {
        id: 'b3',
        name: 'MRF Genius Grand Edition',
        brand: 'MRF',
        price: 57999,
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=800',
        category: 'bats',
        description: 'Elite level bat used by Virat Kohli. Exceptionally high spine and huge edges.',
        specifications: {
            'Willow': 'Reserved English Willow',
            'Profile': 'Full Profile',
            'Sweet Spot': 'Mid Swell',
            'Finish': 'Natural'
        }
    },
    {
        id: 'b4',
        name: 'Gray Nicolls Vapour 1500',
        brand: 'Gray Nicolls',
        price: 27899,
        originalPrice: 34999,
        rating: 4.7,
        reviews: 65,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'bats',
        description: 'A masterpiece of bat making. Extreme power focus with a massive sweet spot.',
        specifications: {
            'Willow': 'Grade 2 English Willow',
            'Sweet Spot': 'Low Swell',
            'Pick-up': 'Lightweight'
        },
        discount: '20% OFF'
    },
    {
        id: 'b5',
        name: 'SS Gladiator High Profile',
        brand: 'SS',
        price: 18450,
        rating: 4.6,
        reviews: 142,
        image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=800',
        category: 'bats',
        description: 'Classic SS shape with high spine and light pick up. Perfect for aggressive play.',
        specifications: {
            'Willow': 'Grade 3 English Willow',
            'Edges': '40mm+',
            'Profile': 'Concaved'
        }
    },
    {
        id: 'b6',
        name: 'Spartan Chris Gayle Edition',
        brand: 'Spartan',
        price: 22000,
        rating: 4.5,
        reviews: 55,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'bats',
        description: 'The Universe Boss Choice. Massive edges for massive sixes.',
        specifications: { 'Willow': 'English Willow' }
    },
    {
        id: 'b7',
        name: 'New Balance Burn 1280',
        brand: 'NB',
        price: 26000,
        rating: 4.7,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=800',
        category: 'bats',
        description: 'Lightweight pick up with huge power. Ideal for the busy batsman.',
        specifications: { 'Willow': 'Grade 2' }
    },
    {
        id: 'b8',
        name: 'DSC Intense Pro 1000',
        brand: 'DSC',
        price: 12500,
        rating: 4.4,
        reviews: 92,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'bats',
        description: 'Excellent value English Willow bat for club cricketers.',
        specifications: { 'Willow': 'Grade 4 English Willow' }
    },
    {
        id: 'b9',
        name: 'Adidas Incurza Elite',
        brand: 'Adidas',
        price: 38000,
        rating: 4.9,
        reviews: 50,
        image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=800',
        category: 'bats',
        description: 'Dynamic profile for the modern game. Massive sweet spot for maximum hitting power.',
        specifications: { 'Willow': 'Grade 1+' }
    },
    {
        id: 'b10',
        name: 'SS Ton Retro Elite',
        brand: 'SS',
        price: 21000,
        rating: 4.6,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'bats',
        description: 'Retro styling with performance. A fan favorite for its clean look and solid feel.',
        specifications: { 'Willow': 'Grade 2' }
    },

    // --- BALLS (10) ---
    {
        id: 'bl1',
        name: 'SG Test White Leather Ball',
        brand: 'SG',
        price: 849,
        rating: 4.8,
        reviews: 540,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Official test match quality ball. Hand stitched with premium aluminum tanned leather.',
        specifications: {
            'Type': '4-piece',
            'Weight': '156-160g',
            'Seam': 'Pronounced Hand-stitched',
            'Material': 'Alum-tanned Cowhide'
        },
        isTrending: true
    },
    {
        id: 'bl2',
        name: 'Kookaburra Turf Red Ball',
        brand: 'Kookaburra',
        price: 9500,
        rating: 5.0,
        reviews: 32,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'The choice of Test nations. Exceptional shape retention and durability.',
        specifications: { 'Type': 'Premium 4-piece' }
    },
    {
        id: 'bl3',
        name: 'Dukes Special County',
        brand: 'Dukes',
        price: 12000,
        rating: 4.9,
        reviews: 15,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'The preferred ball for English conditions. Hand stitched with extreme pronounced seam.',
        isFlashSale: true
    },
    {
        id: 'bl4',
        name: 'Kookaburra Pink Turf',
        brand: 'Kookaburra',
        price: 10500,
        rating: 4.8,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Designed for Day/Night Test matches. Exceptional visibility under lights.'
    },
    {
        id: 'bl5',
        name: 'SS Tournament Red',
        brand: 'SS',
        price: 450,
        rating: 4.3,
        reviews: 1200,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Reliable match ball for club cricket. Good shape retention.'
    },
    {
        id: 'bl6',
        name: 'Pro Hard Tennis Ball (12pk)',
        brand: 'Nivea',
        price: 1299,
        rating: 4.6,
        reviews: 3400,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Extra hard premium tennis balls for competitive street cricket.'
    },
    {
        id: 'bl7',
        name: 'SG League Red Leather',
        brand: 'SG',
        price: 650,
        rating: 4.5,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Ideal for league matches. Durable and consistent.'
    },
    {
        id: 'bl8',
        name: 'Weighted Training Ball',
        brand: 'Katchet',
        price: 1500,
        rating: 4.2,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: '250g weighted ball for strengthening bowling action.'
    },
    {
        id: 'bl9',
        name: 'Swing Wizard Training Ball',
        brand: 'Visi',
        price: 899,
        rating: 4.7,
        reviews: 110,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Half-smooth, half-rough ball to help practice swing bowling.'
    },
    {
        id: 'bl10',
        name: 'PVC Cricket Ball (6pk)',
        brand: 'GKI',
        price: 399,
        rating: 4.0,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800',
        category: 'balls',
        description: 'Safe practice balls for training indoors or for kids.'
    },

    // --- GLOVES (10) ---
    {
        id: 'g1',
        name: 'GM Chroma 808 Gloves',
        brand: 'GM',
        price: 4800,
        rating: 4.7,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Split finger design for maximum flexibility and airflow.',
        variants: { sizes: ['Mens', 'Youth', 'Boys'] }
    },
    {
        id: 'g2',
        name: 'Kookaburra Vapor Pro',
        brand: 'Kookaburra',
        price: 6500,
        rating: 4.9,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Elite level protection with premium sheep leather palm.',
        isTrending: true
    },
    {
        id: 'g3',
        name: 'SG Test Player Gloves',
        brand: 'SG',
        price: 3200,
        rating: 4.5,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Traditional sausage finger design for maximum shock absorption.'
    },
    {
        id: 'g4',
        name: 'Gray Nicolls Shockwave',
        brand: 'Gray Nicolls',
        price: 5400,
        rating: 4.6,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Modern design with added fiber protection on all fingers.'
    },
    {
        id: 'g5',
        name: 'Adidas XT 2.0 Elite',
        brand: 'Adidas',
        price: 7200,
        rating: 4.8,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Highest level protection used by international pros.'
    },
    {
        id: 'g6',
        name: 'SS Gladiator Hybrid',
        brand: 'SS',
        price: 2800,
        rating: 4.4,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Mix of split and sausage finger for best of both worlds.'
    },
    {
        id: 'g7',
        name: 'Spartan MSD Edition',
        brand: 'Spartan',
        price: 3500,
        rating: 4.6,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Inspired by Dhoni\'s preference for flexibility and comfort.'
    },
    {
        id: 'g8',
        name: 'DSC Condor Pro',
        brand: 'DSC',
        price: 1800,
        rating: 4.2,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Affordable club level gloves with decent protection.'
    },
    {
        id: 'g9',
        name: 'New Balance TC 1260',
        brand: 'NB',
        price: 5900,
        rating: 4.7,
        reviews: 50,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Premium look and elite feel. High density foam protection.'
    },
    {
        id: 'g10',
        name: 'SS Dragon Gloves',
        brand: 'SS',
        price: 1500,
        rating: 4.0,
        reviews: 560,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'gloves',
        description: 'Beginner level gloves, perfect for kids and casual matches.'
    },

    // --- PADS (10) ---
    {
        id: 'p1',
        name: 'SG Test Player Pads',
        brand: 'SG',
        price: 6800,
        rating: 4.8,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Ultra-lightweight with high density foam. Used in test cricket.'
    },
    {
        id: 'p2',
        name: 'Kookaburra Ghost Pro Pads',
        brand: 'Kookaburra',
        price: 8500,
        rating: 4.9,
        reviews: 34,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Sleek white design with premium protection. Extremely comfortable bolsters.'
    },
    {
        id: 'p3',
        name: 'Gray Nicolls Legend',
        brand: 'Gray Nicolls',
        price: 11000,
        rating: 5.0,
        reviews: 12,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'The pinnacle of leg guard design. Traditional look with space-age materials.'
    },
    {
        id: 'p4',
        name: 'Adidas XT 1.0 Pads',
        brand: 'Adidas',
        price: 9200,
        rating: 4.7,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Lightweight construction with reinforced cane for extra durability.'
    },
    {
        id: 'p5',
        name: 'GM Diamond 808',
        brand: 'GM',
        price: 5500,
        rating: 4.5,
        reviews: 112,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Traditional cane construction with modern bolsters.'
    },
    {
        id: 'p6',
        name: 'SS Gladiator Pads',
        brand: 'SS',
        price: 4800,
        rating: 4.6,
        reviews: 230,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Excellent wrap-around fit. Very popular in domestic circuits.'
    },
    {
        id: 'p7',
        name: 'New Balance Burn Pads',
        brand: 'NB',
        price: 7200,
        rating: 4.8,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Zero-bulk design for fast running between wickets.'
    },
    {
        id: 'p8',
        name: 'DSC Condor Pro Pads',
        brand: 'DSC',
        price: 3200,
        rating: 4.3,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Durable and lightweight. Great for budget-conscious players.'
    },
    {
        id: 'p9',
        name: 'Spartan MSD Pro Pads',
        brand: 'Spartan',
        price: 5900,
        rating: 4.7,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Designed for speed and protection.'
    },
    {
        id: 'p10',
        name: 'SS Dragon Pads',
        brand: 'SS',
        price: 1900,
        rating: 4.1,
        reviews: 670,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'pads',
        description: 'Perfect starter pads for high-school cricketers.'
    },

    // --- HELMETS (10) ---
    {
        id: 'h1',
        name: 'Masuri Vision Series Elite',
        brand: 'Masuri',
        price: 14500,
        rating: 5.0,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'The safest helmet in the world. Featuring Eye-Line Grille for extra protection.',
        isTrending: true
    },
    {
        id: 'h2',
        name: 'Shrey Masterclass Air',
        brand: 'Shrey',
        price: 9800,
        rating: 4.9,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Lightest professional helmet on the market. Titanium grille.'
    },
    {
        id: 'h3',
        name: 'GM Icon Helmet',
        brand: 'GM',
        price: 4500,
        rating: 4.4,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Traditional styling with modern safety standards. Steel grille.'
    },
    {
        id: 'h4',
        name: 'Kookaburra Pro 1200',
        brand: 'Kookaburra',
        price: 6200,
        rating: 4.6,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Excellent ventilation and fit. Trusted by club professionals.'
    },
    {
        id: 'h5',
        name: 'SG Test Helmet',
        brand: 'SG',
        price: 3200,
        rating: 4.3,
        reviews: 420,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Budget friendly pro-level helmet. High impact absorbing shell.'
    },
    {
        id: 'h6',
        name: 'Gray Nicolls Atomic',
        brand: 'Gray Nicolls',
        price: 5500,
        rating: 4.5,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Strong and lightweight. Advanced sizing system for perfect fit.'
    },
    {
        id: 'h7',
        name: 'Shrey Armor Senior',
        brand: 'Shrey',
        price: 3800,
        rating: 4.2,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Great protection for league cricket. Washable sweat band.'
    },
    {
        id: 'h8',
        name: 'Moonwalker Defender',
        brand: 'Moonwalker',
        price: 12000,
        rating: 4.8,
        reviews: 23,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Modern carbon fiber look. Ultra lightweight with maximum shock absorption.'
    },
    {
        id: 'h9',
        name: 'DSC Guard helmet',
        brand: 'DSC',
        price: 2500,
        rating: 4.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Standard protective helmet for club use.'
    },
    {
        id: 'h10',
        name: 'Masuri StemGuard',
        brand: 'Masuri',
        price: 4500,
        rating: 4.7,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800',
        category: 'helmets',
        description: 'Add-on protection for the back of the neck. Compatible with Masuri helmets.'
    },

    // --- JERSEYS (10) ---
    {
        id: 'j1',
        name: 'Official Team India T20 Jersey',
        brand: 'BCL',
        price: 4995,
        rating: 4.9,
        reviews: 2400,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'The official match jersey worn by Team India. Breathable fabric with quick-dry tech.',
        specifications: {
            'Fabric': '100% Recycled Polyester',
            'Technology': 'AEROREADY moisture-wicking',
            'Fit': 'Athletic Slim Fit',
            'Details': 'Heat-applied crest'
        },
        variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
        isTrending: true
    },
    {
        id: 'j2',
        name: 'Mumbai Indians Official Fan Jersey',
        brand: 'Adidas',
        price: 1999,
        rating: 4.7,
        reviews: 1200,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Show your support for the Paltan! Lightweight and comfortable for casual wear.'
    },
    {
        id: 'j3',
        name: 'CSK Whistle Podu Edition',
        brand: 'CSK',
        price: 2499,
        rating: 4.8,
        reviews: 3100,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Official yellow jersey. Designed for maximum movement and comfort.'
    },
    {
        id: 'j4',
        name: 'Retro 1992 World Cup Jersey',
        brand: 'Vintage',
        price: 2999,
        rating: 4.9,
        reviews: 560,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Iconic multi-colored design. A collector\'s item for cricket fans.'
    },
    {
        id: 'j5',
        name: 'RCB Official Home Kit',
        brand: 'Puma',
        price: 3999,
        rating: 4.6,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Play Bold! Premium fabric with golden embroidery detail.'
    },
    {
        id: 'j6',
        name: 'Elite Training Bib (6pk)',
        brand: 'ProGear',
        price: 1499,
        rating: 4.3,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'High visibility mesh bibs for team practice sessions.'
    },
    {
        id: 'j7',
        name: 'Full Sleeve Compression Shirt',
        brand: 'Under Armour',
        price: 2200,
        rating: 4.7,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Moisture-wicking base layer to keep you cool and supported.'
    },
    {
        id: 'j8',
        name: 'Club White Match Shirt',
        brand: 'SG',
        price: 899,
        rating: 4.2,
        reviews: 1200,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Classic white shirt for red ball cricket. Durable and breathable.'
    },
    {
        id: 'j9',
        name: 'Custom Team Polo',
        brand: 'CricPro',
        price: 1299,
        rating: 4.5,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Formal team polo for travel and off-field appearances.'
    },
    {
        id: 'j10',
        name: 'Lightweight Cricket Trousers',
        brand: 'SS',
        price: 1100,
        rating: 4.3,
        reviews: 540,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
        category: 'jerseys',
        description: 'Performance stretch fabric for easy diving and running.'
    },

    // --- SHOES (10) ---
    {
        id: 's1',
        name: 'Adidas Adizero Vector Spikes',
        brand: 'Adidas',
        price: 12999,
        rating: 4.9,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'The ultimate bowling spike. Targeted support for high-impact landing.',
        isTrending: true
    },
    {
        id: 's2',
        name: 'Asics Gel-Gully 7',
        brand: 'Asics',
        price: 9500,
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800',
        category: 'shoes',
        description: 'Versatile all-rounder shoe. Exceptional cushioning for long days in the field.'
    },
    {
        id: 's3',
        name: 'New Balance CK4040 D4 Spikes',
        brand: 'NB',
        price: 11000,
        rating: 4.7,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800',
        category: 'shoes',
        description: 'Support and durability for the hardest working fast bowlers.'
    },
    {
        id: 's4',
        name: 'Payntr Bodyshell Spikes',
        brand: 'Payntr',
        price: 8200,
        rating: 4.6,
        reviews: 54,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Modern, lightweight spike design with great traction.'
    },
    {
        id: 's5',
        name: 'Puma 22.1 Spikes',
        brand: 'Puma',
        price: 7500,
        rating: 4.5,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Explosive speed and agility. Ideal for batsmen and fielders.'
    },
    {
        id: 's6',
        name: 'Nike Domain 2 Cricket',
        brand: 'Nike',
        price: 6800,
        rating: 4.4,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Premium stability and grip for turf cricket.'
    },
    {
        id: 's7',
        name: 'SG Scorer Spike Shoes',
        brand: 'SG',
        price: 3500,
        rating: 4.2,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Reliable entry-level spikes for club matches.'
    },
    {
        id: 's8',
        name: 'Adidas 22YDS Rubber Soles',
        brand: 'Adidas',
        price: 4500,
        rating: 4.3,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Perfect for synthetic pitches and hard grounds.'
    },
    {
        id: 's9',
        name: 'SS Premium Rubber Cricket Shoes',
        brand: 'SS',
        price: 1800,
        rating: 4.0,
        reviews: 560,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Budget friendly shoes for recreational use.'
    },
    {
        id: 's10',
        name: 'Gel Insoles for Cricket',
        brand: 'Asics',
        price: 1200,
        rating: 4.7,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'shoes',
        description: 'Add-on comfort for long bowling spells.'
    },

    // --- TRAINING (10) ---
    {
        id: 't1',
        name: 'Fusion Skyer Training Bat',
        brand: 'Fusion',
        price: 3500,
        rating: 4.8,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'The ultimate tool for coaches to hit repeated high catches and fast grounders.'
    },
    {
        id: 't2',
        name: 'Katchet Training Board',
        brand: 'Katchet',
        price: 5200,
        rating: 4.9,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Simulate realistic deflections and improve your catching reflexes.'
    },
    {
        id: 't3',
        name: 'Pro Feed Bowling Machine',
        brand: 'Heater',
        price: 45000,
        rating: 4.7,
        reviews: 12,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Portable bowling machine for solo practice. Up to 110kmph speed.'
    },
    {
        id: 't4',
        name: 'Agility Ladder & Cone Set',
        brand: 'ProGear',
        price: 1299,
        rating: 4.5,
        reviews: 230,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Essential for improving footwork and coordination during practice.'
    },
    {
        id: 't5',
        name: 'Target Stumps (Spring Loaded)',
        brand: 'SG',
        price: 2800,
        rating: 4.6,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Perfect for bowling practice. Returns to position after impact.'
    },
    {
        id: 't6',
        name: 'Rebound Catching Net',
        brand: 'Rapid',
        price: 5900,
        rating: 4.4,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Large surface for reactive fielding practice.'
    },
    {
        id: 't7',
        name: 'Incrediball Soft Practice (6pk)',
        brand: 'Aero',
        price: 1500,
        rating: 4.7,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Safe for indoor use. Behaves like a real leather ball.'
    },
    {
        id: 't8',
        name: 'Bat Speed Weighted Insert',
        brand: 'ProGear',
        price: 899,
        rating: 4.2,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Build forearm strength and increase your bat speed.'
    },
    {
        id: 't9',
        name: 'Fielding Shadow Practice Mat',
        brand: 'Coach',
        price: 2500,
        rating: 4.1,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Helps in teaching correct body alignment for different fielding positions.'
    },
    {
        id: 't10',
        name: 'Bowling Action Trainer Band',
        brand: 'ProGear',
        price: 499,
        rating: 4.0,
        reviews: 112,
        image: 'https://images.unsplash.com/photo-1533658909121-7299042b3117?q=80&w=800',
        category: 'training',
        description: 'Resistance band for shoulder and arm strengthening.'
    },

    // --- ACCESSORIES (10) ---
    {
        id: 'a1',
        name: 'Anti-Scuff Bat Protection Tape',
        brand: 'GM',
        price: 350,
        rating: 4.6,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Keep your bat looking new and protect against moisture and cracks.'
    },
    {
        id: 'a2',
        name: 'Raw Linseed Oil (100ml)',
        brand: 'SG',
        price: 199,
        rating: 4.8,
        reviews: 1200,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Essential for knocking-in and maintaining your English Willow bat.'
    },
    {
        id: 'a3',
        name: 'Premium Hybrid Bat Grip',
        brand: 'Kookaburra',
        price: 299,
        rating: 4.7,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Maximum control and comfort. Available in multiple colors.'
    },
    {
        id: 'a4',
        name: 'Umpire Counter (4-dial)',
        brand: 'GKI',
        price: 450,
        rating: 4.5,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Keep track of balls, overs and wickets with precision.'
    },
    {
        id: 'a5',
        name: 'Match Scorebook (60 innings)',
        brand: 'SG',
        price: 250,
        rating: 4.4,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Detailed score tracking with bowler analysis sections.'
    },
    {
        id: 'a6',
        name: 'Elite Wheelie Kit Bag',
        brand: 'SS',
        price: 5800,
        rating: 4.8,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Large capacity bag for your entire cricket gear. Heavy duty wheels.'
    },
    {
        id: 'a7',
        name: 'Batting Thigh Guard (Dual)',
        brand: 'Adidas',
        price: 1800,
        rating: 4.6,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Ultra thin high-impact protection for your legs.'
    },
    {
        id: 'a8',
        name: 'Abdominal Guard (Pro Level)',
        brand: 'Kookaburra',
        price: 450,
        rating: 4.5,
        reviews: 560,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Highest level groin protection. Ergonomically shaped.'
    },
    {
        id: 'a9',
        name: 'Grip Cone Applicator',
        brand: 'DSC',
        price: 399,
        rating: 4.3,
        reviews: 110,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Apply grips to your bat handle in seconds without hassle.'
    },
    {
        id: 'a10',
        name: 'Cricket Ball Mallet',
        brand: 'Gray Nicolls',
        price: 550,
        rating: 4.6,
        reviews: 230,
        image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800',
        category: 'accessories',
        description: 'Dual sided wooden mallet for knocking-in and hardening bat edges.'
    }
];
