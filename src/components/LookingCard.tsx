import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export type LookingType = 'Opponent' | 'Recruitment' | 'Player';

export interface LookingCardProps {
    type: LookingType;
    teamName: string;
    description: string;
    requirementText?: string;
    date: string;
    ground: string;
    timeAgo: string;
    distance: string;
    rightIconType: 'VS' | 'Person';
    onActionPress?: () => void;
    onMorePress?: () => void;
    onProfilePress?: () => void;
    onMessagePress?: () => void;
}

export const LookingCard: React.FC<LookingCardProps> = ({
    type,
    teamName,
    description,
    requirementText,
    date,
    ground,
    timeAgo,
    distance,
    rightIconType,
    onActionPress,
    onMorePress,
    onProfilePress,
    onMessagePress
}) => {
    const getTypeLabel = () => {
        switch (type) {
            case 'Opponent': return 'NEEDS OPPONENT';
            case 'Recruitment': return 'RECRUITING';
            case 'Player': return 'LOOKING FOR TEAM';
            default: return '';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
                    </View>
                    <Text style={styles.timeAgo}>{timeAgo}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={onMessagePress} style={styles.iconBtn}>
                        <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onMorePress} style={styles.iconBtn}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentRow}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name={rightIconType === 'VS' ? 'trophy' : 'person'} size={28} color={colors.text.secondary} />
                    </View>
                </View>
                <View style={styles.mainInfo}>
                    <Text style={styles.teamName} numberOfLines={1}>{teamName}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>
                </View>
                <View style={styles.rightFloatingIcon}>
                    <Image
                        source={require('../../assets/main_logo.png')}
                        style={styles.floatingImage}
                    />
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                    <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                    <Text style={styles.detailText}>{ground} • {distance}</Text>
                </View>
            </View>

            {requirementText && (
                <View style={styles.requirementBox}>
                    <Text style={styles.requirementText}>{requirementText}</Text>
                </View>
            )}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.secondaryAction} onPress={onProfilePress}>
                    <Text style={styles.secondaryActionText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.primaryAction, { backgroundColor: type === 'Opponent' ? '#DC2626' : '#2563EB' }]}
                    onPress={onActionPress}
                >
                    <Text style={styles.primaryActionText}>
                        {type === 'Opponent' ? 'Challenge' : type === 'Player' ? 'Hire player' : 'Apply Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.md,
        marginRight: spacing.sm,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#DC2626',
        textTransform: 'uppercase',
    },
    timeAgo: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: spacing.sm,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainInfo: {
        flex: 1,
    },
    teamName: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: 4,
    },
    description: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    rightFloatingIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    floatingImage: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
        opacity: 0.8,
    },
    detailsRow: {
        marginBottom: spacing.md,
        gap: spacing.xs,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginLeft: 8,
    },
    requirementBox: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        marginBottom: spacing.md,
    },
    requirementText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.xs,
    },
    primaryAction: {
        flex: 1,
        height: 44,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryActionText: {
        color: colors.text.inverse,
        fontWeight: 'bold',
    },
    secondaryAction: {
        flex: 1,
        height: 44,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryActionText: {
        color: colors.text.primary,
        fontWeight: '600',
    },
});
