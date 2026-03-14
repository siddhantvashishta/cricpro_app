export type LookingType = 'Opponent' | 'Recruitment' | 'Player';

export interface LookingPost {
    id: string;
    playerId: string;
    type: LookingType;
    teamName: string;
    description: string;
    date: string;
    ground: string;
    timeAgo: string;
    distance: string;
    rightIconType: 'VS' | 'Person';
    requirementText?: string;
}

export const MOCK_LOOKING_POSTS: LookingPost[] = [
    // --- Opponents (10 Items) ---
    { id: 'opp_1', playerId: 'p1', type: 'Opponent', teamName: "Darshan's team (Mcca Warriors)", description: 'is looking for an opponent for a friendly T20.', date: 'Sat, Mar 07 2026 | 12:30 PM', ground: 'Open ground', timeAgo: '2m ago', distance: '2 KM', rightIconType: 'VS' },
    { id: 'opp_2', playerId: 'p2', type: 'Opponent', teamName: "Vikram's XI (Strikers)", description: 'Looking for a competitive match this Sunday.', date: 'Sun, Mar 08 2026 | 09:00 AM', ground: 'Central Park', timeAgo: '15m ago', distance: '5 KM', rightIconType: 'VS' },
    { id: 'opp_3', playerId: 'p3', type: 'Opponent', teamName: "The Mavericks", description: 'Challenge accepted! Who is ready to play?', date: 'Sat, Mar 07 2026 | 04:00 PM', ground: 'Sports Complex', timeAgo: '30m ago', distance: '8 KM', rightIconType: 'VS' },
    { id: 'opp_4', playerId: 'p4', type: 'Opponent', teamName: "Blue Tigers", description: 'Searching for a pro-level opponent.', date: 'Mon, Mar 09 2026 | 07:00 AM', ground: 'Diamond Grove', timeAgo: '1h ago', distance: '12 KM', rightIconType: 'VS' },
    { id: 'opp_5', playerId: 'p5', type: 'Opponent', teamName: "Green Valley CC", description: 'Weekend warrior match. 20 overs a side.', date: 'Sun, Mar 08 2026 | 10:30 AM', ground: 'Green Valley', timeAgo: '2h ago', distance: '3 KM', rightIconType: 'VS' },
    { id: 'opp_6', playerId: 'p6', type: 'Opponent', teamName: "Thunderbolts", description: 'Fast-paced match wanted. Pitch is bouncy!', date: 'Tue, Mar 10 2026 | 02:00 PM', ground: 'Thunder Dome', timeAgo: '3h ago', distance: '15 KM', rightIconType: 'VS' },
    { id: 'opp_7', playerId: 'p7', type: 'Opponent', teamName: "Rising Stars", description: 'Under-19 team looking for experience.', date: 'Sat, Mar 07 2026 | 11:00 AM', ground: 'Youth Academy', timeAgo: '4h ago', distance: '6 KM', rightIconType: 'VS' },
    { id: 'opp_8', playerId: 'p8', type: 'Opponent', teamName: "Corporate Kings", description: 'After-office lights match. 15 overs.', date: 'Wed, Mar 11 2026 | 06:30 PM', ground: 'Skyline Turf', timeAgo: '5h ago', distance: '1 KM', rightIconType: 'VS' },
    { id: 'opp_9', playerId: 'p9', type: 'Opponent', teamName: "Night Riders", description: 'Floodlit match challenge.', date: 'Fri, Mar 13 2026 | 08:00 PM', ground: 'Moonlight Arena', timeAgo: '6h ago', distance: '9 KM', rightIconType: 'VS' },
    { id: 'opp_10', playerId: 'p10', type: 'Opponent', teamName: "Street Warriors", description: 'Gully cricket style match wanted.', date: 'Sat, Mar 07 2026 | 05:00 PM', ground: 'Sector 4 Street', timeAgo: '7h ago', distance: '0.5 KM', rightIconType: 'VS' },

    // --- Teams to Join / Recruitment (10 Items) ---
    { id: 'rec_1', playerId: 'r1', type: 'Recruitment', teamName: "Bengaluru Super Giants (BSM)", description: 'is looking for an All-rounder (None) to join.', date: 'Sun, Mar 08 2026', ground: 'Kanteerava Stadium', requirementText: 'All-rounder', timeAgo: '5m ago', distance: '4 KM', rightIconType: 'Person' },
    { id: 'rec_2', playerId: 'r2', type: 'Recruitment', teamName: "Apex Predators", description: 'Need a specialized opening Batsman.', date: 'Sat, Mar 07 2026', ground: 'Apex Arena', requirementText: 'Batsman', timeAgo: '12m ago', distance: '7 KM', rightIconType: 'Person' },
    { id: 'rec_3', playerId: 'r3', type: 'Recruitment', teamName: "HSR Titans", description: 'Searching for a Left-arm spinner.', date: 'Mon, Mar 09 2026', ground: 'HSR Layout Ground', requirementText: 'Spinner', timeAgo: '25m ago', distance: '2 KM', rightIconType: 'Person' },
    { id: 'rec_4', playerId: 'r4', type: 'Recruitment', teamName: "Whitefield Wolves", description: 'Wicketkeeper needed urgently for tourney.', date: 'Tue, Mar 10 2026', ground: 'Wolves Den', requirementText: 'Wicketkeeper', timeAgo: '45m ago', distance: '10 KM', rightIconType: 'Person' },
    { id: 'rec_5', playerId: 'r5', type: 'Recruitment', teamName: "Indiranagar Invincibles", description: 'Fast bowler wanted for upcoming league.', date: 'Sat, Mar 07 2026', ground: 'Defense Ground', requirementText: 'Fast Bowler', timeAgo: '1h ago', distance: '3 KM', rightIconType: 'Person' },
    { id: 'rec_6', playerId: 'r6', type: 'Recruitment', teamName: "Jayanagar Jaguars", description: 'Middle-order batsman required.', date: 'Sun, Mar 08 2026', ground: 'KSCA Ground', requirementText: 'Batsman', timeAgo: '2h ago', distance: '6 KM', rightIconType: 'Person' },
    { id: 'rec_7', playerId: 'r7', type: 'Recruitment', teamName: "Koramangala Knights", description: 'Looking for a captain/leader for our team.', date: 'Wed, Mar 11 2026', ground: 'Knights Field', requirementText: 'Captain', timeAgo: '3h ago', distance: '4 KM', rightIconType: 'Person' },
    { id: 'rec_8', playerId: 'r8', type: 'Recruitment', teamName: "Malleshwaram Masters", description: 'Need players for veteran league (35+).', date: 'Sat, Mar 07 2026', ground: 'Masters Court', requirementText: 'Veteran Player', timeAgo: '4h ago', distance: '8 KM', rightIconType: 'Person' },
    { id: 'rec_9', playerId: 'r9', type: 'Recruitment', teamName: "Hebbal Hurricanes", description: 'Power-hitter wanted for T10 matches.', date: 'Thu, Mar 12 2026', ground: 'Hebbal Lake Ground', requirementText: 'Power-hitter', timeAgo: '5h ago', distance: '14 KM', rightIconType: 'Person' },
    { id: 'rec_10', playerId: 'r10', type: 'Recruitment', teamName: "Electronic City Elite", description: 'Leg-spinner needed for weekend matches.', date: 'Sat, Mar 07 2026', ground: 'Elite Turf', requirementText: 'Leg-spinner', timeAgo: '6h ago', distance: '18 KM', rightIconType: 'Person' },

    // --- Players (10 Items) ---
    { id: 'play_1', playerId: 'u1', type: 'Player', teamName: "Rohit S. (Batsman)", description: 'is looking for a team for upcoming local tourney.', date: 'Open Availability', ground: 'Any (Bangalore)', requirementText: 'Looking for Team', timeAgo: '10m ago', distance: '5 KM', rightIconType: 'Person' },
    { id: 'play_2', playerId: 'u2', type: 'Player', teamName: "Sameer K. (Wicketkeeper)", description: 'Experienced keeper available for matches.', date: 'Sat/Sun', ground: 'South Bangalore', requirementText: 'Available', timeAgo: '22m ago', distance: '3 KM', rightIconType: 'Person' },
    { id: 'play_3', playerId: 'u3', type: 'Player', teamName: "Aryan V. (All-rounder)", description: 'Can bat and bowl fast. Ready to join!', date: 'Weekends', ground: 'North Bangalore', requirementText: 'Join Team', timeAgo: '40m ago', distance: '11 KM', rightIconType: 'Person' },
    { id: 'play_4', playerId: 'u4', type: 'Player', teamName: "Ishaan M. (Spinner)", description: 'Off-spinner looking for a regular team.', date: 'Flexible', ground: 'Central Bangalore', requirementText: 'Looking for Team', timeAgo: '1h ago', distance: '6 KM', rightIconType: 'Person' },
    { id: 'play_5', playerId: 'u5', type: 'Player', teamName: "Karan B. (Fast Bowler)", description: 'Can bowl 130+. Looking for high-level games.', date: 'Sundays', ground: 'St. Johns Ground', requirementText: 'Available', timeAgo: '2h ago', distance: '4 KM', rightIconType: 'Person' },
    { id: 'play_6', playerId: 'u6', type: 'Player', teamName: "Rahul G. (Batsman)", description: 'Aggressive opener seeking new challenges.', date: 'Saturdays', ground: 'Gubbi Ground', requirementText: 'Looking for Team', timeAgo: '3h ago', distance: '9 KM', rightIconType: 'Person' },
    { id: 'play_7', playerId: 'u7', type: 'Player', teamName: "Manish P. (All-rounder)", description: 'Leg-spin and solid middle order batting.', date: 'Flexible', ground: 'Sarjapur Turf', requirementText: 'Join Team', timeAgo: '4h ago', distance: '15 KM', rightIconType: 'Person' },
    { id: 'play_8', playerId: 'u8', type: 'Player', teamName: "Sunil T. (Batsman)", description: 'Consistent run-scorer available for trials.', date: 'Weekdays Night', ground: 'Indoor Arena', requirementText: 'Looking for Team', timeAgo: '5h ago', distance: '2 KM', rightIconType: 'Person' },
    { id: 'play_9', playerId: 'u9', type: 'Player', teamName: "Deepak R. (Spinner)", description: 'Left-arm orthodox seeking regular cricket.', date: 'Weekends', ground: 'Yelahanka Ground', requirementText: 'Available', timeAgo: '6h ago', distance: '20 KM', rightIconType: 'Person' },
    { id: 'play_10', playerId: 'u10', type: 'Player', teamName: "Vijay L. (Batsman)", description: 'Power hitter for T20 formats.', date: 'Flexible', ground: 'Anywhere', requirementText: 'Join Team', timeAgo: '7h ago', distance: '-- KM', rightIconType: 'Person' },
];
