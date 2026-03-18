import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { ArrowLeft, RotateCcw, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { useTeamStore, PlayerStats } from '../store/useTeamStore';

const { width } = Dimensions.get('window');

// ─── Static Data ────────────────────────────────────────────────────
const RUNS = ['0', '1', '2', '3', '4', '5', '6'];
const EXTRAS = ['Wd', 'Nb', 'B', 'LB', '+'];
const over = [1, 0, 4, 'W', 1, 6]; // current over balls, 'W' = wicket

const LiveScoringScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { updatePlayerStats } = useTeamStore();
  const [lastRun, setLastRun] = useState<string | null>(null);

  const handleScore = (value: string) => {
    setLastRun(value);
    // scoring logic would go here
  };

  const handleFinishMatch = () => {
    Alert.alert('Match Completed', 'Do you want to end this match and update player stats?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Finish & Update', 
        onPress: () => {
          // Mock: Updating Rahul Gupta (r1) and Aditya Sen (r2)
          updatePlayerStats('r1', { 
            MAT: 13, // Incremented
            RUNS: 452 + 34, // Mock runs from this match
            HS: '84',
            AVG: (452 + 34) / 11 // Mock recalculation
          });
          updatePlayerStats('r2', { 
            MAT: 16, 
            WKTS: 24, // +2 wickets mock
          });
          
          Alert.alert('Stats Updated', 'Individual player stats have been updated in their profiles.');
          navigation.goBack();
        }
      }
    ]);
  };

  const getBallStyle = (ball: string | number) => {
    if (ball === 'W') return styles.ballWicket;
    if (ball === 4 || ball === 6) return styles.ballBoundary;
    if (ball === 0) return styles.ballDot;
    return styles.ballNormal;
  };

  const getBallTextStyle = (ball: string | number) => {
    if (ball === 'W') return styles.ballWicketText;
    if (ball === 4 || ball === 6) return styles.ballBoundaryText;
    return styles.ballNormalText;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" translucent={true} />

      {/* ── HEADER CARD ─────────────────────────────────────── */}
      <View style={[styles.headerCard, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTopRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={Colors.white} size={22} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.teamBattingLabel}>MUMBAI XI BATTING</Text>
            <Text style={styles.scoreText}>142/3</Text>
            <Text style={styles.oversText}>(15.2 ov)</Text>
            <Text style={styles.crrText}>CRR 9.14</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.undoBtn, pressed ? { opacity: 0.6 } : null]}
          >
            <RotateCcw color={Colors.white} size={14} />
            <Text style={styles.undoBtnText}>UNDO</Text>
          </Pressable>
        </View>

        {/* Batsmen & Bowler Info */}
        <View style={styles.playersRow}>
          <View style={styles.playerCol}>
            <Text style={styles.playerName}>
              Arjun R* <Text style={styles.playerStats}>34(22)</Text>
            </Text>
            <Text style={styles.playerName}>
              Priya S <Text style={styles.playerStats}>12(18)</Text>
            </Text>
          </View>
          <View style={styles.playerCol}>
            <Text style={[styles.playerName, { textAlign: 'right' }]}>
              Rahul D <Text style={styles.playerStats}>2-24(3)</Text>
            </Text>
            <Text style={[styles.currentBowlerLabel, { textAlign: 'right' }]}>
              ● CURRENT BOWLER
            </Text>
          </View>
        </View>
      </View>

      {/* ── OVER TRACKER ────────────────────────────────────── */}
      <View style={styles.overTrackerContainer}>
        <View style={styles.overTracker}>
          <View style={styles.ballsRow}>
            {over.map((ball, i) => (
              <View key={i} style={[styles.ball, getBallStyle(String(ball))]}>
                <Text style={[styles.ballText, getBallTextStyle(String(ball))]}>
                  {ball}
                </Text>
              </View>
            ))}
            <View style={styles.thisOverLabel}><Text style={styles.thisOverText}>THIS OVER</Text></View>
          </View>
          <View style={styles.partnershipBadge}>
            <Text style={styles.partnershipBadgeText}>PARTNERSHIP:</Text>
            <Text style={styles.partnershipBadgeValue}>42(28)</Text>
          </View>
        </View>

        {/* PRO INSIGHTS BAR */}
        <View style={styles.proInsightsBar}>
           <View style={styles.proLabelBox}>
              <Text style={styles.proLabelBoxText}>PRO</Text>
           </View>
           <Text style={styles.insightsTitle}>INSIGHTS</Text>
           <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>PROJ. SCORE</Text>
              <Text style={styles.insightValue}>186 – 198</Text>
           </View>
           <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>WIN PROB</Text>
              <Text style={[styles.insightValue, {color: '#4CAF50'}]}>64%</Text>
           </View>
        </View>
      </View>

      {/* ── SCORING PAD ─────────────────────────────────────── */}
      <ScrollView contentContainerStyle={styles.scoringPad} showsVerticalScrollIndicator={false}>
        {/* Run Buttons: 0–3 */}
        <View style={styles.runRow}>
          {['0', '1', '2', '3'].map((run) => (
            <Pressable
              key={run}
              style={({ pressed }) => [
                styles.runBtn,
                lastRun === run ? styles.runBtnActive : null,
                pressed ? { opacity: 0.75 } : null,
              ]}
              onPress={() => handleScore(run)}
            >
              <Text style={[styles.runBtnText, lastRun === run ? styles.runBtnActiveText : null]}>
                {run}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Run Buttons: 4–6 (highlighted boundary row) */}
        <View style={styles.runRow}>
          <Pressable
            style={({ pressed }) => [styles.runBtn, styles.runBtnBoundary, pressed ? { opacity: 0.75 } : null]}
            onPress={() => handleScore('4')}
          >
            <Text style={[styles.runBtnText, styles.runBtnBoundaryText]}>4</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.runBtn, pressed ? { opacity: 0.75 } : null]}
            onPress={() => handleScore('5')}
          >
            <Text style={styles.runBtnText}>5</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.runBtn, styles.runBtnSix, pressed ? { opacity: 0.75 } : null]}
            onPress={() => handleScore('6')}
          >
            <Text style={[styles.runBtnText, styles.runBtnBoundaryText]}>6</Text>
          </Pressable>
        </View>

        {/* Extras Row */}
        <View style={styles.extrasRow}>
          {EXTRAS.map((extra) => (
            <Pressable
              key={extra}
              style={({ pressed }) => [styles.extraBtn, pressed ? { opacity: 0.7 } : null]}
              onPress={() => handleScore(extra)}
            >
              <Text style={styles.extraBtnText}>{extra}</Text>
            </Pressable>
          ))}
        </View>

        {/* Finish Match Button */}
        <Pressable
          style={({ pressed }) => [styles.finishMatchBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleFinishMatch}
        >
          <CheckCircle2 color={Colors.white} size={20} />
          <Text style={styles.finishMatchText}>FINISH MATCH & UPDATE STATS</Text>
        </Pressable>
      </ScrollView>

      {/* ── WICKET BUTTON ───────────────────────────────────── */}
      <View style={styles.wicketSection}>
        <Pressable
          style={({ pressed }) => [styles.wicketBtn, pressed ? { opacity: 0.8 } : null]}
          accessibilityRole="button"
          accessibilityLabel="Record a wicket"
        >
          <AlertTriangle color={Colors.white} size={18} />
          <Text style={styles.wicketBtnText}>WICKET</Text>
        </Pressable>
      </View>

      {/* ── STATS FOOTER ────────────────────────────────────── */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>PARTNERSHIP</Text>
          <Text style={styles.statValue}>42 (28)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>EXTRAS</Text>
          <Text style={styles.statValue}>9</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.fullScorecardBtn, pressed ? { opacity: 0.75 } : null]}
          accessibilityRole="button"
          accessibilityLabel="View full scorecard"
        >
          <Text style={styles.fullScorecardText}>FULL SCORECARD</Text>
          <ChevronRight color={Colors.white} size={16} />
        </Pressable>
      </View>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────
