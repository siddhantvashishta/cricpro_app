export const typography = {
    // Font Sizes
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,    // Base body size
        lg: 18,
        xl: 20,
        xxl: 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Font Weights
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        heavy: '900' as const, // Used for scores or large callouts
    },

    // Line Heights
    lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
    },

    // Provide some common preset styles that combine these
    presets: {
        h1: {
            fontSize: 30,
            fontWeight: '700' as const,
            lineHeight: 36, // ~1.2
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            lineHeight: 30,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        bodyLarge: {
            fontSize: 18,
            fontWeight: '400' as const,
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        score: {
            fontSize: 36,
            fontWeight: '900' as const,
            lineHeight: 40,
        },
    },
};
