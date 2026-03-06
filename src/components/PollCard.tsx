import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface PollOption {
    id: string;
    label: string;
    percentage: number;
}

interface PollCardProps {
    question: string;
    options: PollOption[];
    totalVotes: number;
}

export const PollCard: React.FC<PollCardProps> = ({ question, options, totalVotes }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{question}</Text>
            {options.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.optionContainer, isSelected && styles.selectedOption]}
                        onPress={() => setSelectedId(option.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.progressBackground, { width: `${option.percentage}%` }]} />
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionLabel, isSelected && styles.selectedText]}>
                                {option.label}
                            </Text>
                            <Text style={[styles.percentage, isSelected && styles.selectedText]}>
                                {option.percentage}%
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
            <Text style={styles.totalVotes}>{totalVotes.toLocaleString()} votes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    question: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    optionContainer: {
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    selectedOption: {
        borderColor: colors.primary,
        borderWidth: 1,
    },
    progressBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E2E8F0', // Light gray fill
        opacity: 0.5,
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    optionLabel: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    },
    percentage: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: typography.weights.bold,
    },
    selectedText: {
        color: colors.primary,
    },
    totalVotes: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
});
