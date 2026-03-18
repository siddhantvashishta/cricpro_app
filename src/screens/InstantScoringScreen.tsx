import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  UserPlus,
  Share2,
  Trophy as TrophyIcon
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, InstantMatch } from '../store/useTeamStore';
import InstantMatchSummary from '../components/InstantMatchSummary';

const { width } = Dimensions.get('window');

const InstantScoringScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { teamA, teamB, overs: matchOvers } = route.params;
  const { addInstantMatch, updateGlobalLiveMatch, players } = useTeamStore();

  // Match State
  const [innings, setInnings] = useState(1);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [currentOverBalls, setCurrentOverBalls] = useState<(string | number)[]>([]);

  // Detailed Scorecard State
  const [battingData, setBattingData] = useState<Record<string, any>>({});
  const [bowlingData, setBowlingData] = useState<Record<string, any>>({});
  const [extras, setExtras] = useState({ w: 0, nb: 0, b: 0, lb: 0, total: 0 });
  
  // Players
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const [lastBowler, setLastBowler] = useState('');

  useEffect(() => {
    if (striker && !battingData[striker]) {
      setBattingData(prev => ({ ...prev, [striker]: { r: 0, b: 0, fours: 0, sixes: 0, isNotOut: true } }));
    }
    if (nonStriker && !battingData[nonStriker]) {
      setBattingData(prev => ({ ...prev, [nonStriker]: { r: 0, b: 0, fours: 0, sixes: 0, isNotOut: true } }));
    }
    if (bowler && !bowlingData[bowler]) {
      setBowlingData(prev => ({ ...prev, [bowler]: { balls: 0, runs: 0, wickets: 0, maidens: 0 } }));
    }
  }, [striker, nonStriker, bowler]);

  // History/Scorecard Data
  const [innings1Data, setInnings1Data] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);

  // Modals
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false);
  const [showNewBowlerModal, setShowNewBowlerModal] = useState(false);
  const [showInningsBreakModal, setShowInningsBreakModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Temp form inputs
  const [tempStriker, setTempStriker] = useState('');
  const [tempNonStriker, setTempNonStriker] = useState('');
  const [tempBowler, setTempBowler] = useState('');

  const currentOverNum = Math.floor(balls / 6);
  const ballInOver = balls % 6;
  const oversCompleted = `${currentOverNum}.${ballInOver}`;
  const crr = balls > 0 ? ((score / balls) * 6).toFixed(2) : '0.00';
  const target = innings === 2 ? innings1Data.score + 1 : null;
  const rrr = (innings === 2 && (matchOvers * 6 - balls) > 0) 
    ? (((target! - score) / (matchOvers * 6 - balls)) * 6).toFixed(2) 
    : '0.00';

  const formatBattingStats = (data: any) => {
    return Object.keys(data).map(name => {
      const p = data[name];
      const sr = p.b > 0 ? ((p.r / p.b) * 100).toFixed(1) : '0.0';
      return {
        name, desc: p.isNotOut ? 'not out' : p.desc, isNotOut: p.isNotOut,
        r: p.r, b: p.b, fours: p.fours, sixes: p.sixes, sr: parseFloat(sr)
      };
    });
  };

  const formatBowlingStats = (data: any) => {
    return Object.keys(data).map(name => {
      const p = data[name];
      const oversNum = Math.floor(p.balls / 6) + (p.balls % 6) / 10;
      const econ = p.balls > 0 ? (p.runs / (p.balls / 6)).toFixed(1) : '0.0';
      return {
        name, o: oversNum, m: p.maidens, runs: p.runs, w: p.wickets, econ: parseFloat(econ)
      };
    });
  };

  const getBestBatter = (stats: any[]) => {
    if (!stats?.length) return { name: '-', score: '0', balls: '0' };
    const best = stats.reduce((p, c) => (p.r > c.r) ? p : c);
    return { name: best.name, score: String(best.r), balls: String(best.b) };
  };

  const getBestBowler = (stats: any[]) => {
    if (!stats?.length) return { name: '-', wickets: '0', runs: '0', overs: '0' };
    const best = stats.reduce((p, c) => {
      if (p.w > c.w) return p;
      if (p.w === c.w && p.runs < c.runs) return p;
      return c;
    });
    return { name: best.name, wickets: String(best.w), runs: String(best.runs), overs: String(best.o) };
  };

  const handleScore = (value: string | number) => {
    let newScore = score;
    let newBalls = balls;
    let newWickets = wickets;
    let newOverBalls = [...currentOverBalls];

    const newBatting = { ...battingData };
    const newBowling = { ...bowlingData };
    const newExtras = { ...extras };

    const cBatter = newBatting[striker];
    const cBowler = newBowling[bowler];

    let strikeSwapped = false;

    if (typeof value === 'number') {
      newScore += value;
      newBalls += 1;
      newOverBalls.push(value);
      if (cBatter) { cBatter.r += value; cBatter.b += 1; if (value === 4) cBatter.fours++; if (value === 6) cBatter.sixes++; }
      if (cBowler) { cBowler.runs += value; cBowler.balls += 1; }
      if (value % 2 !== 0) strikeSwapped = true;
    } else if (value === 'W') {
      newWickets += 1;
      newBalls += 1;
      newOverBalls.push('W');
      if (cBatter) { cBatter.b += 1; cBatter.isNotOut = false; cBatter.desc = `b ${bowler}`; }
      if (cBowler) { cBowler.wickets += 1; cBowler.balls += 1; }
    } else if (value === 'Wd' || value === 'Nb') {
      newScore += 1;
      newOverBalls.push(value === 'Wd' ? 'Wd' : 'Nb');
      if (cBowler) { cBowler.runs += 1; }
      newExtras.total += 1;
      if (value === 'Wd') newExtras.w += 1;
      if (value === 'Nb') newExtras.nb += 1;
    }

    setScore(newScore);
    setBalls(newBalls);
    setWickets(newWickets);
    setCurrentOverBalls(newOverBalls);
    setBattingData(newBatting);
    setBowlingData(newBowling);
    setExtras(newExtras);

    let nextStriker = strikeSwapped ? nonStriker : striker;
    let nextNonStriker = strikeSwapped ? striker : nonStriker;

    // Check Over End logic
    if (newBalls > 0 && newBalls % 6 === 0 && (typeof value === 'number' || value === 'W')) {
      const temp = nextStriker;
      nextStriker = nextNonStriker;
      nextNonStriker = temp;
      
      setCurrentOverBalls([]);
      setLastBowler(bowler);
      setShowNewBowlerModal(true);
    }
    
    if (striker !== nextStriker) {
      setStriker(nextStriker);
      setNonStriker(nextNonStriker);
    }

    if (value === 'W') {
      setStriker('');
      if (newWickets < 10 && newBalls < matchOvers * 6) setShowNewBatsmanModal(true);
    }

    // BROADCAST TO GLOBAL STORE
    updateGlobalLiveMatch({
      strikerName: nextStriker,
      nonStrikerName: nextNonStriker,
      bowlerName: bowler,
      score: newScore,
      wickets: newWickets,
      balls: newBalls,
      strikerRuns: newBatting[nextStriker]?.r || 0,
      strikerBalls: newBatting[nextStriker]?.b || 0,
      nonStrikerRuns: newBatting[nextNonStriker]?.r || 0,
      nonStrikerBalls: newBatting[nextNonStriker]?.b || 0,
      bowlerWickets: newBowling[bowler]?.wickets || 0,
      bowlerRuns: newBowling[bowler]?.runs || 0,
      bowlerBalls: newBowling[bowler]?.balls || 0,
      currentOverBalls: newOverBalls,
      battingTeam: innings === 1 ? teamA : teamB,
      bowlingTeam: innings === 1 ? teamB : teamA,
    });

    const isInningsOver = newWickets >= 10 || newBalls >= matchOvers * 6 || (innings === 2 && newScore >= target!);

    if (isInningsOver) {
      if (innings === 1) {
        setInnings1Data({ 
          score: newScore, wickets: newWickets, balls: newBalls, 
          batting: newBatting, bowling: newBowling, extras: newExtras 
        });
        setShowInningsBreakModal(true);
      } else {
        const winner = newScore >= target! ? (innings === 2 ? teamB : teamA) : (innings === 1 ? teamA : teamB);
        const finalWinner = newScore >= target! ? teamB : (newScore === target! - 1 ? 'Match Tied' : teamA);
        
        setSummaryData({
          winner: finalWinner,
          teamA: { name: teamA, score: innings1Data.score, wickets: innings1Data.wickets, balls: innings1Data.balls },
          teamB: { name: teamB, score: newScore, wickets: newWickets, balls: newBalls },
          teamBbatting: newBatting,
          teamBbowling: newBowling,
          teamBextras: newExtras
        });
        
        addInstantMatch({
          id: Math.random().toString(36).substr(2, 9),
          teamA, teamB, overs: matchOvers,
          innings: [
            { batting: teamA, score: innings1Data.score, wickets: innings1Data.wickets, balls: innings1Data.balls, scorecard: { batsmen: innings1Data.batting, bowlers: innings1Data.bowling } },
            { batting: teamB, score: newScore, wickets: newWickets, balls: newBalls, scorecard: { batsmen: newBatting, bowlers: newBowling } }
          ],
          winner: finalWinner, date: new Date().toLocaleDateString()
        });

        updateGlobalLiveMatch(null);
        setShowSummaryModal(true);
      }
    }
  };

  const startNextInnings = () => {
    setInnings(2);
    setScore(0);
    setWickets(0);
    setBalls(0);
    setCurrentOverBalls([]);
    setStriker('');
    setNonStriker('');
    setBowler('');
    setLastBowler('');
    setBattingData({});
    setBowlingData({});
    setExtras({ w: 0, nb: 0, b: 0, lb: 0, total: 0 });
    setShowInningsBreakModal(false);
    setShowSetupModal(true);
    setTempStriker('');
    setTempNonStriker('');
    setTempBowler('');
  };

  const shareScorecard = async () => {
    const message = `🏏 CricPro Instant Match Result!\n\n${teamA}: ${summaryData.teamA.score}/${summaryData.teamA.wickets} (${(summaryData.teamA.balls/6).toFixed(1)} ov)\n${teamB}: ${summaryData.teamB.score}/${summaryData.teamB.wickets} (${(summaryData.teamB.balls/6).toFixed(1)} ov)\n\n🏆 Winner: ${summaryData.winner}\n\nScored on CricPro App.`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.teamText}>{innings === 1 ? teamA : teamB} Batting</Text>
            <Text style={styles.matchTypeText}>{teamA} vs {teamB} • {matchOvers} Ov</Text>
          </View>
          <Pressable style={styles.undoBtn}>
            <RotateCcw color="#FFFFFF" size={16} />
          </Pressable>
        </View>

        <View style={styles.mainScoreContainer}>
          <View>
            <Text style={styles.scoreText}>{score}/{wickets}</Text>
            <Text style={styles.oversText}>Overs: {oversCompleted}/{matchOvers}</Text>
          </View>
          <View style={styles.crrContainer}>
            {innings === 2 && (
              <View style={{ marginBottom: 4 }}>
                <Text style={styles.targetText}>TARGET: {target}</Text>
                <Text style={styles.rrrText}>RRR: {rrr}</Text>
              </View>
            )}
            <Text style={styles.crrLabel}>CRR</Text>
            <Text style={styles.crrValue}>{crr}</Text>
          </View>
        </View>

        <View style={styles.playerInfoRow}>
          <View style={styles.playerCard}>
            <Text style={[styles.playerName, styles.strikerText]}>🏏 {striker || 'Striker'}</Text>
            <Text style={nonStriker ? styles.playerName : styles.playerPlaceholder}> {nonStriker || 'Non-Striker'}</Text>
          </View>
          <View style={[styles.playerCard, { alignItems: 'flex-end' }]}>
            <Text style={styles.bowlerName}>⚾ {bowler || 'Bowler'}</Text>
            <Text style={styles.bowlerStats}>This Over</Text>
          </View>
        </View>
      </View>

      {/* OVER TRACKER */}
      <View style={styles.overTracker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.overBallsContent}>
          {currentOverBalls.map((ball, i) => (
            <View key={i} style={[styles.ballCircle, ball === 'W' && styles.wicketBall]}>
              <Text style={[styles.ballText, ball === 'W' && styles.whiteText]}>{ball}</Text>
            </View>
          ))}
          {currentOverBalls.length === 0 && <Text style={styles.noBallsText}>Start the over...</Text>}
        </ScrollView>
      </View>

      {/* SCORING PAD */}
      <ScrollView contentContainerStyle={styles.scoringPad}>
        <View style={styles.gridRow}>
          {[0, 1, 2, 3].map(num => (
            <Pressable key={num} style={styles.scoreBtn} onPress={() => handleScore(num)}>
              <Text style={styles.scoreBtnText}>{num}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.gridRow}>
          {[4, 6].map(num => (
            <Pressable key={num} style={[styles.scoreBtn, styles.boundaryBtn]} onPress={() => handleScore(num)}>
              <Text style={styles.boundaryBtnText}>{num}</Text>
            </Pressable>
          ))}
          <Pressable style={[styles.scoreBtn, styles.wicketBtn]} onPress={() => handleScore('W')}>
            <Text style={styles.wicketBtnText}>W</Text>
          </Pressable>
        </View>
        <View style={styles.gridRow}>
          {['Wd', 'Nb'].map(extra => (
            <Pressable key={extra} style={styles.extraBtn} onPress={() => handleScore(extra)}>
              <Text style={styles.extraBtnText}>{extra}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* MODALS */}
      {/* 1. SETUP MODAL */}
      <Modal visible={showSetupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{innings === 1 ? '1st' : '2nd'} Innings Start</Text>
            <Text style={styles.modalSubtitle}>Entering names for {innings === 1 ? teamA : teamB}</Text>
            <View style={styles.modalForm}>
              <TextInput style={styles.modalInput} placeholder="Striker Name" value={tempStriker} onChangeText={setTempStriker} placeholderTextColor="#94A3B8" />
              <TextInput style={styles.modalInput} placeholder="Non-Striker Name" value={tempNonStriker} onChangeText={setTempNonStriker} placeholderTextColor="#94A3B8" />
              <TextInput style={styles.modalInput} placeholder="Opening Bowler Name" value={tempBowler} onChangeText={setTempBowler} placeholderTextColor="#94A3B8" />
              <Pressable style={styles.modalStartBtn} onPress={() => {
                if (!tempStriker || !tempNonStriker || !tempBowler) return;
                setStriker(tempStriker); setNonStriker(tempNonStriker); setBowler(tempBowler);
                
                // Initialize Global Sync
                updateGlobalLiveMatch({
                  matchId: Math.random().toString(36).substr(2,9),
                  strikerName: tempStriker,
                  nonStrikerName: tempNonStriker,
                  bowlerName: tempBowler,
                  score: 0,
                  wickets: 0,
                  balls: 0,
                  strikerRuns: 0,
                  strikerBalls: 0,
                  nonStrikerRuns: 0,
                  nonStrikerBalls: 0,
                  bowlerWickets: 0,
                  bowlerRuns: 0,
                  bowlerBalls: 0,
                  currentOverBalls: [],
                  battingTeam: innings === 1 ? teamA : teamB,
                  bowlingTeam: innings === 1 ? teamB : teamA,
                });

                setShowSetupModal(false);
              }}>
                <Text style={styles.modalStartBtnText}>START SCORING</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. NEW BATSMAN MODAL */}
      <Modal visible={showNewBatsmanModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 30 }]}>
            <UserPlus size={32} color={Colors.maroon} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.modalTitle}>New Batsman</Text>
            <TextInput style={styles.modalInput} placeholder="Enter Batsman Name" autoFocus onChangeText={setTempStriker} placeholderTextColor="#94A3B8" />
            <Pressable style={[styles.modalStartBtn, { marginTop: 12 }]} onPress={() => {
              if (!tempStriker) return;
              setStriker(tempStriker);
              setShowNewBatsmanModal(false);
              setTempStriker('');
            }}>
              <Text style={styles.modalStartBtnText}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 3. NEW BOWLER MODAL */}
      <Modal visible={showNewBowlerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 30 }]}>
            <RotateCcw size={32} color={Colors.maroon} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Change Bowler</Text>
            <Text style={styles.modalSubtitle}>Last bowler: {lastBowler}</Text>
            <TextInput style={styles.modalInput} placeholder="Enter New Bowler Name" autoFocus onChangeText={setTempBowler} placeholderTextColor="#94A3B8" />
            <Pressable style={[styles.modalStartBtn, { marginTop: 12 }]} onPress={() => {
              if (!tempBowler) return;
              if (tempBowler.toLowerCase() === lastBowler.toLowerCase()) {
                Alert.alert('Invalid Bowler', 'A bowler cannot bowl consecutive overs.');
                return;
              }
              setBowler(tempBowler);
              setShowNewBowlerModal(false);
              setTempBowler('');
            }}>
              <Text style={styles.modalStartBtnText}>START OVER</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 4. INNINGS BREAK MODAL */}
      <Modal visible={showInningsBreakModal} transparent={false} animationType="slide">
        <InstantMatchSummary 
          teamName={teamA}
          score={innings1Data?.score || 0}
          wickets={innings1Data?.wickets || 0}
          overs={(innings1Data?.balls / 6).toFixed(1)}
          isFirstInnings={true}
          onNext={startNextInnings}
          onClose={() => setShowInningsBreakModal(false)}
          battingStats={innings1Data ? formatBattingStats(innings1Data.batting) : []}
          bowlingStats={innings1Data ? formatBowlingStats(innings1Data.bowling) : []}
          bestBatter={innings1Data ? getBestBatter(formatBattingStats(innings1Data.batting)) : {name:'-',score:'0',balls:'0'}}
          bestBowler={innings1Data ? getBestBowler(formatBowlingStats(innings1Data.bowling)) : {name:'-',wickets:'0',runs:'0',overs:'0'}}
          extrasStr={innings1Data ? `${innings1Data.extras.total} (w ${innings1Data.extras.w}, nb ${innings1Data.extras.nb})` : ''}
        />
      </Modal>

      {/* 5. SUMMARY MODAL */}
      <Modal visible={showSummaryModal} transparent={false} animationType="slide">
        <InstantMatchSummary 
          title={`Match Finished! • ${summaryData?.winner} Won`}
          onNext={() => {
            setShowSummaryModal(false);
            navigation.navigate('Home');
          }}
          onClose={() => setShowSummaryModal(false)}
          buttonText="FINISH MATCH"
          allInningsData={[
            {
              teamName: teamA,
              score: innings1Data?.score || 0,
              wickets: innings1Data?.wickets || 0,
              overs: (innings1Data?.balls / 6).toFixed(1),
              battingStats: innings1Data ? formatBattingStats(innings1Data.batting) : [],
              bowlingStats: innings1Data ? formatBowlingStats(innings1Data.bowling) : [],
              bestBatter: innings1Data ? getBestBatter(formatBattingStats(innings1Data.batting)) : {name:'-',score:'0',balls:'0'},
              bestBowler: innings1Data ? getBestBowler(formatBowlingStats(innings1Data.bowling)) : {name:'-',wickets:'0',runs:'0',overs:'0'},
              extrasStr: innings1Data ? `${innings1Data.extras.total} (w ${innings1Data.extras.w}, nb ${innings1Data.extras.nb})` : ''
            },
            {
              teamName: teamB,
              score: score,
              wickets: wickets,
              overs: (balls / 6).toFixed(1),
              battingStats: summaryData ? formatBattingStats(summaryData.teamBbatting) : [],
              bowlingStats: summaryData ? formatBowlingStats(summaryData.teamBbowling) : [],
              bestBatter: summaryData ? getBestBatter(formatBattingStats(summaryData.teamBbatting)) : {name:'-',score:'0',balls:'0'},
              bestBowler: summaryData ? getBestBowler(formatBowlingStats(summaryData.teamBbowling)) : {name:'-',wickets:'0',runs:'0',overs:'0'},
              extrasStr: summaryData ? `${summaryData.teamBextras.total} (w ${summaryData.teamBextras.w}, nb ${summaryData.teamBextras.nb})` : ''
            }
          ]}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { padding: 4 },
  headerTitleContainer: { alignItems: 'center' },
  teamText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  matchTypeText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  undoBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
  mainScoreContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  scoreText: { fontSize: 54, fontWeight: '900', color: '#FFFFFF' },
  oversText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  crrContainer: { alignItems: 'flex-end' },
  crrLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '800' },
  crrValue: { fontSize: 24, fontWeight: '900', color: '#FFD700' },
  targetText: { color: '#FFD700', fontSize: 12, fontWeight: '800' },
  rrrText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  playerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  playerCard: { gap: 2 },
  playerName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  playerPlaceholder: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontStyle: 'italic' },
  strikerText: { color: '#FFD700' },
  bowlerName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  bowlerStats: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600' },
  overTracker: { backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  overBallsContent: { alignItems: 'center', gap: 10 },
  ballCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  wicketBall: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  ballText: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  whiteText: { color: '#FFFFFF' },
  noBallsText: { color: '#94A3B8', fontSize: 12, fontWeight: '600', fontStyle: 'italic' },
  scoringPad: { padding: 16, gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  scoreBtn: { flex: 1, height: 75, backgroundColor: '#FFFFFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  scoreBtnText: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  boundaryBtn: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  boundaryBtnText: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  wicketBtn: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  wicketBtnText: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  extraBtn: { flex: 1, height: 50, backgroundColor: '#F1F5F9', borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  extraBtnText: { fontSize: 15, fontWeight: '700', color: '#64748B' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.maroon, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  modalForm: { gap: 12 },
  modalInput: { height: 54, backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontWeight: '600', color: '#1A202C', borderWidth: 1, borderColor: '#E2E8F0' },
  modalStartBtn: { backgroundColor: Colors.maroon, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  modalStartBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  
  resultBrief: { alignItems: 'center', marginVertical: 20 },
  briefTeam: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  briefScore: { fontSize: 42, fontWeight: '900', color: Colors.maroon },
  briefOvers: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  briefTarget: { fontSize: 16, fontWeight: '800', color: '#EAB308', marginBottom: 20, textAlign: 'center' },
  
  winnerLabel: { fontSize: 18, fontWeight: '900', color: '#10B981', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase' },
  summaryList: { maxHeight: 200, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sumTeam: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  sumScore: { fontSize: 16, fontWeight: '800', color: Colors.maroon },
  
  summaryActions: { gap: 12 },
  shareBtn: { height: 56, borderRadius: 18, borderWidth: 2, borderColor: Colors.maroon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  shareBtnText: { color: Colors.maroon, fontSize: 16, fontWeight: '800' },
  exitBtn: { height: 56, borderRadius: 18, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center' },
  exitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});

export default InstantScoringScreen;
