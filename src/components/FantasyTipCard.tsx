import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface FantasyTipCardProps {
    title: string;
    expert: string;
    imageUrl: string;
    onPress?: () => void;
}

export const FantasyTipCard: React.FC<FantasyTipCardProps> = ({ title, expert, imageUrl, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>EXPERT TIP</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <Text style={styles.expert}>by {expert}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 140,
        borderRadius: radius.lg,
        overflow: 'hidden',
        marginRight: spacing.md,
        backgroundColor: colors.surfaceHighlight,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: radius.xs,
        alignSelf: 'flex-start',
    },
    badgeText: {
        ...typography.presets.caption,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
        fontSize: 10,
    },
    content: {
        marginTop: 'auto',
    },
    title: {
        ...typography.presets.bodySmall,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    expert: {
        ...typography.presets.caption,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
});
