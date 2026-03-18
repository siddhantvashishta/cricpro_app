import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useProStore } from '../store/useProStore';

const SubscriptionSuccessScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { plan, planLabel } = useProStore();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 150 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(confettiAnim, { toValue: 1, useNativeDriver: true, damping: 10 }),
      ]),
    ]).start();
  }, []);

  const renewDate = 'Oct 24, 2025';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.popToTop()}
          accessibilityRole="button" accessibilityLabel="Close"
        >
          <X color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Subscription Success</Text>
        <View style={styles.closeBtn} />
      </View>

      {/* Hero Area */}
      <View style={styles.heroArea}>
        {/* Floating confetti dots */}
        <Animated.View style={[styles.confettiDot, styles.confettiDot1, { opacity: confettiAnim }]} />
        <Animated.View style={[styles.confettiDot, styles.confettiDot2, { opacity: confettiAnim }]} />
        <Animated.View style={[styles.confettiDot, styles.confettiDot3, { opacity: confettiAnim }]} />

        <Animated.View style={[styles.trophyContainer, { transform: [{ scale }], opacity }]}>
          <View style={styles.trophyCircle}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
          <View style={styles.checkCircle}>
            <Check color={Colors.white} size={16} strokeWidth={3} />
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity }]}>
        <Text style={styles.welcomeTitle}>Welcome to CRICPRO{'\n'}Pro!</Text>
        <Text style={styles.welcomeDesc}>
          Your premium features are now unlocked. Start exploring advanced insights and scouting tools to take your analysis to the next level.
        </Text>

        {/* Plan card */}
        <View style={styles.planCard}>
          <View style={styles.planCardRow}>
            <Text style={styles.planCardLabel}>Subscription Plan</Text>
            <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>ACTIVE</Text></View>
          </View>
          <View style={styles.planDetailsRow}>
            <View style={styles.planIcon}>
              <Text style={{ fontSize: 20 }}>🎖️</Text>
            </View>
            <View>
              <Text style={styles.planName}>{plan === 'annual' ? 'Pro Annual' : 'Pro Monthly'}</Text>
              <Text style={styles.planRenew}>Renews {renewDate}</Text>
            </View>
          </View>
        </View>

        {/* Explore button */}
        <Pressable
          style={({ pressed }) => [styles.exploreBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={() => navigation.popToTop()}
          accessibilityRole="button"
          accessibilityLabel="Explore Pro features"
        >
          <Text style={styles.exploreBtnText}>Explore Pro Features  ↗</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.receiptBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="View receipt"
        >
          <Text style={styles.receiptBtnText}>View Receipt</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: Colors.white },
  closeBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  heroArea: { height: 200, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  trophyContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  trophyCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#FF8F00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 }, android: { elevation: 4 } }) },
  trophyEmoji: { fontSize: 56 },
  checkCircle: { position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.white },
  confettiDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  confettiDot1: { backgroundColor: '#FFD700', top: 30, left: 60 },
  confettiDot2: { backgroundColor: Colors.maroon, top: 60, right: 50, width: 8, height: 8, borderRadius: 4, transform: [{ rotate: '45deg' }] },
  confettiDot3: { backgroundColor: '#C8E6C9', bottom: 40, right: 80, width: 12, height: 12, borderRadius: 6 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  welcomeTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, textAlign: 'center', lineHeight: 36, marginBottom: 12 },
  welcomeDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  planCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  planCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  planCardLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  activeBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { fontSize: 11, fontWeight: '800', color: '#2E7D32' },
  planDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planIcon: { width: 44, height: 44, backgroundColor: Colors.maroon, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  planName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  planRenew: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  exploreBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56, marginBottom: 14, ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 6 } }) },
  exploreBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  receiptBtn: { alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  receiptBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
});

export default SubscriptionSuccessScreen;
