import * as React from 'react';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

// ─── Confetti Dot ────────────────────────────────────────────────────────────
const ConfettiDot = ({ style }: { style: any }) => <View style={[styles.confettiDot, style]} />;

// ─── Coin Face Components ─────────────────────────────────────────────────────
const CricketBatIcon = () => (
  <Text style={styles.coinIcon}>🏏</Text>
);

const FielderIcon = () => (
  <Text style={styles.coinIcon}>🏃</Text>
);

// ─── States ───────────────────────────────────────────────────────────────────
type TossPhase = 'idle' | 'flipping' | 'result';
type Face = 'HEADS' | 'TAILS';

const CoinTossScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { teamA, teamB, playersA, playersB, cvcMap } = route?.params || {};

  const TEAMS_LIST = [teamA?.name || 'Team A', teamB?.name || 'Team B'];

  // Which team is calling
  const [callingTeam] = useState(TEAMS_LIST[0]);
  const [phase, setPhase] = useState<TossPhase>('idle');
  const [playerChoice, setPlayerChoice] = useState<Face | null>(null);
  const [result, setResult] = useState<Face | null>(null);
  const [wonToss, setWonToss] = useState(false);
  const [decision, setDecision] = useState<'Bat' | 'Bowl' | null>(null);

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const coinScale = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const handleCall = (choice: Face) => {
    if (phase !== 'idle') return;
    setPlayerChoice(choice);
    setPhase('flipping');

    // Reset animations
    flipAnim.setValue(0);
    resultOpacity.setValue(0);
    confettiAnim.setValue(0);

    // Multi-flip sequence (fast spin, slow down)
    Animated.sequence([
      // Quick scale up
      Animated.timing(coinScale, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      // Series of flips using opacity toggle
      Animated.loop(
        Animated.sequence([
          Animated.timing(flipAnim, { toValue: 1, duration: 80, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(flipAnim, { toValue: 0, duration: 80, easing: Easing.linear, useNativeDriver: true }),
        ]),
        { iterations: 10 }
      ),
    ]).start();

    // After 1.8 seconds stop and show result
    setTimeout(() => {
      const tossResult: Face = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
      const didWin = tossResult === choice;

      flipAnim.stopAnimation();
      setResult(tossResult);
      setWonToss(didWin);
      setPhase('result');

      Animated.parallel([
        Animated.spring(coinScale, { toValue: 1, useNativeDriver: true }),
        Animated.timing(resultOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        didWin
          ? Animated.spring(confettiAnim, { toValue: 1, useNativeDriver: true, damping: 8 })
          : Animated.timing(confettiAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]).start();
    }, 1800);
  };

  const handleDecision = (choice: 'Bat' | 'Bowl') => {
    setDecision(choice);
    const tossWinner = wonToss ? callingTeam : TEAMS_LIST[1];
    Alert.alert(
      '✅ Toss Complete!',
      `${tossWinner} won the toss and elected to ${choice} first.`,
      [{ 
        text: 'Let\'s Play!', 
        onPress: () => navigation.navigate('BattingOrder', { 
          playersA, 
          playersB, 
          teamAName: teamA?.name, 
          teamBName: teamB?.name,
          tossWinner,
          decision: choice,
          cvcMap 
        }) 
      }]
    );
  };

  const handleReset = () => {
    setPhase('idle');
    setPlayerChoice(null);
    setResult(null);
    setWonToss(false);
    setDecision(null);
    coinScale.setValue(1);
    resultOpacity.setValue(0);
    confettiAnim.setValue(0);
    flipAnim.setValue(0);
  };

  // Coin face shows HEADS or TAILS based on flip phase
  const coinFaceOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 1] });
  const showFace: Face = phase === 'result' && result ? result : 'HEADS';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.white} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>TOSS TIME</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Cricket pitch circle background */}
      <View style={styles.pitchCircle} />

      {/* Confetti when winner */}
      {phase === 'result' && wonToss && (
        <>
          <Animated.View style={[styles.confettiDot, styles.cd1, { opacity: confettiAnim, transform: [{ scale: confettiAnim }] }]} />
          <Animated.View style={[styles.confettiDot, styles.cd2, { opacity: confettiAnim, transform: [{ scale: confettiAnim }] }]} />
          <Animated.View style={[styles.confettiDot, styles.cd3, { opacity: confettiAnim, transform: [{ scale: confettiAnim }] }]} />
          <Animated.View style={[styles.confettiDot, styles.cd4, { opacity: confettiAnim, transform: [{ scale: confettiAnim }] }]} />
          <Animated.View style={[styles.confettiDot, styles.cd5, { opacity: confettiAnim, transform: [{ scale: confettiAnim }] }]} />
        </>
      )}

      <View style={styles.body}>
        {/* Calling prompt */}
        <Text style={styles.callPrompt}>
          {phase === 'idle'
            ? `${callingTeam} captain, make your call`
            : phase === 'flipping'
            ? '🪙 Toss in the air...'
            : wonToss
            ? `🎉 ${callingTeam} won the toss!`
            : `${TEAMS_LIST[1]} won the toss!`}
        </Text>

        {/* Coin */}
        <Animated.View style={[styles.coinOuter, { transform: [{ scale: coinScale }] }]}>
          <Animated.View style={[styles.coin, { opacity: phase === 'flipping' ? coinFaceOpacity : 1 }]}>
            {showFace === 'HEADS' ? <CricketBatIcon /> : <FielderIcon />}
            <Text style={styles.coinBrand}>CRICPRO</Text>
          </Animated.View>
        </Animated.View>

        {/* Result pill */}
        {phase === 'result' && result && (
          <Animated.View style={[styles.resultPill, { opacity: resultOpacity }]}>
            <Text style={styles.resultPillText}>
              {result === playerChoice ? `✅ ${result} — Your call was right!` : `❌ ${result} — Better luck next time`}
            </Text>
          </Animated.View>
        )}

        {/* Choice prompt / choice indicator */}
        {phase === 'idle' && (
          <Text style={styles.chooseHint}>Choose HEADS or TAILS</Text>
        )}
        {phase !== 'idle' && playerChoice && (
          <Text style={styles.chooseHint}>You called: <Text style={{ color: '#FFD700', fontWeight: '900' }}>{playerChoice}</Text></Text>
        )}
      </View>

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
        {/* After result and won: bat or bowl decision */}
        {phase === 'result' && wonToss && !decision && (
          <>
            <Text style={styles.decisionPrompt}>Choose to Bat or Bowl first:</Text>
            <View style={styles.decisionRow}>
              <Pressable
                style={({ pressed }) => [styles.decisionBtn, { backgroundColor: '#2E7D32' }, pressed ? { opacity: 0.85 } : null]}
                onPress={() => handleDecision('Bat')}
                accessibilityRole="button" accessibilityLabel="Elect to bat"
              >
                <Text style={styles.decisionBtnIcon}>🏏</Text>
                <Text style={styles.decisionBtnText}>BAT</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.decisionBtn, { backgroundColor: '#1565C0' }, pressed ? { opacity: 0.85 } : null]}
                onPress={() => handleDecision('Bowl')}
                accessibilityRole="button" accessibilityLabel="Elect to bowl"
              >
                <Text style={styles.decisionBtnIcon}>🥎</Text>
                <Text style={styles.decisionBtnText}>BOWL</Text>
              </Pressable>
            </View>
            <Pressable onPress={handleReset} accessibilityRole="button" accessibilityLabel="Redo toss">
              <Text style={styles.redoText}>Redo Toss</Text>
            </Pressable>
          </>
        )}

        {/* After result and lost */}
        {phase === 'result' && !wonToss && (
          <Pressable
            style={({ pressed }) => [styles.redoBtn, pressed ? { opacity: 0.85 } : null]}
            onPress={handleReset}
            accessibilityRole="button" accessibilityLabel="Redo toss"
          >
            <Text style={styles.redoBtnText}>🔄  Redo Toss</Text>
          </Pressable>
        )}

        {/* HEADS / TAILS buttons (idle state) */}
        {phase === 'idle' && (
          <View style={styles.callRow}>
            <Pressable
              style={({ pressed }) => [styles.callBtn, pressed ? { borderColor: Colors.white, backgroundColor: 'rgba(255,255,255,0.12)' } : null]}
              onPress={() => handleCall('HEADS')}
              accessibilityRole="button" accessibilityLabel="Call heads"
            >
              <Text style={styles.callBtnIcon}>🏏</Text>
              <Text style={styles.callBtnText}>HEADS</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.callBtn, pressed ? { borderColor: Colors.white, backgroundColor: 'rgba(255,255,255,0.12)' } : null]}
              onPress={() => handleCall('TAILS')}
              accessibilityRole="button" accessibilityLabel="Call tails"
            >
              <Text style={styles.callBtnIcon}>🏃</Text>
              <Text style={styles.callBtnText}>TAILS</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B3E' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.white, letterSpacing: 1.5 },

  // Pitch
  pitchCircle: { position: 'absolute', width: 340, height: 340, borderRadius: 170, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', alignSelf: 'center', top: '20%' },

  // Confetti
  confettiDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  cd1: { backgroundColor: '#FFD700', top: '25%', left: '15%' },
  cd2: { backgroundColor: Colors.maroon, top: '30%', right: '12%', transform: [{ rotate: '45deg' }] },
  cd3: { backgroundColor: '#4CAF50', top: '20%', right: '30%' },
  cd4: { backgroundColor: '#29B6F6', top: '45%', left: '8%' },
  cd5: { backgroundColor: '#FF6D00', top: '22%', left: '60%', width: 8, height: 8 },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, paddingHorizontal: 20 },
  callPrompt: { fontSize: 18, fontWeight: '700', color: Colors.white, textAlign: 'center', lineHeight: 26 },
  chooseHint: { fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },

  // Coin
  coinOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30 },
      android: { elevation: 12 },
    }),
  },
  coin: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  coinIcon: { fontSize: 52 },
  coinBrand: { fontSize: 12, fontWeight: '900', color: Colors.white, letterSpacing: 1.5 },

  resultPill: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  resultPillText: { fontSize: 14, fontWeight: '700', color: Colors.white, textAlign: 'center' },

  // Bottom section
  bottomSection: { paddingHorizontal: 24, paddingTop: 16, gap: 14 },
  callRow: { flexDirection: 'row', gap: 16 },
  callBtn: { flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 16, paddingVertical: 22, alignItems: 'center', gap: 8, minHeight: 96 },
  callBtnIcon: { fontSize: 30 },
  callBtnText: { fontSize: 15, fontWeight: '900', color: Colors.white, letterSpacing: 1 },

  decisionPrompt: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  decisionRow: { flexDirection: 'row', gap: 14 },
  decisionBtn: { flex: 1, borderRadius: 16, paddingVertical: 20, alignItems: 'center', gap: 8, minHeight: 88 },
  decisionBtnIcon: { fontSize: 28 },
  decisionBtnText: { fontSize: 15, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  redoText: { textAlign: 'center', fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.5)', paddingVertical: 8 },
  redoBtn: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', minHeight: 52 },
  redoBtnText: { fontSize: 15, fontWeight: '800', color: Colors.white },
});

export default CoinTossScreen;
