import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ArrowLeft, MapPin, Zap } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COMMENTARY = [
  { id: '1', over: '14.2', runs: 6, text: 'SIX! What a shot by Virat! That was right in the slot and he deposits it over long on.', isBoundary: true },
  { id: '2', over: '14.1', runs: 0, text: 'Good length delivery outside off, pushed towards point.', isBoundary: false },
  { id: '3', over: '13.6', runs: 'W', text: 'WICKET! Caught at deep mid-wicket. He tried to take on the bowler but mistimed it completely.', isWicket: true },
  { id: '4', over: '13.5', runs: 1, text: 'Short of a length, tapped to square leg for a quick single.', isBoundary: false },
  { id: '5', over: '13.4', runs: 4, text: 'FOUR! Beautiful cover drive piercing the gap perfectly.', isBoundary: true },
  { id: '6', over: '13.3', runs: 0, text: 'Beaten! Lovely away swing from the bowler.', isBoundary: false },
];

const LiveMatchDetailScreen = ({ route, navigation }: any) => {
  const match = route.params?.match || { title: 'Test Match', teams: 'Team A vs Team B', location: 'Stadium', time: 'Live' };
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Live' | 'Scorecard' | 'Info'>('Live');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{match.title}</Text>
          <Text style={styles.headerSubtitle}>{match.location}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <Zap color="#FF3B30" size={14} fill="#FF3B30" />
        </View>
      </View>

      {/* Match Score Banner */}
      <View style={styles.scoreBanner}>
        <Text style={styles.teamsHeading}>{match.teams}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.mainScore}>142/4</Text>
          <Text style={styles.overText}>(14.2 ov)</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>CRR: 9.90</Text>
          <View style={styles.bullet} />
          <Text style={styles.statsText}>Proj: 198</Text>
        </View>
        <Text style={styles.statusText}>State XI won the toss and elected to bowl</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Live', 'Scorecard', 'Info'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === 'Live' && (
          <>
            {/* Current Players */}
            <View style={styles.playersCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>BATTERS</Text>
                <Text style={styles.sectionValue}>R (B)</Text>
              </View>
              <View style={styles.playerRow}>
                <Text style={styles.playerName}>Virat K. <Text style={styles.asterisk}>*</Text></Text>
                <Text style={styles.playerScore}>72 <Text style={styles.playerBalls}>(35)</Text></Text>
              </View>
              <View style={styles.playerRow}>
                <Text style={styles.playerName}>Rajat P.</Text>
                <Text style={styles.playerScore}>42 <Text style={styles.playerBalls}>(24)</Text></Text>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>BOWLER</Text>
                <Text style={styles.sectionValue}>O-M-R-W</Text>
              </View>
              <View style={styles.playerRow}>
                <Text style={styles.playerName}>Prasidh K. <Text style={styles.asterisk}>*</Text></Text>
                <Text style={styles.playerScore}>3.2 - 0 - 28 - <Text style={{color: '#FF3B30'}}>2</Text></Text>
              </View>
            </View>

            {/* Commentary */}
            <Text style={styles.timelineTitle}>Recent Commentary</Text>
            {COMMENTARY.map(comment => (
              <View key={comment.id} style={styles.commentaryRow}>
                <View style={styles.commentaryOver}>
                  <Text style={styles.overNumber}>{comment.over}</Text>
                </View>
                <View style={[
                  styles.runsBubble, 
                  comment.isBoundary && styles.boundaryBubble,
                  comment.isWicket && styles.wicketBubble
                ]}>
                  <Text style={[
                    styles.runsText,
                    comment.isBoundary && styles.boundaryText,
                    comment.isWicket && styles.wicketText
                  ]}>{comment.runs}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </>
        )}

        {activeTab === 'Scorecard' && (
          <View style={styles.scorecardCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderText}>Batting</Text>
            </View>
            <View style={styles.tableColumnHeader}>
              <Text style={[styles.colText, styles.colFlex2, styles.textBold]}>Batsman</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>R</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>B</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>SR</Text>
            </View>
            {[
              { name: 'Virat K.', desc: 'batting', r: 72, b: 35, sr: 205.7, isNotOut: true },
              { name: 'Rajat P.', desc: 'batting', r: 42, b: 24, sr: 175.0, isNotOut: true },
              { name: 'Glenn M.', desc: 'c Fielder b Bowler', r: 12, b: 8, sr: 150.0 }
            ].map((p, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colFlex2}>
                  <Text style={styles.playerNameSmall}>{p.name}</Text>
                  <Text style={[styles.playerDescSmall, p.isNotOut && { color: '#EF4444' }]}>{p.desc}</Text>
                </View>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>{p.r}</Text>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{p.b}</Text>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{p.sr}</Text>
              </View>
            ))}

            <View style={[styles.tableHeaderRow, { marginTop: 20 }]}>
              <Text style={styles.tableHeaderText}>Bowling</Text>
            </View>
            <View style={styles.tableColumnHeader}>
              <Text style={[styles.colText, styles.colFlex2, styles.textBold]}>Bowler</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>O</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>R</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>W</Text>
            </View>
            {[
              { name: 'Prasidh K.', o: 3.2, runs: 28, w: 2 },
              { name: 'Shreyas G.', o: 4.0, runs: 45, w: 1 },
            ].map((p, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colFlex2}>
                  <Text style={styles.playerNameSmall}>{p.name}</Text>
                </View>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{p.o}</Text>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{p.runs}</Text>
                <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold, { color: '#800000' }]}>{p.w}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Info' && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Match</Text>
              <Text style={styles.infoValue}>{match.teams}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tournament</Text>
              <Text style={styles.infoValue}>{match.title}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{match.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Toss</Text>
              <Text style={styles.infoValue}>State XI elected to bowl</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Umpires</Text>
              <Text style={styles.infoValue}>Anil Chaudhary, Nitin Menon</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  liveIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBanner: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  teamsHeading: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  mainScore: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 48,
  },
  overText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statsText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  statusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.maroon,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.maroon,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  playersCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 1,
  },
  sectionValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  asterisk: {
    color: Colors.maroon,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  playerBalls: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    marginLeft: 4,
  },
  commentaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 40,
  },
  commentaryOver: {
    width: 44,
  },
  overNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 6,
  },
  runsBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boundaryBubble: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  wicketBubble: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  runsText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#475569',
  },
  boundaryText: {
    color: '#0284C7',
  },
  wicketText: {
    color: '#DC2626',
  },
  commentText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginTop: 4,
  },
  scorecardCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tableHeaderRow: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  tableColumnHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  colFlex2: { flex: 2.5 },
  colFlex1: { flex: 1 },
  textBold: { fontWeight: '800' },
  textRight: { textAlign: 'right' },
  colText: { fontSize: 12, color: '#0F172A' },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  playerNameSmall: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  playerDescSmall: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 2,
    textAlign: 'right',
  }
});

export default LiveMatchDetailScreen;
