import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export interface LookingCardProps {
    teamName: string;
    description: string;
    requirementText?: string;
    date: string;
    ground: string;
    timeAgo: string;
    distance: string;
    rightIconType: 'VS' | 'Person';
}

export const LookingCard: React.FC<LookingCardProps> = ({
    teamName,
    description,
    requirementText,
    date,
    ground,
    timeAgo,
    distance,
    rightIconType
}) => {
    return (
        <View style={styles.card}>
            {/* Header / Body Section */}
            <View style={styles.bodySection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=150' }}
                        style={styles.avatar}
                    />
                    <View style={styles.proBadge}>
                        <Text style={styles.proText}>PRO</Text>
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.mainDescription}>
                        <Text style={styles.teamNameText}>{teamName}</Text> {description}
                    </Text>

                    <View style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.metaText}>{date}</Text>
                    </View>
                    <View style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.metaText}>{ground}</Text>
                    </View>
                    {requirementText && (
                        <View style={styles.bulletRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.metaText}>{requirementText}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.rightIconContainer}>
                    {rightIconType === 'VS' ? (
                        <View style={styles.vsBadge}>
                            <Text style={styles.vsText}>VS</Text>
                        </View>
                    ) : (
                        <Ionicons name="person-outline" size={32} color={colors.text.secondary} />
                    )}
                </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footerSection}>
                <Text style={styles.timeAgoText}>{timeAgo}</Text>

                <View style={styles.footerCenter}>
                    {/* Fake red ball icon */}
                    <View style={styles.redBall} />
                    <View style={styles.distanceContainer}>
                        <Ionicons name="location-outline" size={14} color="#F97316" />
                        <Text style={styles.distanceText}>{distance}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.contactBtn}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#F97316" />
                    <Text style={styles.contactText}>Contact</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    bodySection: {
        flexDirection: 'row',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.border,
    },
    proBadge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: '#10B981', // green
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    proText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    mainDescription: {
        ...typography.presets.body,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
        lineHeight: 20,
    },
    teamNameText: {
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#9ca3af',
        marginRight: spacing.sm,
    },
    metaText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    rightIconContainer: {
        marginLeft: spacing.sm,
        alignItems: 'center',
    },
    vsBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.text.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vsText: {
        color: colors.text.secondary,
        fontWeight: typography.weights.bold,
        fontSize: 12,
        fontStyle: 'italic',
    },
    footerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    timeAgoText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    footerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    redBall: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E11D48', // Red
        marginRight: spacing.md,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        ...typography.presets.caption,
        color: '#F97316', // Orange
        fontWeight: typography.weights.bold,
        marginLeft: 4,
    },
    contactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        ...typography.presets.caption,
        color: '#F97316',
        fontWeight: typography.weights.bold,
        marginLeft: 4,
    },
});
