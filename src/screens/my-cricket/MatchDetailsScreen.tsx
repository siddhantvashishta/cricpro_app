import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, Image, Dimensions, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors as staticColors, spacing, typography, radius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { getTeamColor } from '../../utils/teamColors';
import { MatchDetails, PlayerScore, BowlerScore } from '../../data/mockMatches';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export const MatchDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { matchId, initialTab } = (route.params as any) || { matchId: 's1' };
    const [activeTab, setActiveTab] = useState<'live' | 'scorecard' | 'info' | 'highlights' | 'insights'>(initialTab || 'live');
    const [activeInnings, setActiveInnings] = useState<'team_a' | 'team_b'>('team_a');

    const matches = useAppStore((state) => state.matches);
    const isProMember = useAppStore((state) => state.isProMember);
    const match = matches.find(m => m.id === matchId) || matches[0];
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
    const { colors, isDark } = useTheme();

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

    const renderLiveCommentary = () => (
        <View style={styles.commentaryContainer}>
            <View style={styles.overSummaryCard}>
                <Text style={styles.overText}>Over 18</Text>
                <View style={styles.ballDots}>
                    {['1', '4', 'wd', '0', 'W', '6'].map((ball, i) => (
                        <View key={i} style={[styles.ballDot, ball === 'W' && styles.wicketBall, ball === '6' && styles.sixBall]}>
                            <Text style={styles.ballDotText}>{ball}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.overRuns}>12 Runs, 1 Wicket</Text>
            </View>

            {[
                { over: '17.6', text: 'FOUR! Smashed away through covers. Manish P. finds the gap perfectly.', type: 'four' },
                { over: '17.5', text: 'No run. Good length ball, defended back to the bowler.', type: 'dot' },
                { over: '17.4', text: 'WICKET! Bowled him! Aryan S. cleans up the middle stump. Huge breakthrough!', type: 'wicket' },
                { over: '17.3', text: '1 run. Driven to long off for a single.', type: 'run' },
            ].map((item, idx) => (
                <View key={idx} style={styles.commentaryItem}>
                    <Text style={styles.commOver}>{item.over}</Text>
                    <View style={styles.commTextContainer}>
                        <Text style={styles.commText}>{item.text}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderHighlights = () => (
        <View style={styles.highlightsGrid}>
            {[
                { title: 'Manish P. Half Century', time: '02:45', thumb: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400' },
                { title: 'Aryan S. 3-Wicket Haul', time: '03:20', thumb: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400' },
                { title: 'Final Moments Thriller', time: '05:10', thumb: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400' },
            ].map((item, idx) => (
                <View key={idx} style={styles.highlightCard}>
                    <Image source={{ uri: item.thumb }} style={styles.highlightThumb} />
                    <View style={styles.playOverlay}>
                        <Ionicons name="play" size={20} color="white" />
                    </View>
                    <View style={styles.highlightInfo}>
                        <Text style={styles.highlightTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.highlightTime}>{item.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Header */}
            <View
                style={[styles.header, { paddingTop: statusBarHeight + spacing.sm, backgroundColor: staticColors.primary }]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{match.series}</Text>
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Match Summary UX */}
            <View style={styles.summaryContainer}>
                <View style={styles.teamsDisplay}>
                    <View style={styles.teamBrand}>
                        <View style={[styles.logoCircle, { borderColor: getTeamColor(match.team_a.name) }]}>
                            <Ionicons name="shield" size={32} color={getTeamColor(match.team_a.name)} />
                        </View>
                        <Text style={[styles.teamCode, { color: getTeamColor(match.team_a.name) }]}>{match.team_a.name.substring(0, 3).toUpperCase()}</Text>
                    </View>

                    <View style={styles.scoreDisplay}>
                        <Text style={styles.mainScore}>{match.team_a.score}</Text>
                        <Text style={styles.oversCount}>{match.team_a.overs} Ov</Text>
                    </View>

                    <View style={styles.vsContainer}>
                        <View style={styles.vsLine} />
                        <View style={styles.vsHex}>
                            <Text style={styles.vsSmall}>VS</Text>
                        </View>
                        <View style={styles.vsLine} />
                    </View>

                    <View style={styles.scoreDisplay}>
                        <Text style={styles.mainScore}>{match.team_b.score || '0/0'}</Text>
                        <Text style={styles.oversCount}>{match.team_b.overs || '0'} Ov</Text>
                    </View>

                    <View style={styles.teamBrand}>
                        <View style={[styles.logoCircle, { borderColor: getTeamColor(match.team_b.name) }]}>
                            <Ionicons name="shield" size={32} color={getTeamColor(match.team_b.name)} />
                        </View>
                        <Text style={[styles.teamCode, { color: getTeamColor(match.team_b.name) }]}>{match.team_b.name.substring(0, 3).toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.statusBanner}>
                    <Text style={styles.statusMessage}>
                        {match.status === 'finished' ? match.result : 'Match not started/completed'}
                    </Text>
                    {match.status !== 'finished' && (
                        <TouchableOpacity
                            style={styles.entryTrigger}
                            onPress={() => navigation.navigate('ScorecardEntry', { matchId: match.id })}
                        >
                            <Ionicons name="create-outline" size={16} color="white" />
                            <Text style={styles.entryTriggerText}>ENTER SCORECARD</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Premium Tabs */}
            <View style={styles.tabBar}>
                {[
                    { id: 'live', label: 'LIVE', icon: 'pulse' },
                    { id: 'scorecard', label: 'SCORECARD', icon: 'list' },
                    { id: 'highlights', label: 'HIGHLIGHTS', icon: 'videocam' },
                    { id: 'insights', label: 'INSIGHTS', icon: 'bar-chart' },
                    { id: 'info', label: 'INFO', icon: 'information-circle' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                        onPress={() => setActiveTab(tab.id as any)}
                    >
                        <Ionicons
                            name={tab.icon as any}
                            size={18}
                            color={activeTab === tab.id ? colors.primary : colors.text.tertiary}
                        />
                        <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'live' && renderLiveCommentary()}

                {activeTab === 'scorecard' && (
                    <View style={styles.scorecardContainer}>
                        {/* Innings Selector Toggle */}
                        <View style={styles.inningsToggleBar}>
                            <TouchableOpacity
                                style={[styles.inningsToggle, activeInnings === 'team_a' && styles.activeInningsToggle]}
                                onPress={() => setActiveInnings('team_a')}
                            >
                                <Text style={[styles.inningsToggleText, activeInnings === 'team_a' && styles.activeInningsToggleText]}>{match.team_a.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.inningsToggle, activeInnings === 'team_b' && styles.activeInningsToggle]}
                                onPress={() => setActiveInnings('team_b')}
                            >
                                <Text style={[styles.inningsToggleText, activeInnings === 'team_b' && styles.activeInningsToggleText]}>{match.team_b.name}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* High Contrast Scoreboard */}
                        <View style={styles.scoreboardBrand}>
                            <Text style={[styles.brandTitle, { color: activeInnings === 'team_a' ? getTeamColor(match.team_a.name) : getTeamColor(match.team_b.name) }]}>
                                {activeInnings === 'team_a' ? match.team_a.name : match.team_b.name}
                            </Text>
                            <Text style={styles.brandTotal}>
                                {activeInnings === 'team_a' ? match.team_a.score : match.team_b.score}
                            </Text>
                        </View>

                        <View style={styles.scorecardHeaderRow}>
                            <Text style={styles.headerLabelPlayer}>BATTER</Text>
                            <View style={styles.headerStats}>
                                <Text style={styles.headerLabel}>R</Text>
                                <Text style={styles.headerLabel}>B</Text>
                                <Text style={styles.headerLabel}>4s</Text>
                                <Text style={styles.headerLabel}>6s</Text>
                                <Text style={styles.headerLabel}>SR</Text>
                            </View>
                        </View>
                        {(activeInnings === 'team_a' ? match.scorecard?.team_aInnings : match.scorecard?.team_bInnings)?.map((item, index) => (
                            <View key={index}>{renderScorecardItem({ item })}</View>
                        ))}

                        <View style={[styles.scoreboardBrand, { marginTop: spacing.xl, backgroundColor: '#F3F4F6' }]}>
                            <Text style={[styles.brandTitle, { color: activeInnings === 'team_a' ? getTeamColor(match.team_b.name) : getTeamColor(match.team_a.name) }]}>
                                {activeInnings === 'team_a' ? match.team_b.name : match.team_a.name} Bowling
                            </Text>
                        </View>
                        <View style={styles.scorecardHeaderRow}>
                            <Text style={styles.headerLabelPlayer}>BOWLER</Text>
                            <View style={styles.headerStats}>
                                <Text style={styles.headerLabel}>O</Text>
                                <Text style={styles.headerLabel}>M</Text>
                                <Text style={styles.headerLabel}>R</Text>
                                <Text style={styles.headerLabel}>W</Text>
                                <Text style={styles.headerLabel}>ER</Text>
                            </View>
                        </View>
                        {(activeInnings === 'team_a' ? match.scorecard?.team_aBowling : match.scorecard?.team_bBowling)?.map((item, index) => (
                            <View key={index}>{renderBowlerItem({ item })}</View>
                        ))}
                    </View>
                )}

                {activeTab === 'highlights' && renderHighlights()}

                {activeTab === 'insights' && (
                    <View style={styles.insightsContainer}>
                        {!isProMember ? (
                            <View style={styles.proLockOverlay}>
                                <Ionicons name="lock-closed" size={48} color="#94A3B8" />
                                <Text style={styles.proLockTitle}>Elite Insights Locked</Text>
                                <Text style={styles.proLockDesc}>
                                    Upgrade to CricPro Elite to unlock advanced wagon wheels, pitch maps, and predictive analytics.
                                </Text>
                                <TouchableOpacity style={styles.proUpgradeBtn} onPress={() => navigation.navigate('ProClub')}>
                                    <Ionicons name="shield-checkmark" size={16} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.proUpgradeBtnText}>Unlock Now</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.insightsContent}>
                                <Text style={styles.sectionTitle}>Wagon Wheel</Text>
                                <View style={styles.mockChartBox}>
                                    <Ionicons name="pie-chart-outline" size={60} color={colors.primary} />
                                    <Text style={styles.mockChartText}>Advanced Wagon Wheel Data</Text>
                                </View>
                                <Text style={styles.sectionTitle}>Run Rate Comparison</Text>
                                <View style={styles.mockChartBox}>
                                    <Ionicons name="trending-up-outline" size={60} color={colors.primary} />
                                    <Text style={styles.mockChartText}>Predictive Run Rate Graphs</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'info' && (
                    <View style={styles.infoContainer}>
                        {match.status === 'finished' && (
                            <View style={styles.reportSection}>
                                <Text style={styles.sectionTitle}>Match Report</Text>
                                <View style={styles.reportCard}>
                                    <View style={styles.reportRow}>
                                        <Text style={styles.reportLabel}>{match.team_a.name}</Text>
                                        <Text style={styles.reportValue}>{match.team_a.score} ({match.team_a.overs} Ov)</Text>
                                    </View>
                                    <View style={styles.reportRow}>
                                        <Text style={styles.reportLabel}>{match.team_b.name}</Text>
                                        <Text style={styles.reportValue}>{match.team_b.score} ({match.team_b.overs} Ov)</Text>
                                    </View>
                                    <View style={styles.resultBadge}>
                                        <Text style={styles.resultBadgeText}>{match.result}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.matchFactCard}>
                            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                            <View style={styles.factContent}>
                                <Text style={styles.factLabel}>Match Date</Text>
                                <Text style={styles.factValue}>{match.time}</Text>
                            </View>
                        </View>
                        <View style={styles.matchFactCard}>
                            <Ionicons name="pin-outline" size={24} color={colors.primary} />
                            <View style={styles.factContent}>
                                <Text style={styles.factLabel}>Venue</Text>
                                <Text style={styles.factValue}>{match.venue}</Text>
                            </View>
                        </View>
                        <View style={styles.matchFactCard}>
                            <Ionicons name="refresh-circle-outline" size={24} color={colors.primary} />
                            <View style={styles.factContent}>
                                <Text style={styles.factLabel}>Toss</Text>
                                <Text style={styles.factValue}>{match.toss}</Text>
                            </View>
                        </View>
                        <View style={styles.umpiresSection}>
                            <Text style={styles.sectionTitle}>Match Officials</Text>
                            <View style={styles.umpireRow}>
                                <Text style={styles.umpireLabel}>Umpires</Text>
                                <Text style={styles.umpireValue}>Nitika S, Rajesh K</Text>
                            </View>
                            <View style={styles.umpireRow}>
                                <Text style={styles.umpireLabel}>Referee</Text>
                                <Text style={styles.umpireValue}>Vimal Prasad</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: staticColors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.lg,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    backButton: {
        padding: spacing.xs,
    },
    headerInfo: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 12,
        color: 'white',
        opacity: 0.8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    liveText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    summaryContainer: {
        backgroundColor: staticColors.primary,
        paddingBottom: spacing.xl,
        borderBottomLeftRadius: radius.xxl,
        borderBottomRightRadius: radius.xxl,
    },
    teamsDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.xl,
        marginTop: spacing.md,
    },
    teamBrand: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    teamCode: {
        marginTop: 8,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    scoreDisplay: {
        alignItems: 'center',
    },
    mainScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    oversCount: {
        fontSize: 10,
        color: 'white',
        opacity: 0.7,
    },
    vsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
    },
    vsLine: {
        width: 1,
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    vsHex: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginVertical: 4,
    },
    vsSmall: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusBanner: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    statusMessage: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: radius.full,
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    entryTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: staticColors.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.md,
        marginTop: spacing.md,
    },
    entryTriggerText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: staticColors.surface,
        paddingTop: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: staticColors.border,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: spacing.md,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: staticColors.primary,
    },
    tabText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
        color: staticColors.text.tertiary,
    },
    activeTabText: {
        color: staticColors.primary,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    commentaryContainer: {
        padding: spacing.md,
    },
    overSummaryCard: {
        backgroundColor: staticColors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: staticColors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: spacing.xl,
    },
    overText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: staticColors.text.primary,
        marginBottom: spacing.sm,
    },
    ballDots: {
        flexDirection: 'row',
        gap: 8,
    },
    ballDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wicketBall: {
        backgroundColor: '#EF4444',
    },
    sixBall: {
        backgroundColor: '#8B5CF6',
    },
    ballDotText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: staticColors.text.primary,
    },
    overRuns: {
        marginTop: spacing.sm,
        fontSize: 12,
        color: staticColors.text.secondary,
        fontWeight: '500',
    },
    commentaryItem: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    commOver: {
        width: 45,
        fontSize: 14,
        fontWeight: 'bold',
        color: staticColors.primary,
    },
    commTextContainer: {
        flex: 1,
        paddingLeft: spacing.sm,
        borderLeftWidth: 1,
        borderLeftColor: staticColors.border,
    },
    commText: {
        fontSize: 14,
        lineHeight: 20,
        color: staticColors.text.primary,
    },
    highlightsGrid: {
        padding: spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    highlightCard: {
        width: '48%',
        marginBottom: spacing.lg,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: staticColors.surface,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    highlightThumb: {
        width: '100%',
        height: 100,
    },
    playOverlay: {
        position: 'absolute',
        top: 35,
        left: '50%',
        marginLeft: -15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlightInfo: {
        padding: spacing.sm,
    },
    highlightTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: staticColors.text.primary,
    },
    highlightTime: {
        fontSize: 10,
        color: staticColors.text.tertiary,
        marginTop: 2,
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
        backgroundColor: staticColors.surface,
    },
    inningsToggleText: {
        fontSize: 12,
        color: staticColors.text.secondary,
        fontWeight: '500',
    },
    activeInningsToggleText: {
        color: staticColors.primary,
        fontWeight: 'bold',
    },
    scoreboardBrand: {
        backgroundColor: staticColors.primary,
        padding: spacing.md,
        borderRadius: radius.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    brandTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    brandTotal: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scorecardHeaderRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: spacing.sm,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: staticColors.border,
    },
    headerLabelPlayer: {
        flex: 2,
        fontSize: 10,
        fontWeight: 'bold',
        color: staticColors.text.tertiary,
    },
    headerStats: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerLabel: {
        width: 35,
        textAlign: 'right',
        fontSize: 10,
        fontWeight: 'bold',
        color: staticColors.text.tertiary,
    },
    scoreRow: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: staticColors.border,
    },
    scorePlayerInfo: {
        flex: 2,
    },
    playerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: staticColors.text.primary,
    },
    howOutText: {
        fontSize: 10,
        color: staticColors.text.tertiary,
        marginTop: 2,
    },
    scoreStats: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statValue: {
        width: 35,
        textAlign: 'right',
        fontSize: 13,
        color: staticColors.text.primary,
    },
    infoContainer: {
        padding: spacing.md,
    },
    reportSection: {
        marginBottom: spacing.xl,
    },
    reportCard: {
        backgroundColor: staticColors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: staticColors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    reportLabel: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: staticColors.text.primary,
    },
    reportValue: {
        ...typography.presets.body,
        color: staticColors.text.secondary,
    },
    resultBadge: {
        backgroundColor: '#E0F2FE',
        paddingVertical: 10,
        borderRadius: radius.md,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    resultBadgeText: {
        color: '#0369A1',
        fontWeight: 'bold',
        fontSize: 13,
    },
    matchFactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: staticColors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: staticColors.border,
    },
    factContent: {
        marginLeft: spacing.lg,
    },
    factLabel: {
        fontSize: 12,
        color: staticColors.text.tertiary,
    },
    factValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: staticColors.text.primary,
        marginTop: 2,
    },
    umpiresSection: {
        marginTop: spacing.lg,
        backgroundColor: staticColors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: staticColors.border,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: staticColors.text.primary,
        marginBottom: spacing.md,
    },
    umpireRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: staticColors.border,
    },
    umpireLabel: {
        fontSize: 14,
        color: staticColors.text.secondary,
    },
    umpireValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: staticColors.text.primary,
    },
    shareButton: {
        padding: spacing.xs,
    },
    insightsContainer: {
        padding: spacing.lg,
    },
    proLockOverlay: {
        backgroundColor: staticColors.surfaceHighlight,
        borderRadius: radius.lg,
        padding: spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: spacing.xl,
    },
    proLockTitle: {
        ...typography.presets.h3,
        color: staticColors.text.primary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    proLockDesc: {
        ...typography.presets.bodySmall,
        color: staticColors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 20,
    },
    proUpgradeBtn: {
        flexDirection: 'row',
        backgroundColor: '#F59E0B',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        alignItems: 'center',
    },
    proUpgradeBtnText: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#FFF',
    },
    insightsContent: {},
    mockChartBox: {
        height: 200,
        backgroundColor: staticColors.surfaceHighlight,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    mockChartText: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
        marginTop: spacing.sm,
    },
});
