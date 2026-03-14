export interface FantasyTip {
    id: string;
    title: string;
    expert: string;
    imageUrl: string;
    description: string;
    pitchReport: string;
    topPicks: string[];
    captaincyAdvice: string;
    date: string;
}

export const FANTASY_TIPS_MOCK: FantasyTip[] = [
    {
        id: 't1',
        title: 'Pitch Report: Batsman Friendly Track!',
        expert: 'Aakash C.',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'The upcoming match at Greenfield Stadium is expected to be a high-scoring thriller based on recent pitch conditions.',
        pitchReport: 'A flat deck with zero grass. The ball will come onto the bat nicely under lights. Spinners might struggle in the second innings due to dew.',
        topPicks: ['Roman Saini', 'Virat K', 'James A'],
        captaincyAdvice: 'Roman Saini is a safe bet for Captain given his recent form in T20 leagues.',
        date: 'Sat, Mar 07 2026'
    },
    {
        id: 't2',
        title: 'Top Pick: Virat is in supreme form.',
        expert: 'Harsha B.',
        imageUrl: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Virat has scored three half-centuries in his last four innings at this venue.',
        pitchReport: 'Balanced pitch with some assistance for the quicks early on.',
        topPicks: ['Virat K', 'Rashid Khan', 'Benjamin S'],
        captaincyAdvice: 'Virat is the obvious choice for VC.',
        date: 'Sat, Mar 07 2026'
    },
    {
        id: 't3',
        title: 'Must Have: Bumrah for death overs.',
        expert: 'Ian B.',
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'In death overs, Bumrah has an economy of just 6.5 at this stadium.',
        pitchReport: 'Slightly slow surface, ideal for death over specialists.',
        topPicks: ['Bumrah', 'Sharma', 'Murali A'],
        captaincyAdvice: 'If you are looking for a bowler captain, Bumrah is your man.',
        date: 'Sun, Mar 08 2026'
    },
];
