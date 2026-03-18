import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface PlayerStat {
  name: string;
  desc?: string;
  r?: number;
  b?: number;
  fours?: number;
  sixes?: number;
  sr?: number;
  o?: number;
  m?: number;
  runs?: number;
  w?: number;
  econ?: number;
  isNotOut?: boolean;
}

interface InningsData {
  teamName: string;
  score: number;
  wickets: number;
  overs: string | number;
  battingStats: PlayerStat[];
  bowlingStats: PlayerStat[];
  bestBatter: { name: string; score: string; balls: string };
  bestBowler: { name: string; wickets: string; runs: string; overs: string };
  extrasStr: string;
}

interface Props {
  onNext: () => void;
  onClose: () => void;
  title?: string;
  buttonText?: string;
  // Legacy support for single innings break
  teamName?: string;
  score?: number;
  wickets?: number;
  overs?: string | number;
  battingStats?: PlayerStat[];
  bowlingStats?: PlayerStat[];
  bestBatter?: { name: string; score: string; balls: string };
  bestBowler?: { name: string; wickets: string; runs: string; overs: string };
  extrasStr?: string;
  isFirstInnings?: boolean;
  // New dual innings support
  allInningsData?: InningsData[];
}

const InstantMatchSummary: React.FC<Props> = ({ 
  onNext, 
  onClose,
  title = "Innings Summary",
  buttonText,
  allInningsData,
  ...legacyProps
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  // If allInningsData is provided, use it. Otherwise fallback to legacy props
  const currentData = allInningsData ? allInningsData[activeTab] : legacyProps as InningsData;
  const isMatchFinished = !!allInningsData && allInningsData.length > 1;

  if (!currentData) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ChevronLeft color="#FFFFFF" size={28} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{currentData.teamName} — {currentData.score}/{currentData.wickets} ({currentData.overs} ov)</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Innings Switcher (Only shown when match is finished) */}
      {isMatchFinished && (
        <View style={styles.switcherContainer}>
          {allInningsData.map((inn, idx) => (
            <TouchableOpacity 
              key={idx}
              style={[styles.switcherTab, activeTab === idx && styles.activeSwitcherTab]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.switcherText, activeTab === idx && styles.activeSwitcherText]}>
                {inn.teamName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Performers */}
        <Text style={styles.sectionTitle}>TOP PERFORMERS</Text>
        <View style={styles.performersContainer}>
          <View style={styles.performerCard}>
            <Text style={styles.performerRole}>BEST BATTER</Text>
            <Text style={styles.performerName}>{currentData.bestBatter.name}</Text>
            <Text style={styles.performerStats}>
              <Text style={styles.highlightStat}>{currentData.bestBatter.score}</Text> ({currentData.bestBatter.balls})
            </Text>
          </View>
          <View style={styles.performerCard}>
            <Text style={styles.performerRole}>BEST BOWLER</Text>
            <Text style={styles.performerName}>{currentData.bestBowler.name}</Text>
            <Text style={styles.performerStats}>
              <Text style={styles.highlightStat}>{currentData.bestBowler.wickets}/{currentData.bestBowler.runs}</Text> ({currentData.bestBowler.overs})
            </Text>
          </View>
        </View>

        {/* Batting Card */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderText}>Batting</Text>
          </View>
          <View style={styles.tableColumnHeader}>
            <Text style={[styles.colText, styles.colFlex2, styles.textBold]}>Batsman</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>R</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>B</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>4s</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>6s</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>SR</Text>
          </View>
          
          {currentData.battingStats.map((player, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={styles.colFlex2}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={[styles.playerDesc, player.isNotOut && styles.notOutText]}>
                  {player.desc}
                </Text>
              </View>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>{player.r}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.b}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.fours}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.sixes}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.sr}</Text>
            </View>
          ))}

          <View style={styles.tableFooter}>
            <Text style={styles.footerText}>Extras: <Text style={styles.textBold}>{currentData.extrasStr}</Text></Text>
            <Text style={styles.footerText}>Total: <Text style={styles.textBold}>{currentData.score}/{currentData.wickets}</Text></Text>
          </View>
        </View>

        {/* Bowling Card */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderText}>Bowling</Text>
          </View>
          <View style={styles.tableColumnHeader}>
            <Text style={[styles.colText, styles.colFlex2, styles.textBold]}>Bowler</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>O</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>M</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>R</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>W</Text>
            <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.textBold]}>Econ</Text>
          </View>
          
          {currentData.bowlingStats.map((player, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={styles.colFlex2}>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.o?.toFixed(1)}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.m}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.runs}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight, styles.highlightStat]}>{player.w}</Text>
              <Text style={[styles.colText, styles.colFlex1, styles.textRight]}>{player.econ?.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity style={styles.mainButton} onPress={onNext}>
          <Text style={styles.mainButtonText}>{buttonText || (legacyProps.isFirstInnings ? "START 2ND INNINGS" : "FINISH MATCH")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSafeArea: {
    backgroundColor: '#800000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#800000',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSwitcherTab: {
    backgroundColor: '#800000',
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  activeSwitcherText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#800000',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  performersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  performerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  performerRole: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  performerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  performerStats: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  highlightStat: {
    color: '#800000',
    fontWeight: '900',
    fontSize: 15,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
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
    fontSize: 16,
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
  colText: {
    fontSize: 13,
    color: '#0F172A',
  },
  textBold: {
    fontWeight: '800',
  },
  textRight: {
    textAlign: 'right',
  },
  colFlex2: {
    flex: 2.5,
  },
  colFlex1: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  playerDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  notOutText: {
    color: '#EF4444',
    fontWeight: '700',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#475569',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  mainButton: {
    backgroundColor: '#800000',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default InstantMatchSummary;
