const teamColorPalette = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#0EA5E9', // Sky
];

export const getTeamColor = (teamName: string): string => {
    if (!teamName) return teamColorPalette[0];
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
        hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % teamColorPalette.length;
    return teamColorPalette[index];
};