const BTN_SIZE = (width - 48 - 12) / 4; // 4 buttons per row

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header
  headerCard: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  teamBattingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scoreText: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 44,
  },
  oversText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -4,
  },
  crrText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 2,
  },
  undoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    minHeight: 44,
    justifyContent: 'center',
  },
  undoBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerCol: {
    flex: 1,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
  },
  currentBowlerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 2,
  },

  // Over Tracker
  overTrackerContainer: {
    backgroundColor: Colors.white,
  },
  overTracker: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ballsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thisOverLabel: {
    marginLeft: 8,
  },
  thisOverText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#90A4AE',
    letterSpacing: 0.5,
  },
  ball: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballNormal: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E6E9EE',
  },
  ballDot: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E6E9EE',
  },
  ballBoundary: {
    backgroundColor: '#1A237E',
  },
  ballWicket: {
    backgroundColor: '#E53935',
  },
  ballText: {
    fontSize: 14,
    fontWeight: '800',
  },
  ballNormalText: {
    color: '#263238',
  },
  ballBoundaryText: {
    color: '#FFFFFF',
  },
  ballWicketText: {
    color: '#FFFFFF',
  },
  partnershipBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partnershipBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  partnershipBadgeValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },

  // Pro Insights Bar
  proInsightsBar: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  proLabelBox: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  proLabelBoxText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.maroon,
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginRight: 'auto',
  },
  insightItem: {
    alignItems: 'flex-end',
    marginLeft: 20,
  },
  insightLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  insightValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFD700',
  },

  // Scoring Pad
  scoringPad: {
    padding: 16,
    gap: 16,
  },
  runRow: {
    flexDirection: 'row',
    gap: 16,
  },
  runBtn: {
    flex: 1,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  runBtnActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  runBtnBoundary: {
    backgroundColor: Colors.maroon,
  },
  runBtnSix: {
    backgroundColor: Colors.maroon,
  },
  runBtnText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
  },
  runBtnActiveText: {
    color: '#1E3A8A',
  },
  runBtnBoundaryText: {
    color: Colors.white,
  },

  // Extras
  extrasRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  extraBtn: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  extraBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },

  // Wicket Button
  wicketSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  wicketBtn: {
    backgroundColor: '#EC4899',
    borderRadius: 18,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#EC4899',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  wicketBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },

  // Stats Footer
  statsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 2,
  },
  fullScorecardBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
  },
  finishMatchBtn: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 }
    })
  },
  finishMatchText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  },
  fullScorecardText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default LiveScoringScreen;
