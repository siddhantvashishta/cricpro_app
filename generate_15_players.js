
const roles = ['BAT', 'BWL', 'AR', 'WK'];
const roleColors = {
    'BAT': '#1565C0',
    'BWL': '#6A1B9A',
    'AR': '#2E7D32',
    'WK': '#E65100'
};

const firstNames = ['Amit', 'Raj', 'Sanjay', 'Vikram', 'Arjun', 'Rahul', 'Deepak', 'Vijay', 'Karan', 'Sunil', 'Anil', 'Manoj', 'Rohan', 'Sumit', 'Abhishek', 'Pankaj', 'Sachin', 'Virat', 'Rohit', 'MS', 'Shikhar', 'Hardik', 'Jasprit', 'KL', 'Rishabh', 'Shreyas', 'Ishant', 'Umesh', 'Mohammed', 'Ravindra'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Yadav', 'Mishra', 'Joshi', 'Mehta', 'Sen', 'Das', 'Roy', 'Chopra', 'Pandey', 'Iyer', 'Gill', 'Kohli', 'Dhoni', 'Jadeja', 'Bumrah', 'Shami', 'Siraj', 'Pant', 'Rahul', 'Karthik', 'Ashwin', 'Chahal', 'Kuldeep', 'Bhuvi'];

const teamNames = [
    { name: 'Mumbai Mavericks', city: 'Mumbai', short: 'MM', color: '#004BA0' },
    { name: 'Delhi Dynamos', city: 'Delhi', short: 'DD', color: '#00008B' },
    { name: 'Bangalore Blasters', city: 'Bangalore', short: 'BB', color: '#C62828' },
    { name: 'Chennai Champions', city: 'Chennai', short: 'CC', color: '#FBC02D' },
    { name: 'Kolkata Kings', city: 'Kolkata', short: 'KK', color: '#4A148C' },
    { name: 'Hyderabad Hawks', city: 'Hyderabad', short: 'HH', color: '#EF6C00' },
    { name: 'Rajasthan Royals', city: 'Jaipur', short: 'RR', color: '#EA80FC' },
    { name: 'Punjab Power', city: 'Chandigarh', short: 'PP', color: '#D32F2F' },
    { name: 'Gujarat Giants', city: 'Ahmedabad', short: 'GG', color: '#FF9800' },
    { name: 'Lucknow Lions', city: 'Lucknow', short: 'LL', color: '#00ACC1' }
];

const players = {};
const teams = [];

let playerIdCounter = 1;

teamNames.forEach((tInfo, tIdx) => {
    const teamId = `t${tIdx + 1}`;
    const roster = [];
    
    // 15 registered players per team
    for (let i = 0; i < 15; i++) {
        const pId = `p${playerIdCounter++}`;
        const role = roles[Math.floor(Math.random() * roles.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        
        players[pId] = {
            id: pId,
            name: fullName,
            role: role,
            roleColor: roleColors[role],
            stats: {
                MAT: Math.floor(Math.random() * 50) + 1,
                INN: Math.floor(Math.random() * 45) + 1,
                RUNS: Math.floor(Math.random() * 2000),
                HS: Math.floor(Math.random() * 150).toString(),
                AVG: parseFloat((Math.random() * 45 + 5).toFixed(1)),
                SR: parseFloat((Math.random() * 100 + 80).toFixed(1)),
                '100S': Math.floor(Math.random() * 5),
                '50S': Math.floor(Math.random() * 15),
                '4S': Math.floor(Math.random() * 150),
                '6S': Math.floor(Math.random() * 80),
                WKTS: Math.floor(Math.random() * 60),
                BBI: `${Math.floor(Math.random() * 6)}/${Math.floor(Math.random() * 40)}`,
                ECON: parseFloat((Math.random() * 5 + 4).toFixed(1))
            }
        };
        roster.push(pId);
    }
    
    teams.push({
        id: teamId,
        name: tInfo.name,
        shortName: tInfo.short,
        city: tInfo.city,
        yearFounded: (2008 + Math.floor(Math.random() * 15)).toString(),
        homeGround: 'Stadium',
        formats: ['T20', 'ODI'],
        overs: '20',
        themeColor: tInfo.color,
        players: 15,
        avatarColor: tInfo.color,
        avatarLetter: tInfo.short,
        roster: roster
    });
});

const fs = require('fs');
fs.writeFileSync('mock_data.json', JSON.stringify({ players, teams }, null, 2));
console.log('150 players generated and saved to mock_data.json');
