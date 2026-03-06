export interface PlayerProfile {
    id: string;
    name: string;
    role: string;
    team: string;
    isPro: boolean;
    imageUrl: string;
    runs: number;
    wickets: number;
    bio: string;
    stats: {
        matches: number;
        runs: number;
        highest: string;
        average: number;
        strikeRate: number;
        wickets: number;
        bestBowling: string;
        economy: number;
    };
}

export const MOCK_PLAYERS: PlayerProfile[] = [
    {
        id: '1',
        name: 'Roman Saini',
        role: 'All-Rounder',
        team: 'Mighty Meteors',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 39985,
        wickets: 1460,
        bio: 'Aggressive top-order batsman and handy right-arm medium pacer. Known for finishing matches under pressure.',
        stats: {
            matches: 342,
            runs: 39985,
            highest: '185*',
            average: 45.6,
            strikeRate: 142.3,
            wickets: 1460,
            bestBowling: '6/24',
            economy: 7.2,
        },
    },
    {
        id: '2',
        name: 'MURALI A',
        role: 'Wicket-Keeper Batsman',
        team: 'Thunderbolts',
        isPro: false,
        imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc02?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 12690,
        wickets: 463,
        bio: 'Technically sound wicket-keeper batsman with a wide range of shots. Reliable behind the stumps.',
        stats: {
            matches: 215,
            runs: 12690,
            highest: '112',
            average: 38.4,
            strikeRate: 128.5,
            wickets: 463,
            bestBowling: '4/45',
            economy: 8.5,
        },
    },
    {
        id: '3',
        name: 'Sharma',
        role: 'Fast Bowler',
        team: 'Royal Challengers',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1624526267942-ab0c09b83b8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 16301,
        wickets: 120,
        bio: 'Spearhead of the bowling attack. Capable of generating high pace and swing in both directions.',
        stats: {
            matches: 180,
            runs: 16301,
            highest: '45',
            average: 15.2,
            strikeRate: 110.0,
            wickets: 120,
            bestBowling: '5/18',
            economy: 6.8,
        },
    },
    {
        id: '4',
        name: 'Virat K',
        role: 'Top-order Batsman',
        team: 'Super Kings',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        runs: 25430,
        wickets: 45,
        bio: 'Modern-day great known for his chasing abilities and intense competitiveness on the field.',
        stats: {
            matches: 450,
            runs: 25430,
            highest: '183',
            average: 53.2,
            strikeRate: 135.8,
            wickets: 45,
            bestBowling: '2/15',
            economy: 5.5,
        },
    },
    {
        id: '5',
        name: 'Rashid Khan',
        role: 'Leg Spinner',
        team: 'Desert Vipers',
        isPro: false,
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        runs: 5420,
        wickets: 890,
        bio: 'Wizard with the ball. His quick arm action and variations make him one of the toughest to read.',
        stats: {
            matches: 280,
            runs: 5420,
            highest: '72',
            average: 18.5,
            strikeRate: 155.2,
            wickets: 890,
            bestBowling: '7/18',
            economy: 6.2,
        },
    },
    {
        id: '6',
        name: 'James A',
        role: 'Swing Specialist',
        team: 'Thunderbolts',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 1250,
        wickets: 1540,
        bio: 'Legendary swing bowler with an incredible ability to move the ball both ways even on flat tracks.',
        stats: {
            matches: 160,
            runs: 1250,
            highest: '81',
            average: 10.5,
            strikeRate: 95.0,
            wickets: 1540,
            bestBowling: '7/42',
            economy: 2.8,
        },
    },
    {
        id: '7',
        name: 'Babar A',
        role: 'Classic Batsman',
        team: 'Mighty Meteors',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 18450,
        wickets: 5,
        bio: 'Elegant stroke player with a solid technique. One of the most consistent performers in world cricket.',
        stats: {
            matches: 240,
            runs: 18450,
            highest: '158',
            average: 51.2,
            strikeRate: 128.4,
            wickets: 5,
            bestBowling: '1/12',
            economy: 5.2,
        },
    },
    {
        id: '8',
        name: 'Ben S',
        role: 'Clutch All-Rounder',
        team: 'Royal Challengers',
        isPro: true,
        imageUrl: 'https://images.unsplash.com/photo-1510511459019-5deeee71216a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        runs: 15200,
        wickets: 580,
        bio: 'The ultimate big-game player. Can win matches single-handedly with either bat, ball, or in the field.',
        stats: {
            matches: 310,
            runs: 15200,
            highest: '135*',
            average: 36.8,
            strikeRate: 145.2,
            wickets: 580,
            bestBowling: '6/36',
            economy: 4.8,
        },
    },
];
