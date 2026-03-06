import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { MOCK_MATCHES, MatchDetails, PlayerScore, BowlerScore } from '../data/mockMatches';

export const MatchDetailsScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { matchId } = (route.params as any) || { matchId: 's1' };
    const [activeTab, setActiveTab] = useState<'info' | 'scorecard'>('info');
    const [activeInnings, setActiveInnings] = useState<'team1' | 'team2'>('team1');

    const match: MatchDetails = MOCK_MATCHES.find(m => m.id === matchId) || MOCK_MATCHES[0];
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const renderScorecardItem = ({ item }: { item: PlayerScore }) => (
        <View style={styles.scoreRow}>
            <View style={styles.scorePlayerInfo}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.howOutText}>{item.howOut}</Text>
            </View>
            <View style={styles.scoreStats}>
                <Text style={styles.statValue}>{item.runs}</Text>
                <Text style={styles.statValue}>{item.balls}</Text>
                <Text style={styles.statValue}>{item.fours}</Text>
                <Text style={styles.statValue}>{item.sixes}</Text>
                <Text style={styles.statValue}>{item.strikeRate}</Text>
            </View>
        </View>
    );

    const renderBowlerItem = ({ item }: { item: BowlerScore }) => (
        <View style={styles.scoreRow}>
            <View style={styles.scorePlayerInfo}>
                <Text style={styles.playerName}>{item.name}</Text>
            </View>
            <View style={styles.scoreStats}>
                <Text style={styles.statValue}>{item.overs}</Text>
                <Text style={styles.statValue}>{item.maidens}</Text>
                <Text style={styles.statValue}>{item.runs}</Text>
                <Text style={styles.statValue}>{item.wickets}</Text>
                <Text style={styles.statValue}>{item.economy}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{match.team1.name} vs {match.team2.name}</Text>
                    <Text style={styles.headerSubTitle}>{match.series}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Score Summary Section */}
            <View style={styles.summaryContainer}>
                <View style={styles.teamRow}>
                    <Text style={styles.teamNameText}>{match.team1.name}</Text>
                    {match.status === 'finished' && (
                        <View style={styles.scoreInfo}>
                            <Text style={styles.scoreText}>{match.team1.score}</Text>
                            <Text style={styles.oversText}>({match.team1.overs})</Text>
                        </View>
                    )}
                </View>
                <View style={styles.teamRow}>
                    <Text style={styles.teamNameText}>{match.team2.name}</Text>
                    {match.status === 'finished' && (
                        <View style={styles.scoreInfo}>
                            <Text style={styles.scoreText}>{match.team2.score}</Text>
                            <Text style={styles.oversText}>({match.team2.overs})</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.resultText}>
                    {match.status === 'finished' ? match.result : match.time}
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                    onPress={() => setActiveTab('info')}
                >
                    <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>INFO</Text>
                </TouchableOpacity>
                {match.status === 'finished' && (
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'scorecard' && styles.activeTab]}
                        onPress={() => setActiveTab('scorecard')}
                    >
                        <Text style={[styles.tabText, activeTab === 'scorecard' && styles.activeTabText]}>SCORECARD</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'info' ? (
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Match</Text>
                            <Text style={styles.infoValue}>{match.team1.name} vs {match.team2.name}, {match.series}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date & Time</Text>
                            <Text style={styles.infoValue}>{match.time}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Toss</Text>
                            <Text style={styles.infoValue}>{match.toss}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Venue</Text>
                            <Text style={styles.infoValue}>{match.venue}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.scorecardContainer}>
                        {/* Innings Selector Toggle */}
                        <View style={styles.inningsToggleBar}>
                            <TouchableOpacity
                                style={[styles.inningsToggle, activeInnings === 'team1' && styles.activeInningsToggle]}
                                onPress={() => setActiveInnings('team1')}
                            >
                                <Text style={[styles.inningsToggleText, activeInnings === 'team1' && styles.activeInningsToggleText]}>{match.team1.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.inningsToggle, activeInnings === 'team2' && styles.activeInningsToggle]}
                                onPress={() => setActiveInnings('team2')}
                            >
                                <Text style={[styles.inningsToggleText, activeInnings === 'team2' && styles.activeInningsToggleText]}>{match.team2.name}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Batting Section */}
                        <View style={styles.inningsHeader}>
                            <Text style={styles.inningsTitle}>
                                {activeInnings === 'team1' ? match.team1.name : match.team2.name} Innings
                            </Text>
                            <Text style={styles.inningsTotal}>
                                {activeInnings === 'team1' ? match.team1.score : match.team2.score} ({activeInnings === 'team1' ? match.team1.overs : match.team2.overs} Ov)
                            </Text>
                        </View>
                        <View style={styles.scorecardHeaderRow}>
                            <Text style={styles.headerLabelPlayer}>Batter</Text>
                            <View style={styles.headerStats}>
                                <Text style={styles.headerLabel}>R</Text>
                                <Text style={styles.headerLabel}>B</Text>
                                <Text style={styles.headerLabel}>4s</Text>
                                <Text style={styles.headerLabel}>6s</Text>
                                <Text style={styles.headerLabel}>SR</Text>
                            </View>
                        </View>
                        {(activeInnings === 'team1' ? match.scorecard?.team1Innings : match.scorecard?.team2Innings)?.map((item, index) => (
                            <View key={index}>{renderScorecardItem({ item })}</View>
                        ))}

                        {/* Bowling Section */}
                        <View style={[styles.inningsHeader, { marginTop: spacing.xl }]}>
                            <Text style={styles.inningsTitle}>
                                {activeInnings === 'team1' ? match.team2.name : match.team1.name} Bowling
                            </Text>
                        </View>
                        <View style={styles.scorecardHeaderRow}>
                            <Text style={styles.headerLabelPlayer}>Bowler</Text>
                            <View style={styles.headerStats}>
                                <Text style={styles.headerLabel}>O</Text>
                                <Text style={styles.headerLabel}>M</Text>
                                <Text style={styles.headerLabel}>R</Text>
                                <Text style={styles.headerLabel}>W</Text>
                                <Text style={styles.headerLabel}>ER</Text>
                            </View>
                        </View>
                        {(activeInnings === 'team1' ? match.scorecard?.team1Bowling : match.scorecard?.team2Bowling)?.map((item, index) => (
                            <View key={index}>{renderBowlerItem({ item })}</View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.md,
        paddingTop: spacing.md,
        backgroundColor: colors.primary,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: spacing.sm,
    },
    headerInfo: {
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    headerSubTitle: {
        ...typography.presets.caption,
        color: colors.text.inverse,
        opacity: 0.8,
    },
    summaryContainer: {
        padding: spacing.lg,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: radius.lg,
        borderBottomRightRadius: radius.lg,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    teamNameText: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    scoreInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreText: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
        marginRight: 4,
    },
    oversText: {
        ...typography.presets.caption,
        color: colors.text.inverse,
        opacity: 0.8,
    },
    resultText: {
        ...typography.presets.bodySmall,
        color: '#F97316',
        fontWeight: typography.weights.bold,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: typography.weights.bold,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    infoContainer: {
        padding: spacing.lg,
    },
    infoRow: {
        marginBottom: spacing.lg,
    },
    infoLabel: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginBottom: 4,
    },
    infoValue: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    },
    scorecardContainer: {
        padding: spacing.md,
    },
    inningsToggleBar: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        padding: 4,
        marginBottom: spacing.lg,
    },
    inningsToggle: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: radius.sm,
    },
    activeInningsToggle: {
        backgroundColor: colors.surface,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    inningsToggleText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    activeInningsToggleText: {
        color: colors.primary,
        fontWeight: typography.weights.bold,
    },
    inningsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        backgroundColor: '#F0F5FF',
        borderRadius: radius.sm,
        marginBottom: spacing.md,
    },
    inningsTitle: {
        ...typography.presets.body,
        color: colors.primary,
        fontWeight: typography.weights.bold,
    },
    inningsTotal: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    scorecardHeaderRow: {
        flexDirection: 'row',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: '#FAFAFA',
    },
    headerLabelPlayer: {
        flex: 2,
        ...typography.presets.caption,
        color: colors.text.tertiary,
        fontWeight: typography.weights.bold,
    },
    headerStats: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerLabel: {
        width: 35,
        textAlign: 'right',
        ...typography.presets.caption,
        color: colors.text.tertiary,
        fontWeight: typography.weights.bold,
    },
    scoreRow: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    scorePlayerInfo: {
        flex: 2,
    },
    playerName: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
    howOutText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        fontSize: 10,
    },
    scoreStats: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statValue: {
        width: 35,
        textAlign: 'right',
        ...typography.presets.bodySmall,
        color: colors.text.primary,
    }
});
