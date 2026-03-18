import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  StatusBar,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, MapPin, ChevronRight, Trophy } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Tournament } from '../store/useTeamStore';

// ... (Constants like GROUP_A_STANDINGS and FIXTURES removed as we'll use dynamic data)

const TournamentDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { tournaments } = useTeamStore();
  
  // Get latest tournament data from store or fallback to route params
  const routeTournament = route?.params?.tournament;
  const tournament = tournaments.find(t => t.id === routeTournament?.id) || routeTournament;
  
  const isKnockout = tournament?.format === 'Knockout';
  const DETAIL_TABS = ['Overview', 'Fixtures', isKnockout ? 'Brackets' : 'Points Table', 'Stats', 'Teams'];
  
  const [activeTab, setActiveTab] = useState(isKnockout ? 'Brackets' : 'Points Table');

  const handleShare = async () => {
    await Share.share({ message: `Check out this tournament: ${tournament?.name || 'IPL 2024'}` });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Tournament Detail</Text>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={handleShare}
          accessibilityRole="button" accessibilityLabel="Share tournament"
        >
          <Share2 color={Colors.text} size={20} />
        </Pressable>
      </View>

      {/* Detail Tabs */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {DETAIL_TABS.map(tab => (
            <Pressable
              key={tab}
              style={styles.tabBarItem}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityLabel={tab}
              accessibilityState={{ selected: activeTab === tab }}
            >
              <Text style={[styles.tabBarText, activeTab === tab ? styles.tabBarTextActive : null]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Brackets (Knockout only) */}
        {activeTab === 'Brackets' && (
          <View style={styles.bracketContainer}>
            <Text style={styles.tableTitle}>Tournament Bracket</Text>
            <View style={styles.bracketScroll}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.bracketRound}>
                  <Text style={styles.roundLabel}>QUARTER FINALS</Text>
                  {(tournament?.fixtures || []).filter((f: any) => f.round === 'Quarter Final' || f.round === 'Round 1').map((fix: any) => (
                    <View key={fix.id} style={styles.bracketMatch}>
                      <View style={styles.bracketTeam}>
                        <Text style={styles.bracketTeamName}>{fix.team1}</Text>
                        <Text style={styles.bracketScore}>{fix.t1score || '-'}</Text>
                      </View>
                      <View style={styles.bracketDivider} />
                      <View style={styles.bracketTeam}>
                        <Text style={styles.bracketTeamName}>{fix.team2}</Text>
                        <Text style={styles.bracketScore}>{fix.t2score || '-'}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Connection Lines (Visual Simulation) */}
                <View style={styles.bracketLines} />

                <View style={styles.bracketRound}>
                  <Text style={styles.roundLabel}>SEMI FINALS</Text>
                  <View style={styles.bracketMatchPlaceholder}>
                    <Text style={styles.placeholderMatchText}>Winner QF1 vs QF2</Text>
                  </View>
                  <View style={styles.bracketMatchPlaceholder}>
                    <Text style={styles.placeholderMatchText}>Winner QF3 vs QF4</Text>
                  </View>
                </View>

                <View style={styles.bracketRound}>
                  <Text style={styles.roundLabel}>FINAL</Text>
                  <View style={[styles.bracketMatch, styles.finalMatch]}>
                    <Trophy color={Colors.maroon} size={24} style={{ marginBottom: 8 }} />
                    <Text style={styles.placeholderMatchText}>Grand Finale</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Points Table */}
        {activeTab === 'Points Table' && (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>Standard Standings</Text>
              <View style={styles.seasonBadge}><Text style={styles.seasonText}>{tournament?.name}</Text></View>
            </View>

            {/* Table header row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader, { width: 44 }]}>POS</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>TEAM</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader, { width: 40, textAlign: 'right' }]}>PTS</Text>
            </View>

            {(tournament?.standings?.length ? tournament.standings : []).map((row: any, idx: number) => {
              return (
                <View key={idx} style={styles.teamRow}>
                  <View style={[styles.sideBar, { backgroundColor: idx < 2 ? '#4CAF50' : 'transparent' }]} />
                  <Text style={styles.posNum}>{idx + 1}</Text>
                  <View style={[styles.teamBadge, { backgroundColor: Colors.maroon }]}>
                    <Text style={styles.teamBadgeText}>{row.team.charAt(0)}</Text>
                  </View>
                  <Text style={styles.teamName} numberOfLines={1}>{row.team}</Text>
                  <Text style={styles.ptsText}>{row.pts}</Text>
                </View>
              );
            })}
            
            {(!tournament?.standings?.length) && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyTableText}>No standings available yet.</Text>
              </View>
            )}

            {/* Legend */}
            <View style={styles.legend}>
              {[
                { color: '#4CAF50', label: 'Qualifier' },
                { color: Colors.maroon, label: 'Current' },
              ].map(item => (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Fixtures */}
        {activeTab === 'Fixtures' && (
          <View style={{ gap: 12 }}>
            {(tournament?.fixtures?.length ? tournament.fixtures : []).map((fix: any) => (
              <View key={fix.id} style={styles.fixtureCard}>
                <View style={styles.fixtureHeader}>
                  <Text style={styles.fixtureRound}>{fix.round}</Text>
                  {fix.status === 'completed' ? (
                    <View style={styles.finishedBadge}><Text style={styles.finishedText}>FINISHED</Text></View>
                  ) : (
                    <View style={styles.upcomingBadge}><Text style={styles.upcomingText}>UPCOMING</Text></View>
                  )}
                </View>
                <View style={styles.fixtureTeamRow}>
                  <Text style={styles.fixtureTeam}>{fix.team1}</Text>
                  {fix.t1score && <Text style={styles.fixtureScore}>{fix.t1score}</Text>}
                </View>
                <View style={styles.fixtureTeamRow}>
                  <Text style={styles.fixtureTeam}>{fix.team2}</Text>
                  {fix.t2score && <Text style={styles.fixtureScore}>{fix.t2score}</Text>}
                </View>
                {fix.result && <Text style={styles.fixtureResult}>{fix.result}</Text>}
              </View>
            ))}
            {(!tournament?.fixtures?.length) && (
              <View style={styles.emptyTable}>
                 <Text style={styles.emptyTableText}>No fixtures generated yet.</Text>
              </View>
            )}
          </View>
        )}

        {/* Overview */}
        {activeTab === 'Overview' && (
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>{tournament?.name || 'Premier League Season 4'}</Text>
            <View style={styles.overviewRow}>
              <MapPin color={Colors.textSecondary} size={14} />
              <Text style={styles.overviewMeta}>{tournament?.venue || 'Mumbai Sports Complex'}</Text>
            </View>
            <View style={styles.overviewStats}>
              {[
                { label: 'FORMAT', value: tournament?.format || 'T20' },
                { label: 'TEAMS', value: `${tournament?.teamsJoined || 12}/${tournament?.maxTeams || 16}` },
                { label: 'STATUS', value: (tournament?.status || 'LIVE').toUpperCase() },
              ].map(stat => (
                <View key={stat.label} style={styles.overviewStat}>
                  <Text style={styles.overviewStatLabel}>{stat.label}</Text>
                  <Text style={styles.overviewStatValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats Tab */}
        {activeTab === 'Stats' && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Series Leaders</Text>
            
            {/* Most Runs */}
            <View style={styles.leaderCard}>
              <View style={styles.leaderHeader}>
                <Text style={styles.leaderTitle}>Most Runs</Text>
              </View>
              <View style={styles.emptyTable}>
                <Text style={styles.emptyTableText}>Stats will be updated after matches.</Text>
              </View>
            </View>

            {/* Most Wickets */}
            <View style={styles.leaderCard}>
              <View style={styles.leaderHeader}>
                <Text style={styles.leaderTitle}>Most Wickets</Text>
              </View>
              <View style={styles.emptyTable}>
                <Text style={styles.emptyTableText}>Stats will be updated after matches.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Teams Tab */}
        {activeTab === 'Teams' && (
          <View style={styles.teamsContainer}>
            <Text style={styles.sectionTitle}>Participating Squads</Text>
            <View style={styles.teamsGrid}>
              {(tournament?.teams || []).map((teamName: string) => (
                <Pressable key={teamName} style={styles.squadCard}>
                  <View style={[styles.squadBadge, { backgroundColor: Colors.maroon }]}>
                    <Text style={styles.squadBadgeText}>{teamName.charAt(0)}</Text>
                  </View>
                  <View style={styles.squadInfo}>
                    <Text style={styles.squadName} numberOfLines={1}>{teamName}</Text>
                    <Text style={styles.squadMeta}>Squad Registered</Text>
                  </View>
                  <ChevronRight color={Colors.textSecondary} size={16} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  tabBarContainer: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabBar: { paddingHorizontal: 8, gap: 4 },
  tabBarItem: { paddingHorizontal: 14, paddingVertical: 14, alignItems: 'center' },
  tabBarText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  tabBarTextActive: { color: Colors.maroon },
  tabUnderline: { position: 'absolute', bottom: 0, left: 6, right: 6, height: 2.5, backgroundColor: Colors.maroon, borderRadius: 2 },
  body: { padding: 16, paddingBottom: 40 },

  // Points Table
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tableTitle: { fontSize: 18, fontWeight: '900', color: Colors.text },
  seasonBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  seasonText: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#F8F8F8', borderRadius: 8, marginBottom: 4 },
  tableCell: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  tableCellHeader: {},
  teamRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 0, paddingRight: 14, paddingVertical: 14, backgroundColor: Colors.white, borderRadius: 10, marginBottom: 2, overflow: 'hidden' },
  teamRowYou: { backgroundColor: Colors.maroon },
  sideBar: { width: 5, alignSelf: 'stretch', borderRadius: 2, marginRight: 14 },
  posNum: { width: 30, fontSize: 15, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  teamBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  teamBadgeText: { fontSize: 13, fontWeight: '900', color: Colors.white },
  teamName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  ptsText: { fontSize: 15, fontWeight: '900', color: Colors.text, width: 36, textAlign: 'right' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },

  // Fixtures
  fixtureCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 }, android: { elevation: 1 } }), borderLeftWidth: 3, borderLeftColor: Colors.maroon },
  fixtureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  fixtureRound: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  finishedBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  finishedText: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary },
  upcomingBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  upcomingText: { fontSize: 10, fontWeight: '800', color: '#1565C0' },
  fixtureTeamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  fixtureTeam: { fontSize: 14, fontWeight: '700', color: Colors.text },
  fixtureScore: { fontSize: 14, fontWeight: '800', color: Colors.text },
  fixtureResult: { fontSize: 12, fontWeight: '700', color: Colors.maroon, marginTop: 8 },
  reminderBtn: { backgroundColor: Colors.maroon, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 12, minHeight: 44 },
  reminderBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },

  // Overview
  overviewCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  overviewTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  overviewRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 },
  overviewMeta: { fontSize: 13, color: Colors.textSecondary },
  overviewStats: { flexDirection: 'row', gap: 0 },
  overviewStat: { flex: 1, alignItems: 'center' },
  overviewStatLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 4 },
  overviewStatValue: { fontSize: 18, fontWeight: '900', color: Colors.text },

  // Placeholders
  placeholderSection: { alignItems: 'center', paddingTop: 60, gap: 12 },
  placeholderEmoji: { fontSize: 48 },
  placeholderText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },

  // Stats
  statsContainer: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  leaderCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderLeftWidth: 3, borderLeftColor: Colors.maroon, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 1 } }) },
  leaderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  leaderTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  viewAllText: { fontSize: 12, fontWeight: '700', color: Colors.maroon },
  playerStatRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  topPlayer: { backgroundColor: '#FFFAFA', borderRadius: 8, paddingHorizontal: 4 },
  playerIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  playerIconText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  playerInfo: { flex: 1, gap: 2 },
  playerName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  playerSubText: { fontSize: 12, color: Colors.textSecondary },
  playerMetrics: { alignItems: 'flex-end', minWidth: 60 },
  metricLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  metricValue: { fontSize: 14, fontWeight: '900', color: Colors.text },

  // Teams
  teamsContainer: { gap: 16 },
  teamsGrid: { gap: 10 },
  squadCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, gap: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 1 } }) },
  squadBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  squadBadgeText: { fontSize: 18, fontWeight: '900', color: Colors.white },
  squadInfo: { flex: 1, gap: 2 },
  squadName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  squadMeta: { fontSize: 12, color: Colors.textSecondary },

  // Bracket Styles
  bracketContainer: { paddingVertical: 10 },
  bracketScroll: { marginTop: 16 },
  bracketRound: { width: 220, marginRight: 20, gap: 14 },
  roundLabel: { fontSize: 12, fontWeight: '900', color: Colors.maroon, letterSpacing: 1, marginBottom: 8, textAlign: 'center', backgroundColor: Colors.peach, paddingVertical: 4, borderRadius: 4 },
  bracketMatch: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E5E5', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 1 } }) },
  bracketTeam: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bracketTeamName: { fontSize: 13, fontWeight: '700', color: Colors.text, flex: 1 },
  bracketScore: { fontSize: 13, fontWeight: '900', color: Colors.maroon, minWidth: 24, textAlign: 'right' },
  bracketDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  bracketLines: { width: 40, marginRight: 10 }, // Space for lines
  bracketMatchPlaceholder: { minHeight: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D0D0D0', padding: 10 },
  placeholderMatchText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
  finalMatch: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9F0', borderColor: '#FFD700', borderWidth: 2 },
  emptyTable: { padding: 40, alignItems: 'center' },
  emptyTableText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
});

export default TournamentDetailScreen;
