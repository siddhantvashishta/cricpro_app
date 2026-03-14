import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export interface PollOption {
    id: string;
    label: string;
    percentage: number;
}

interface PollCardProps {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    votedOptionId?: string | null;
    onVote: (pollId: string, optionId: string) => void;
}

export const PollCard: React.FC<PollCardProps> = ({
    id,
    question,
    options,
    totalVotes,
    votedOptionId,
    onVote
}) => {
    const hasVoted = !!votedOptionId;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="stats-chart" size={16} color={colors.primary} />
                <Text style={styles.headerTag}>DAILY POLL</Text>
            </View>

            <Text style={styles.question}>{question}</Text>

            {options.map((option) => {
                const isSelected = votedOptionId === option.id;

                return (
                    <PollOptionRow
                        key={option.id}
                        option={option}
                        isSelected={isSelected}
                        showResults={hasVoted}
                        onPress={() => !hasVoted && onVote(id, option.id)}
                    />
                );
            })}

            <View style={styles.footer}>
                <Text style={styles.totalVotes}>
                    {hasVoted ? `${(totalVotes + 1).toLocaleString()}` : totalVotes.toLocaleString()} votes
                </Text>
                {hasVoted && (
                    <View style={styles.votedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                        <Text style={styles.votedText}>Voted</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const PollOptionRow = ({ option, isSelected, showResults, onPress }: any) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showResults) {
            Animated.timing(animatedWidth, {
                toValue: option.percentage,
                duration: 800,
                delay: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [showResults]);

    const progressWidth = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <TouchableOpacity
            style={[
                styles.optionContainer,
                isSelected && styles.selectedOption,
                showResults && { borderColor: isSelected ? colors.primary : colors.border }
            ]}
            onPress={onPress}
            activeOpacity={showResults ? 1 : 0.7}
            disabled={showResults}
        >
            {showResults && (
                <Animated.View style={[styles.progressBackground, { width: progressWidth }]} />
            )}

            <View style={styles.optionContent}>
                <View style={styles.labelWrapper}>
                    <Text style={[
                        styles.optionLabel,
                        isSelected && styles.selectedText,
                        showResults && { color: colors.text.primary }
                    ]}>
                        {option.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />}
                </View>

                {showResults && (
                    <Text style={[styles.percentage, isSelected && styles.selectedText]}>
                        {option.percentage}%
                    </Text>
                )}
            </View>
        </TouchableOpacity>
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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    headerTag: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        marginLeft: spacing.xs,
        letterSpacing: 1,
    },
    question: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        lineHeight: 22,
    },
    optionContainer: {
        height: 48,
        borderRadius: radius.md,
        backgroundColor: '#F8FAFC',
        marginBottom: spacing.sm,
        overflow: 'hidden',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedOption: {
        borderColor: colors.primary,
        backgroundColor: '#EFF6FF',
    },
    progressBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#BFDBFE', // Light blue fill for results
        opacity: 0.4,
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        zIndex: 1,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionLabel: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        fontWeight: typography.weights.semibold,
    },
    percentage: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: typography.weights.bold,
    },
    selectedText: {
        color: colors.primary,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    totalVotes: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    votedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    votedText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
        marginLeft: 4,
    }
});
