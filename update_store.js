
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'mock_data.json');
const storePath = path.join(__dirname, 'src', 'store', 'useTeamStore.ts');

if (!fs.existsSync(mockDataPath)) {
    console.error('mock_data.json not found');
    process.exit(1);
}

const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
let storeContent = fs.readFileSync(storePath, 'utf8');

const playersString = `const INITIAL_PLAYERS: Record<string, Player> = ${JSON.stringify(mockData.players, null, 2)};`;
const teamsString = `const INITIAL_TEAMS: Team[] = ${JSON.stringify(mockData.teams, null, 2)};`;

// Replace INITIAL_PLAYERS
const playersRegex = /const INITIAL_PLAYERS: Record<string, Player> = \{[\s\S]*?\};/m;
storeContent = storeContent.replace(playersRegex, playersString);

// Replace INITIAL_TEAMS
const teamsRegex = /const INITIAL_TEAMS: Team\[\] = \[[\s\S]*?\];/m;
storeContent = storeContent.replace(teamsRegex, teamsString);

fs.writeFileSync(storePath, storeContent);
console.log('Successfully updated useTeamStore.ts with 15-player rosters');
