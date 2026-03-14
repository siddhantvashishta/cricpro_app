import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppHeader } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const ResultsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const matches = useAppStore((state) => state.matches);
    const results = matches.filter(m => m.status === 'finished');

    const renderResult = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.card, item.highlight && styles.cardHighlight]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.statusText}>FINISHED</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <View style={styles.resultRow}>
                <View style={styles.teamInfo}>
                    <View style={styles.teamLogoPlaceholder} />
                    <Text style={styles.teamName}>{item.team_a.name}</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{item.team_a.score}</Text>
                    <Text style={styles.vsText}>-</Text>
                    <Text style={styles.scoreText}>{item.team_b.score}</Text>
                </View>
                <View style={styles.teamInfo}>
                    <View style={styles.teamLogoPlaceholder} />
                    <Text style={styles.teamName}>{item.team_b.name}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.outcomeText, item.highlight && styles.outcomeHighlight]}>
                    {item.result}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Match Results" showBack />
            <FlatList
                data={results}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderResult}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    listContent: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHighlight: {
        backgroundColor: '#FFF0E6',
        borderColor: '#F97316',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingBottom: spacing.xs,
    },
    statusText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        fontWeight: typography.weights.bold,
    },
    timeText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    teamInfo: {
        alignItems: 'center',
        flex: 1,
    },
    teamLogoPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginBottom: spacing.xs,
    },
    teamName: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        textAlign: 'center',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.5,
    },
    scoreText: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    vsText: {
        marginHorizontal: spacing.sm,
        color: colors.text.tertiary,
        fontWeight: typography.weights.bold,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    outcomeText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginRight: spacing.xs,
        textAlign: 'center',
    },
    outcomeHighlight: {
        color: '#F97316',
        fontWeight: typography.weights.bold,
    }
});
