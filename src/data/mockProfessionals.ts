export interface Professional {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
    matches: number;
    specialty: string;
    price: string;
    priceVal: number; // For filtering
    location: string;
    category: 'Scorers' | 'Umpires' | 'Commentators' | 'Streamers' | 'Organisers' | 'Academies' | 'Grounds';
    tier: 'Elite' | 'Pro' | 'Rising'; // For filtering
}

export const MOCK_PROFESSIONALS: Professional[] = [
    // SCORERS
    { id: 's1', name: 'Arjun Mehta', verified: true, rating: 4.9, matches: 124, specialty: 'Elite Digital Scoring', price: '₹500/match', priceVal: 500, location: 'Indiranagar', category: 'Scorers', tier: 'Elite' },
    { id: 's2', name: 'Sanjay Gupta', verified: true, rating: 4.8, matches: 210, specialty: 'Tournament Specialist', price: '₹600/match', priceVal: 600, location: 'Jayanagar', category: 'Scorers', tier: 'Elite' },
    { id: 's3', name: 'Vikram Rao', verified: false, rating: 4.5, matches: 56, specialty: 'Club Level Scoring', price: '₹400/match', priceVal: 400, location: 'Whitefield', category: 'Scorers', tier: 'Pro' },
    { id: 's4', name: 'Neha Sharma', verified: true, rating: 4.7, matches: 88, specialty: 'Live Stream Integration', price: '₹550/match', priceVal: 550, location: 'Koramangala', category: 'Scorers', tier: 'Pro' },
    { id: 's5', name: 'Amit Patel', verified: false, rating: 4.4, matches: 34, specialty: 'Manual & Digital', price: '₹450/match', priceVal: 450, location: 'HSR Layout', category: 'Scorers', tier: 'Pro' },
    { id: 's6', name: 'Rahul V.', verified: true, rating: 4.9, matches: 156, specialty: 'International Standard', price: '₹750/match', priceVal: 750, location: 'MG Road', category: 'Scorers', tier: 'Elite' },
    { id: 's7', name: 'Deepak K.', verified: false, rating: 4.3, matches: 22, specialty: 'Junior Leagues', price: '₹350/match', priceVal: 350, location: 'Electronic City', category: 'Scorers', tier: 'Pro' },
    { id: 's8', name: 'Megha S.', verified: true, rating: 4.6, matches: 67, specialty: 'Stats Analysis', price: '₹500/match', priceVal: 500, location: 'JP Nagar', category: 'Scorers', tier: 'Pro' },
    { id: 's9', name: 'Kushal T.', verified: true, rating: 4.8, matches: 94, specialty: 'Pro League Scoring', price: '₹650/match', priceVal: 650, location: 'BTM Layout', category: 'Scorers', tier: 'Elite' },
    { id: 's10', name: 'Pankaj G.', verified: false, rating: 4.1, matches: 15, specialty: 'Weekend Matches', price: '₹400/match', priceVal: 400, location: 'Hebbal', category: 'Scorers', tier: 'Pro' },

    // UMPIRES
    { id: 'u1', name: 'Rohan Sharma', verified: true, rating: 4.7, matches: 85, specialty: 'BCCI Level 1 Certified', price: '₹1200/match', priceVal: 1200, location: 'Whitefield', category: 'Umpires', tier: 'Pro' },
    { id: 'u2', name: 'Michael D.', verified: true, rating: 4.9, matches: 320, specialty: 'Corporate Pro League', price: '₹1500/match', priceVal: 1500, location: 'Indiranagar', category: 'Umpires', tier: 'Elite' },
    { id: 'u3', name: 'Rajesh Kumar', verified: false, rating: 4.4, matches: 45, specialty: 'Local Club Umpire', price: '₹800/match', priceVal: 800, location: 'Bannerghatta', category: 'Umpires', tier: 'Pro' },
    { id: 'u4', name: 'David Wilson', verified: true, rating: 4.8, matches: 112, specialty: 'T20 Specialist', price: '₹1300/match', priceVal: 1300, location: 'Jayanagar', category: 'Umpires', tier: 'Elite' },
    { id: 'u5', name: 'Suresh Raina', verified: false, rating: 4.2, matches: 30, specialty: 'School Tournaments', price: '₹700/match', priceVal: 700, location: 'Yeswanthpur', category: 'Umpires', tier: 'Pro' },
    { id: 'u6', name: 'Kevin Pietersen', verified: true, rating: 5.0, matches: 450, specialty: 'Legacy Umpire', price: '₹2500/match', priceVal: 2500, location: 'Lavelle Road', category: 'Umpires', tier: 'Elite' },
    { id: 'u7', name: 'Anil Kumble', verified: true, rating: 4.7, matches: 98, specialty: 'Spin Track Specialist', price: '₹1400/match', priceVal: 1400, location: 'Basavanagudi', category: 'Umpires', tier: 'Pro' },
    { id: 'u8', name: 'Venkat R.', verified: false, rating: 4.5, matches: 60, specialty: 'DRS Aware', price: '₹1000/match', priceVal: 1000, location: 'Malleshwaram', category: 'Umpires', tier: 'Pro' },
    { id: 'u9', name: 'Prasad M.', verified: true, rating: 4.6, matches: 75, specialty: 'Fair Play Expert', price: '₹1100/match', priceVal: 1100, location: 'Rajajinagar', category: 'Umpires', tier: 'Pro' },
    { id: 'u10', name: 'Nitin Menon', verified: true, rating: 4.9, matches: 200, specialty: 'Elite Panel', price: '₹2000/match', priceVal: 2000, location: 'Indiranagar', category: 'Umpires', tier: 'Elite' },

    // COMMENTATORS
    { id: 'c1', name: 'Surbhi Gupta', verified: true, rating: 4.8, matches: 142, specialty: 'Hindi/English Bilingual', price: '₹2000/match', priceVal: 2000, location: 'Koramangala', category: 'Commentators', tier: 'Elite' },
    { id: 'c2', name: 'Harsha B.', verified: true, rating: 5.0, matches: 1200, specialty: 'The Voice of Cricket', price: '₹50000/day', priceVal: 50000, location: 'Mumbai (Remote)', category: 'Commentators', tier: 'Elite' },
    { id: 'c3', name: 'Akash Chopra', verified: true, rating: 4.7, matches: 250, specialty: 'Technical Analysis', price: '₹5000/match', priceVal: 5000, location: 'Basaveshwara Nagar', category: 'Commentators', tier: 'Pro' },
    { id: 'c4', name: 'Mayur J.', verified: false, rating: 4.3, matches: 35, specialty: 'Regional Kannada', price: '₹1500/match', priceVal: 1500, location: 'Banashankari', category: 'Commentators', tier: 'Pro' },
    { id: 'c5', name: 'Sarah Khan', verified: true, rating: 4.6, matches: 88, specialty: 'Womens Cricket Expert', price: '₹2500/match', priceVal: 2500, location: 'HSR Layout', category: 'Commentators', tier: 'Pro' },
    { id: 'c6', name: 'Ricky P.', verified: false, rating: 4.1, matches: 12, specialty: 'Energetic Hybrid', price: '₹1200/match', priceVal: 1200, location: 'Indiranagar', category: 'Commentators', tier: 'Pro' },
    { id: 'c7', name: 'Gautam G.', verified: true, rating: 4.9, matches: 400, specialty: 'Aggressive Analysis', price: '₹6000/match', priceVal: 6000, location: 'Delhi (Remote)', category: 'Commentators', tier: 'Elite' },
    { id: 'c8', name: 'Irfan P.', verified: true, rating: 4.8, matches: 310, specialty: 'Player Insights', price: '₹4500/match', priceVal: 4500, location: 'Vadodara (Remote)', category: 'Commentators', tier: 'Elite' },
    { id: 'c9', name: 'Zainab A.', verified: true, rating: 4.7, matches: 156, specialty: 'Presenter & Comm', price: '₹3500/match', priceVal: 3500, location: 'Dubai (Remote)', category: 'Commentators', tier: 'Pro' },
    { id: 'c10', name: 'Local Bob', verified: false, rating: 3.9, matches: 8, specialty: 'Funny Commentary', price: '₹800/match', priceVal: 800, location: 'Sadashivnagar', category: 'Commentators', tier: 'Rising' },

    // STREAMERS
    { id: 'st1', name: 'Kunal Singh', verified: true, rating: 4.9, matches: 210, specialty: '4K Multi-Cam Setup', price: '₹5000/day', priceVal: 5000, location: 'Jayanagar', category: 'Streamers', tier: 'Elite' },
    { id: 'st2', name: 'LiveCric Pro', verified: true, rating: 4.7, matches: 450, specialty: 'Network Specialist', price: '₹8000/day', priceVal: 8000, location: 'Electronic City', category: 'Streamers', tier: 'Pro' },
    { id: 'st3', name: 'Vlog Cricket', verified: false, rating: 4.2, matches: 25, specialty: 'Budget 1080p', price: '₹2500/day', priceVal: 2500, location: 'BTM Layout', category: 'Streamers', tier: 'Pro' },
    { id: 'st4', name: 'SportsHub TV', verified: true, rating: 4.8, matches: 130, specialty: 'Drone & Graphics', price: '₹12000/day', priceVal: 12000, location: 'Sarjapur', category: 'Streamers', tier: 'Elite' },
    { id: 'st5', name: 'Rahul Streams', verified: false, rating: 4.5, matches: 48, specialty: 'Quick Setup', price: '₹3500/day', priceVal: 3500, location: 'Kalyan Nagar', category: 'Streamers', tier: 'Pro' },
    { id: 'st6', name: 'PixelPerfect', verified: true, rating: 4.9, matches: 88, specialty: 'Low Latency', price: '₹6000/day', priceVal: 6000, location: 'Indiranagar', category: 'Streamers', tier: 'Elite' },
    { id: 'st7', name: 'MatchDay Live', verified: true, rating: 4.6, matches: 200, specialty: 'Social Media Sync', price: '₹5500/day', priceVal: 5500, location: 'Whitefield', category: 'Streamers', tier: 'Pro' },
    { id: 'st8', name: 'StreamSquad', verified: false, rating: 4.3, matches: 60, specialty: 'Mobile Stream', price: '₹1500/day', priceVal: 1500, location: 'Basavanagudi', category: 'Streamers', tier: 'Pro' },
    { id: 'st9', name: 'Epic Broadcast', verified: true, rating: 5.0, matches: 50, specialty: 'Custom Overlays', price: '₹15000/day', priceVal: 15000, location: 'Lavelle Road', category: 'Streamers', tier: 'Elite' },
    { id: 'st10', name: 'CricDirect', verified: true, rating: 4.7, matches: 110, specialty: 'Basic Livestream', price: '₹4000/day', priceVal: 4000, location: 'Hebbal', category: 'Streamers', tier: 'Pro' },

    // ORGANISERS
    { id: 'o1', name: 'Priya Iyer', verified: true, rating: 4.9, matches: 45, specialty: 'Corporate Trophy Expert', price: '₹20000/event', priceVal: 20000, location: 'HSR Layout', category: 'Organisers', tier: 'Elite' },
    { id: 'o2', name: 'Vijay Mallya', verified: false, rating: 3.5, matches: 10, specialty: 'Luxury Leagues', price: '₹500000/event', priceVal: 500000, location: 'London (Remote)', category: 'Organisers', tier: 'Rising' },
    { id: 'o3', name: 'CricEvents Ltd.', verified: true, rating: 4.7, matches: 156, specialty: 'Community Tournaments', price: '₹15000/event', priceVal: 15000, location: 'Frazer Town', category: 'Organisers', tier: 'Pro' },
    { id: 'o4', name: 'Sports Desk', verified: true, rating: 4.8, matches: 88, specialty: 'School Sports Meet', price: '₹10000/event', priceVal: 10000, location: 'Ulsoor', category: 'Organisers', tier: 'Elite' },
    { id: 'o5', name: 'Sameer K.', verified: false, rating: 4.3, matches: 22, specialty: 'Sunday Leagues', price: '₹5000/event', priceVal: 5000, location: 'Marathahalli', category: 'Organisers', tier: 'Pro' },
    { id: 'o6', name: 'Elite Sports', verified: true, rating: 4.7, matches: 65, specialty: 'Night Cricket', price: '₹25000/event', priceVal: 25000, location: 'Indiranagar', category: 'Organisers', tier: 'Pro' },
    { id: 'o7', name: 'Grassroots Org', verified: true, rating: 4.5, matches: 210, specialty: 'Youth Development', price: '₹8000/event', priceVal: 8000, location: 'Chamarajpet', category: 'Organisers', tier: 'Pro' },
    { id: 'o8', name: 'League Master', verified: false, rating: 4.1, matches: 30, specialty: 'Knockout Specialist', price: '₹12000/event', priceVal: 12000, location: 'Yelahanka', category: 'Organisers', tier: 'Pro' },
    { id: 'o9', name: 'Eventify', verified: true, rating: 4.6, matches: 42, specialty: 'One Day Cups', price: '₹15000/event', priceVal: 15000, location: 'Sadashivnagar', category: 'Organisers', tier: 'Pro' },
    { id: 'o10', name: 'Karan J.', verified: true, rating: 4.4, matches: 18, specialty: 'Internal Corporate', price: '₹10000/event', priceVal: 10000, location: 'Manyata Tech Park', category: 'Organisers', tier: 'Pro' },

    // ACADEMIES
    { id: 'a1', name: 'Rising Stars Academy', verified: true, rating: 4.8, matches: 500, specialty: 'U-16 Specialists', price: '₹3000/month', priceVal: 3000, location: 'Basavanagudi', category: 'Academies', tier: 'Elite' },
    { id: 'a2', name: 'National Cricket School', verified: true, rating: 4.9, matches: 1200, specialty: 'Ranji Preparation', price: '₹5000/month', priceVal: 5000, location: 'MG Road', category: 'Academies', tier: 'Elite' },
    { id: 'a3', name: 'Champions Hub', verified: false, rating: 4.4, matches: 150, specialty: 'General Coaching', price: '₹2000/month', priceVal: 2000, location: 'Brookefield', category: 'Academies', tier: 'Pro' },
    { id: 'a4', name: 'Fast Lane Academy', verified: true, rating: 4.7, matches: 280, specialty: 'Fast Bowling Focus', price: '₹3500/month', priceVal: 3500, location: 'Koramangala', category: 'Academies', tier: 'Pro' },
    { id: 'a5', name: 'Spin Masters', verified: true, rating: 4.8, matches: 220, specialty: 'Leg Spin/Off Spin', price: '₹3500/month', priceVal: 3500, location: 'Richmond Town', category: 'Academies', tier: 'Elite' },
    { id: 'a6', name: 'Willow & Leather', verified: false, rating: 4.1, matches: 60, specialty: 'Batting Technique', price: '₹2500/month', priceVal: 2500, location: 'Vijayanagar', category: 'Academies', tier: 'Pro' },
    { id: 'a7', name: 'Elite Cricket Prep', verified: true, rating: 4.6, matches: 340, specialty: 'Personal Coaching', price: '₹8000/month', priceVal: 8000, location: 'Indiranagar', category: 'Academies', tier: 'Pro' },
    { id: 'a8', name: 'Unity Academy', verified: true, rating: 4.5, matches: 400, specialty: 'Team Dynamics', price: '₹3000/month', priceVal: 3000, location: 'Bannerghatta', category: 'Academies', tier: 'Pro' },
    { id: 'a9', name: 'Future Legends', verified: false, rating: 4.3, matches: 110, specialty: 'Summer Camps', price: '₹4000/season', priceVal: 4000, location: 'Hebbal', category: 'Academies', tier: 'Pro' },
    { id: 'a10', name: 'Cricket Foundation', verified: true, rating: 4.4, matches: 80, specialty: 'Beginner Basics', price: '₹1500/month', priceVal: 1500, location: 'Peenya', category: 'Academies', tier: 'Pro' },

    // GROUNDS
    { id: 'g1', name: 'Chinnaswamy (Local)', verified: true, rating: 5.0, matches: 1500, specialty: 'Floodlit Stadium', price: '₹25000/slot', priceVal: 25000, location: 'MG Road', category: 'Grounds', tier: 'Elite' },
    { id: 'g2', name: 'Skyview Arena', verified: true, rating: 4.7, matches: 450, specialty: 'Synthetic Pitch', price: '₹5000/slot', priceVal: 5000, location: 'Sarjapur', category: 'Grounds', tier: 'Pro' },
    { id: 'g3', name: 'Green Valley Oval', verified: false, rating: 4.3, matches: 120, specialty: 'Natural Grass', price: '₹4000/slot', priceVal: 4000, location: 'Kanakapura Road', category: 'Grounds', tier: 'Pro' },
    { id: 'g4', name: 'Corporate Heights', verified: true, rating: 4.6, matches: 800, specialty: 'VVIP Pavilion', price: '₹8000/slot', priceVal: 8000, location: 'Indiranagar', category: 'Grounds', tier: 'Pro' },
    { id: 'g5', name: 'Urban Turf 1', verified: true, rating: 4.8, matches: 320, specialty: 'Night Matches', price: '₹6000/slot', priceVal: 6000, location: 'HSR Layout', category: 'Grounds', tier: 'Elite' },
    { id: 'g6', name: 'Basavanagudi Turf', verified: false, rating: 4.4, matches: 210, specialty: 'Inner City Hub', price: '₹4500/slot', priceVal: 4500, location: 'Basavanagudi', category: 'Grounds', tier: 'Pro' },
    { id: 'g7', name: 'Whitefield Sports Complex', verified: true, rating: 4.5, matches: 600, specialty: 'Multi-Sport Facility', price: '₹7000/slot', priceVal: 7000, location: 'Whitefield', category: 'Grounds', tier: 'Pro' },
    { id: 'g8', name: 'Railway Stadium', verified: true, rating: 4.2, matches: 1000, specialty: 'Classic Ground', price: '₹3000/slot', priceVal: 3000, location: 'Yeswanthpur', category: 'Grounds', tier: 'Pro' },
    { id: 'g9', name: 'The Backyard Pitch', verified: false, rating: 4.9, matches: 45, specialty: 'Private Matches', price: '₹2500/slot', priceVal: 2500, location: 'Devanahalli', category: 'Grounds', tier: 'Elite' },
    { id: 'g10', name: 'Victory Grounds', verified: true, rating: 4.6, matches: 180, specialty: 'Well Maintained Outfield', price: '₹5500/slot', priceVal: 5500, location: 'Bannerghatta', category: 'Grounds', tier: 'Pro' },
];
