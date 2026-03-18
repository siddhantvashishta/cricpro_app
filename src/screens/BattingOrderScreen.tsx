import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  StatusBar,
  Platform,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, GripVertical, Lock } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const ROLE_COLORS: Record<string, string> = {
  BAT: '#E65100',
  BWL: '#6A1B9A',
  WK: '#1565C0',
  AR: '#2E7D32',
};

// Default batting order if no players passed from params
const DEFAULT_PLAYERS = [
  { id: 'p1', name: 'Virat Kohli', role: 'BAT', desc: 'TOP-ORDER BATTER' },
  { id: 'p7', name: 'Rohit Sharma', role: 'BAT', desc: 'TOP-ORDER BATTER' },
  { id: 'p8', name: 'Shubman Gill', role: 'BAT', desc: 'BATTER' },
  { id: 'p12', name: 'KL Rahul', role: 'WK', desc: 'WICKETKEEPER' },
  { id: 'p4', name: 'Hardik Pandya', role: 'AR', desc: 'ALL-ROUNDER' },
  { id: 'p9', name: 'Suryakumar Yadav', role: 'BAT', desc: 'BATTER' },
  { id: 'p5', name: 'Ravindra Jadeja', role: 'AR', desc: 'ALL-ROUNDER' },
  { id: 'p2', name: 'Jasprit Bumrah', role: 'BWL', desc: 'BOWLER' },
  { id: 'p6', name: 'Mohammed Shami', role: 'BWL', desc: 'BOWLER' },
  { id: 'p10', name: 'Kuldeep Yadav', role: 'BWL', desc: 'BOWLER' },
  { id: 'p11', name: 'Mohammed Siraj', role: 'BWL', desc: 'BOWLER' },
];

type BatPlayer = { id: string; name: string; role: string; desc: string };

const BattingOrderScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { playersA = [], playersB = [], teamAName = 'Team A', teamBName = 'Team B', tossWinner, decision } = route?.params || {};
  
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');
  const [orderA, setOrderA] = useState<BatPlayer[]>(playersA.length > 0 ? playersA : DEFAULT_PLAYERS.slice(0, 11));
  const [orderB, setOrderB] = useState<BatPlayer[]>(playersB.length > 0 ? playersB : DEFAULT_PLAYERS.slice(0, 11));
  
  const players = activeTeam === 'A' ? orderA : orderB;
  const setPlayers = activeTeam === 'A' ? setOrderA : setOrderB;

  const [locked, setLocked] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Simple reorder via move up/down on long press (since react-native doesn't have a built-in drag list)
  const moveUp = (index: number) => {
    if (index === 0 || locked) return;
    setPlayers(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    if (index === players.length - 1 || locked) return;
    setPlayers(prev => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const handlePlayerPress = (player: BatPlayer, index: number) => {
    if (locked) return;
    Alert.alert(`Move ${player.name}`, `Currently batting at position ${index + 1}`, [
      { text: 'Move Up', onPress: () => moveUp(index), style: index === 0 ? 'destructive' : 'default' },
      { text: 'Move Down', onPress: () => moveDown(index), style: index === players.length - 1 ? 'destructive' : 'default' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLockOrder = () => {
    if (locked) {
      Alert.alert('Unlock Batting Order?', 'This will allow you to reorder players again.', [
        { text: 'Unlock', onPress: () => setLocked(false) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      Alert.alert(
        'Lock Batting Order',
        'Are you sure? Once locked, the order will be saved for the match.',
        [
          { text: 'Lock', onPress: () => {
            setLocked(true);
            Alert.alert('✅ Batting Order Locked!', 'The order has been saved. The match is ready to begin!', [
              { text: 'Start Match', onPress: () => navigation.navigate('MatchSetup') },
              { text: 'Stay', style: 'cancel' },
            ]);
          }},
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const renderItem = ({ item, index }: { item: BatPlayer; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.playerRow,
        pressed && !locked ? { opacity: 0.85, backgroundColor: '#FFF5F5' } : null,
        draggingIndex === index ? styles.playerRowDragging : null,
      ]}
      onPress={() => handlePlayerPress(item, index)}
      onLongPress={() => handlePlayerPress(item, index)}
      delayLongPress={300}
      accessibilityRole="button"
      accessibilityLabel={`${index + 1}. ${item.name}, ${item.desc}. Press to reorder.`}
    >
      {/* Position number */}
      <View style={styles.positionBubble}>
        <Text style={styles.positionText}>{index + 1}</Text>
      </View>

      {/* Name & Role */}
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[item.role] || Colors.maroon) + '22' }]}>
          <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[item.role] || Colors.maroon }]}>
            {item.desc}
          </Text>
        </View>
      </View>

      {/* Drag handle */}
      {!locked && (
        <View style={styles.dragHandle}>
          <GripVertical color="#C0C0C0" size={22} />
        </View>
      )}
      {locked && (
        <Lock color="#C0C0C0" size={16} />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Set Batting Order</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Toss Result Banner */}
      {tossWinner && (
        <View style={styles.tossBanner}>
          <Text style={styles.tossBannerText}>
            🏆 {tossWinner} won the toss and elected to {decision} first.
          </Text>
        </View>
      )}

      {/* Team Tabs */}
      <View style={styles.teamTabs}>
        {(['A', 'B'] as const).map(t => {
          const label = t === 'A' ? teamAName : teamBName;
          return (
            <Pressable
              key={t}
              style={styles.teamTab}
              onPress={() => setActiveTeam(t)}
            >
              <Text style={[styles.teamTabText, activeTeam === t ? styles.teamTabTextActive : null]} numberOfLines={1}>
                {label}
              </Text>
              {activeTeam === t && <View style={styles.teamTabUnderline} />}
            </Pressable>
          );
        })}
      </View>

      {/* Subtitle */}
      <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>
          {locked ? '🔒 ORDER LOCKED' : 'DRAG TO REORDER PLAYERS'}
        </Text>
        {!locked && <Text style={styles.subtitleHint}>Tap a player to move up/down</Text>}
      </View>

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Lock CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.lockBtn,
            locked ? styles.lockBtnLocked : null,
            pressed ? { opacity: 0.85 } : null,
          ]}
          onPress={handleLockOrder}
          accessibilityRole="button"
          accessibilityLabel={locked ? 'Unlock batting order' : 'Lock batting order'}
        >
          <Lock color={Colors.white} size={18} />
          <Text style={styles.lockBtnText}>
            {locked ? 'Batting Order Locked ✓' : 'Lock Batting Order'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  teamTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  teamTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  teamTabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  teamTabTextActive: { color: Colors.maroon },
  teamTabUnderline: { position: 'absolute', bottom: 0, left: 20, right: 20, height: 2.5, backgroundColor: Colors.maroon, borderRadius: 2 },
  subtitle: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: Colors.white },
  subtitleText: { fontSize: 11, fontWeight: '800', color: Colors.maroon, letterSpacing: 0.8 },
  subtitleHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, marginBottom: 6,
    borderRadius: 12, marginHorizontal: 12,
    gap: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  playerRowDragging: { ...Platform.select({ ios: { shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 8 } }), transform: [{ scale: 1.02 }] },
  positionBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center' },
  positionText: { fontSize: 15, fontWeight: '900', color: Colors.white },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  dragHandle: { width: 36, height: 44, justifyContent: 'center', alignItems: 'center' },
  ctaContainer: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  lockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, minHeight: 56 },
  lockBtnLocked: { backgroundColor: '#1B5E20' },
  lockBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  tossBanner: {
    backgroundColor: '#FFF7ED',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5',
    alignItems: 'center',
  },
  tossBannerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9A3412',
  },
});

export default BattingOrderScreen;
