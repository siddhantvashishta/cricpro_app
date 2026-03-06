import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface PlayerCardProps {
    name?: string;
    isPro?: boolean;
    runs?: number;
    wickets?: number;
    imageUrl?: string;
    onPress?: () => void;
}

const DUMMY_PLAYER_BG = 'https://picsum.photos/seed/player/300/400';

export const PlayerCard: React.FC<PlayerCardProps> = ({
    name = 'Roman Saini',
    isPro = true,
    runs = 39985,
    wickets = 1460,
    imageUrl = DUMMY_PLAYER_BG,
    onPress,
}) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <View style={styles.container}>
            {/* Background Image Area - Tappable for Profile */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.imageTouchable}
                onPress={onPress}
            >
                <ImageBackground
                    source={{ uri: imageUrl }}
                    style={styles.imageBackground}
                    imageStyle={styles.imageStyle}
                >
                    <View style={styles.overlay}>
                        {isPro && (
                            <View style={styles.proBadge}>
                                <Text style={styles.proBadgeText}>PRO</Text>
                            </View>
                        )}
                        <Text style={styles.name}>{name}</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statText}>R:{runs}</Text>
                            <Text style={styles.statText}>W:{wickets}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

            {/* Action Button Area - Independent Tap */}
            <TouchableOpacity
                style={[styles.followButton, isFollowing && styles.followingButton]}
                activeOpacity={0.8}
                onPress={() => setIsFollowing(!isFollowing)}
            >
                <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 240,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageTouchable: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderTopLeftRadius: radius.md,
        borderTopRightRadius: radius.md,
    },
    overlay: {
        padding: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.6)', // Dark gradient/overlay effect for text readability
        alignItems: 'center',
    },
    proBadge: {
        backgroundColor: '#10B981', // green
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: spacing.xs,
    },
    proBadgeText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    name: {
        color: colors.text.inverse,
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statText: {
        color: colors.text.inverse,
        ...typography.presets.caption,
    },
    followButton: {
        backgroundColor: '#F97316', // orange from design
        paddingVertical: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#F97316',
    },
    followingButton: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderTopWidth: 1,
    },
    followButtonText: {
        color: colors.text.inverse,
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
    },
    followingButtonText: {
        color: colors.text.primary,
    }
});
