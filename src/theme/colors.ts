const brand = {
    primary: '#1A4B8F', // Deep, reliable sports blue
    accent: '#F97316',  // Energetic orange for CTAs
    success: '#10B981', // Green for winning/positive states
    error: '#EF4444',   // Red for errors/loss states
    warning: '#F59E0B', // Yellow for pending/waiting states
};

export const lightColors = {
    ...brand,
    background: '#F8FAFC', // Off-white for app background
    surface: '#FFFFFF',    // Pure white for cards and sheets
    surfaceHighlight: '#F1F5F9', // Slightly darker white for hover/press states
    text: {
        primary: '#0F172A',   // Almost black for main headings
        secondary: '#334155', // Dark gray for body text
        tertiary: '#64748B',  // Light gray for meta info/timestamps
        inverse: '#FFFFFF',   // White text on dark backgrounds
    },
    border: '#E2E8F0',  // Light gray for standard dividers
};

export const darkColors = {
    ...brand,
    background: '#020617', // Onyx Black
    surface: '#0F172A',    // Deep Navy
    surfaceHighlight: '#1E293B', // Slate 800
    text: {
        primary: '#F8FAFC',   // Off-white
        secondary: '#CBD5E1', // Slate 300
        tertiary: '#94A3B8',  // Slate 400
        inverse: '#FFFFFF',   // Always white for high-contrast icons
    },
    border: '#334155',  // Slate 700
};

// Default export for backward compatibility during transition
export const colors = lightColors;
