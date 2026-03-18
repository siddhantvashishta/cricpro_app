export interface Ground {
  id: string;
  name: string;
  shortName: string;
  distance: string;
  rating: string;
  bookings: number;
  price: string;
  type: string;
  isLive: boolean;
  isNight: boolean;
  lat: number;
  lng: number;
  image: string;
  // Detail fields
  address: string;
  reviews: number;
  tournaments: number;
  openHours: string;
  certification: string;
  amenities: string[]; // e.g. ['Zap', 'Coffee', 'Car', 'Wifi', 'ShowerHead']
  pitchType: string;
  boundarySize: string;
  lights: string;
}

export interface Match {
  id: string;
  title: string;
  teams: string;
  location: string;
  distance: string;
  time: string;
}

const NEARBY_GROUNDS: Ground[] = [
  { 
    id: '1', name: 'M. Chinnaswamy Stadium', shortName: 'Chinnaswamy', distance: '1.2 km', rating: '4.9', bookings: 342, price: '₹2500/hr', type: 'Stadium', isLive: true, isNight: true, lat: 12.9788, lng: 77.5996, 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400',
    address: 'MG Road, Bengaluru, Karnataka 560001', reviews: 1250, tournaments: 45, openHours: '6 AM - 11 PM', certification: 'ICC Elite', amenities: ['Zap', 'Coffee', 'Car', 'Wifi', 'ShowerHead'], pitchType: 'Natural Turf', boundarySize: '75m avg', lights: 'HID Floodlights'
  },
  { 
    id: '2', name: 'RSI Cricket Ground', shortName: 'RSI Ground', distance: '3.4 km', rating: '4.7', bookings: 128, price: '₹1200/hr', type: 'Open Ground', isLive: false, isNight: false, lat: 12.9738, lng: 77.6062, 
    image: 'https://images.unsplash.com/photo-1593341646654-2c77f0985c72?auto=format&fit=crop&q=80&w=400',
    address: 'Cubbon Road, Sivanchetti Gardens, Bengaluru', reviews: 450, tournaments: 12, openHours: '7 AM - 6 PM', certification: 'Pro', amenities: ['Car', 'Coffee'], pitchType: 'Hard Soil', boundarySize: '65m avg', lights: 'None'
  },
  { 
    id: '3', name: 'Just Cricket Academy, Yelahanka', shortName: 'Just Cricket', distance: '12.1 km', rating: '4.5', bookings: 210, price: 'Free', type: 'Practice Pitch', isLive: false, isNight: false, lat: 13.1143, lng: 77.6015, 
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400',
    address: 'Singanayakanahalli, Yelahanka, Bengaluru', reviews: 320, tournaments: 8, openHours: '5 AM - 7 PM', certification: 'Academy', amenities: ['Wifi', 'ShowerHead'], pitchType: 'Concrete/Matting', boundarySize: 'Nets Only', lights: 'LED Practice Lights'
  },
  { 
    id: '4', name: 'St. Joseph\'s Indian Ground', shortName: 'St. Joseph\'s', distance: '1.8 km', rating: '4.8', bookings: 95, price: '₹1500/hr', type: 'Stadium', isLive: false, isNight: true, lat: 12.9705, lng: 77.5944, 
    image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=400',
    address: 'Vittal Mallya Road, Bengaluru', reviews: 180, tournaments: 15, openHours: '6 AM - 10 PM', certification: 'Pro+', amenities: ['Zap', 'Car', 'Wifi'], pitchType: 'Natural Turf', boundarySize: '70m avg', lights: 'Standard Floodlights'
  },
  { 
    id: '5', name: 'Let\'s Play Turf', shortName: 'Let\'s Play', distance: '5.6 km', rating: '4.3', bookings: 220, price: '₹1000/hr', type: 'Turf', isLive: false, isNight: true, lat: 12.9352, lng: 77.6245, 
    image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=400',
    address: 'Koramangala 4th Block, Bengaluru', reviews: 560, tournaments: 20, openHours: '24/7', certification: 'Urban-Pro', amenities: ['Zap', 'Wifi', 'Coffee'], pitchType: 'Artificial Turf', boundarySize: '35m (Box)', lights: 'LED High-Mast'
  },
  { 
    id: '6', name: 'Active Arena', shortName: 'Active Arena', distance: '8.4 km', rating: '4.7', bookings: 180, price: '₹1400/hr', type: 'Turf', isLive: false, isNight: true, lat: 12.9382, lng: 77.6974, 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400',
    address: 'Marathahalli - Sarjapur Outer Ring Rd, Kadubeesanahalli', reviews: 290, tournaments: 14, openHours: '6 AM - 12 AM', certification: 'Pro', amenities: ['Zap', 'Car', 'ShowerHead'], pitchType: 'Artificial Turf', boundarySize: '40m (Box)', lights: 'LED Floodlights'
  },
  { 
    id: '7', name: 'PlayArena Sarjapur', shortName: 'PlayArena', distance: '10.2 km', rating: '4.8', bookings: 88, price: '₹1800/hr', type: 'Turf', isLive: true, isNight: true, lat: 12.9073, lng: 77.6698, 
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400',
    address: 'Kasavanahalli, Sarjapur Road, Bengaluru', reviews: 410, tournaments: 25, openHours: '6 AM - 11 PM', certification: 'Elite', amenities: ['Zap', 'Coffee', 'Car', 'Wifi', 'ShowerHead'], pitchType: 'Hybrid Turf', boundarySize: '50m avg', lights: 'Pro LED'
  },
  { 
    id: '8', name: 'BPCA Nets', shortName: 'BPCA', distance: '4.2 km', rating: '4.6', bookings: 145, price: 'Free', type: 'Practice Pitch', isLive: false, isNight: true, lat: 13.0068, lng: 77.5504, 
    image: 'https://images.unsplash.com/photo-1593341646654-2c77f0985c72?auto=format&fit=crop&q=80&w=400',
    address: 'Malleshwaram West, Ground Road, Bengaluru', reviews: 95, tournaments: 5, openHours: '6 AM - 9 PM', certification: 'Community', amenities: ['Car'], pitchType: 'Astro Turf', boundarySize: 'Nets Only', lights: 'Practice LED'
  },
  { 
    id: '9', name: 'Hombegowda BBMP Ground', shortName: 'Hombegowda', distance: '2.5 km', rating: '4.1', bookings: 75, price: '₹500/hr', type: 'Open Ground', isLive: false, isNight: false, lat: 12.9463, lng: 77.5852, 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400',
    address: 'Wilson Garden, Bengaluru', reviews: 150, tournaments: 10, openHours: '6 AM - 6 PM', certification: 'Govt Approved', amenities: ['Car'], pitchType: 'Red Soil', boundarySize: '60m avg', lights: 'None'
  },
  { 
    id: '10', name: 'Davanagere Turf', shortName: 'Davanagere', distance: '6.8 km', rating: '4.4', bookings: 110, price: '₹900/hr', type: 'Turf', isLive: false, isNight: true, lat: 12.9815, lng: 77.6412, 
    image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=400',
    address: 'Indiranagar 100 Feet Rd, Bengaluru', reviews: 200, tournaments: 18, openHours: '24/7', certification: 'Pro', amenities: ['Zap', 'Coffee', 'Wifi'], pitchType: 'Artificial Turf', boundarySize: '30m (Box)', lights: 'LED'
  },
];

const ACTIVE_MATCHES: Match[] = [
  { id: '1', title: 'KSCA T20 League', teams: 'RCB XI vs State XI', location: 'Chinnaswamy', distance: '1.2 km away', time: 'Live Now' },
  { id: '2', title: 'IT Corporate Cup', teams: 'Techies XI vs Startups', location: 'RSI Ground', distance: '3.4 km away', time: 'Toss delayed' }
];

export const mapService = {
  getNearbyGrounds: async (): Promise<Ground[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(NEARBY_GROUNDS), 800);
    });
  },

  getActiveMatches: async (): Promise<Match[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(ACTIVE_MATCHES), 600);
    });
  },

  getWeather: async (lat: number, lng: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: '65%',
        wind: '12 km/h'
      }), 400);
    });
  }
};
