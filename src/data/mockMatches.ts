export interface Team {
    name: string;
    logo?: string;
    score?: string;
    overs?: string;
}

export interface PlayerScore {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    howOut: string;
}

export interface BowlerScore {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
}

export interface MatchDetails {
    id: string;
    status: 'upcoming' | 'finished' | 'live';
    team_a: Team;
    team_b: Team;
    time: string;
    location: string;
    result?: string;
    highlight?: boolean;
    toss?: string;
    venue?: string;
    series?: string;
    scorecard?: {
        team_aInnings: PlayerScore[];
        team_aBowling: BowlerScore[];
        team_bInnings: PlayerScore[];
        team_bBowling: BowlerScore[];
    };
}

export const MOCK_MATCHES: MatchDetails[] = [
    {
        id: 's1',
        status: 'upcoming',
        team_a: { name: 'Mighty Meteors' },
        team_b: { name: 'Thunderbolts' },
        time: 'Today, 2:00 PM',
        location: 'Greenfield Stadium',
        venue: 'Greenfield Stadium, Sydney',
        series: 'Sydney Premier League 2024',
        toss: 'Meteors won the toss and elected to bat',
    },
    {
        id: 's2',
        status: 'upcoming',
        team_a: { name: 'Royal Challengers' },
        team_b: { name: 'Super Kings' },
        time: 'Tomorrow, 5:30 PM',
        location: 'Chinnaswamy Arena',
        venue: 'M. Chinnaswamy Stadium, Bangalore',
        series: 'IPL 2024',
        toss: 'Toss at 5:00 PM',
    },
    {
        id: 'r1',
        status: 'finished',
        team_a: { name: 'Mighty Meteors', score: '185/4', overs: '20.0' },
        team_b: { name: 'Thunderbolts', score: '180/8', overs: '20.0' },
        time: 'Yesterday',
        location: 'Melbourne Oval',
        result: 'Meteors won by 5 runs',
        highlight: true,
        venue: 'Melbourne Cricket Ground',
        series: 'Big Bash League',
        scorecard: {
            team_aInnings: [
                { name: 'Roman Saini', runs: 85, balls: 45, fours: 8, sixes: 4, strikeRate: 188.8, howOut: 'c & b James A' },
                { name: 'Babar A', runs: 52, balls: 40, fours: 4, sixes: 1, strikeRate: 130.0, howOut: 'lbw b Benjamin S' },
                { name: 'Virat K', runs: 30, balls: 20, fours: 3, sixes: 0, strikeRate: 150.0, howOut: 'not out' },
            ],
            team_aBowling: [
                { name: 'James A', overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.0 },
                { name: 'Benjamin S', overs: 4, maidens: 0, runs: 45, wickets: 1, economy: 11.25 },
            ],
            team_bInnings: [
                { name: 'Murali A', runs: 65, balls: 38, fours: 7, sixes: 2, strikeRate: 171.0, howOut: 'c Sharma b Roman S' },
                { name: 'Rashid Khan', runs: 42, balls: 25, fours: 3, sixes: 3, strikeRate: 168.0, howOut: 'b Sharma' },
            ],
            team_bBowling: [
                { name: 'Sharma', overs: 4, maidens: 1, runs: 24, wickets: 3, economy: 6.0 },
                { name: 'Roman S', overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.5 },
            ],
        },
    },
    {
        id: 'r2',
        status: 'finished',
        team_a: { name: 'Super Kings', score: '210/3', overs: '20.0' },
        team_b: { name: 'Royal Challengers', score: '211/2', overs: '19.4' },
        time: '2 days ago',
        location: 'Wankhede',
        result: 'Challengers won by 8 wkts',
        highlight: false,
        venue: 'Wankhede Stadium, Mumbai',
        series: 'IPL 2024',
        scorecard: {
            team_aInnings: [
                { name: 'Faf du P', runs: 78, balls: 50, fours: 6, sixes: 3, strikeRate: 156.0, howOut: 'c & b Siraj' },
            ],
            team_aBowling: [
                { name: 'Siraj', overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
            ],
            team_bInnings: [
                { name: 'Virat K', runs: 102, balls: 60, fours: 12, sixes: 2, strikeRate: 170.0, howOut: 'not out' },
            ],
            team_bBowling: [
                { name: 'Jadeja', overs: 4, maidens: 0, runs: 42, wickets: 0, economy: 10.5 },
            ],
        },
    },
];

export const SCHEDULES_MOCK = MOCK_MATCHES.filter(m => m.status === 'upcoming');
export const RESULTS_MOCK = MOCK_MATCHES.filter(m => m.status === 'finished');
