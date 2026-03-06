import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export interface MyCricketMatchCardProps {
    leagueName: string;
    tournamentName: string;
    status: string;
    dateStr: string;
    overs: string;
    location: string;
    team1: string;
    team2: string;
    scheduledText: string;
    footerLinks: string[];
}

export const MyCricketMatchCard: React.FC<MyCricketMatchCardProps> = ({
    leagueName,
    tournamentName,
    status,
    dateStr,
    overs,
    location,
    team1,
    team2,
    scheduledText,
    footerLinks
}) => {
    return (
        <View style={styles.cardContainer}>
            {/* Top Section */}
            <View style={styles.topSection}>
                <View style={styles.topLeft}>
                    <Text style={styles.leagueText} numberOfLines={1}>
                        <Text style={styles.leagueName}>{leagueName}</Text>, {tournamentName}
                    </Text>
                    <Text style={styles.dateLocationText} numberOfLines={1}>
                        {dateStr} | {overs} | {location}
                    </Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>

            {/* Middle Section (Teams) */}
            <View style={styles.middleSection}>
                <Text style={styles.teamName}>{team1}</Text>
                <Text style={styles.teamName}>{team2}</Text>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <Text style={styles.scheduledText}>{scheduledText}</Text>
                <View style={styles.linksRow}>
                    {footerLinks.map((link, index) => (
                        <Text key={index} style={styles.linkText}>
                            {link}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    topLeft: {
        flex: 1,
        marginRight: spacing.sm,
    },
    leagueText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    leagueName: {
        fontWeight: typography.weights.bold,
    },
    dateLocationText: {
        ...typography.presets.caption,
        color: 'gray', // Match exact grey from design
    },
    statusBadge: {
        backgroundColor: '#F97316', // orange badge
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.md,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    middleSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    teamName: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    bottomSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    scheduledText: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.md,
    },
    linkText: {
        ...typography.presets.bodySmall,
        color: '#F97316', // Orange link text
        fontWeight: typography.weights.bold,
    }
});
