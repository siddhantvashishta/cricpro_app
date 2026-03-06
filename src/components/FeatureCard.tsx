import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface FeatureCardProps {
    title?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    description?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title = 'Live Scores',
    iconName = 'radio',
    description = 'Get ball by ball updates',
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={28} color={colors.accent} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: spacing.cardPadding,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        width: 140,
        marginRight: spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    description: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
});
