import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Flag, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  Lock, 
  UserPlus, 
  MessageCircle,
  Calendar
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useProStore } from '../store/useProStore';
import { useTeamStore } from '../store/useTeamStore';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

// ─── Stats Data ─────────────────────────────────────────────────────
const MOCK_BATTING_STATS = {
  ALL: { MAT: '482', INN: '534', RUNS: '25K', HS: '254*', AVG: '54.2', SR: '128.5', '100S': '75', '50S': '131', '4S': '2.4K', '6S': '284', NO: '82', BF: '19K' },
  T20: { MAT: '115', INN: '112', RUNS: '4.1K', HS: '122', AVG: '52.7', SR: '139.6', '100S': '1', '50S': '37', '4S': '410', '6S': '96', NO: '14', BF: '2.9K' },
  ODI: { MAT: '295', INN: '292', RUNS: '13.9K', HS: '183', AVG: '57.6', SR: '93.2', '100S': '50', '50S': '72', '4S': '1.3K', '6S': '143', NO: '49', BF: '14.9K' },
  TEST: { MAT: '113', INN: '202', RUNS: '9.2K', HS: '254*', AVG: '48.5', SR: '55.8', '100S': '30', '50S': '31', '4S': '1.1K', '6S': '27', NO: '14', BF: '16.5K' },
};

const MOCK_BOWLING_STATS = {
  ALL: { MAT: '482', INN: '4', WKTS: '4', BBI: '1/13', BBM: '1/13', AVG: '68.5', ECON: '6.1', SR: '67.0', '5W': '0', '10W': '0', CT: '168', ST: '0' },
  T20: { MAT: '115', INN: '2', WKTS: '2', BBI: '1/13', BBM: '1/13', AVG: '68.5', ECON: '7.5', SR: '54.5', '5W': '0', '10W': '0', CT: '58', ST: '0' },
  ODI: { MAT: '295', INN: '2', WKTS: '2', BBI: '1/15', BBM: '1/15', AVG: '75.5', ECON: '5.7', SR: '79.0', '5W': '0', '10W': '0', CT: '125', ST: '0' },
  TEST: { MAT: '113', INN: '0', WKTS: '0', BBI: '-', BBM: '-', AVG: '-', ECON: '-', SR: '-', '5W': '0', '10W': '0', CT: '52', ST: '0' },
};

const STAT_TABS = ['BATTING', 'BOWLING', 'MATCHES', 'ACHIEVE'];
const FORMAT_TABS = ['ALL', 'T20', 'ODI', 'TEST'];

const PlayerProfileScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { isPro } = useProStore();
  const { players, friends, socialRequests, sendSocialRequest, globalLiveMatch } = useTeamStore();
  const [activeTab, setActiveTab] = useState('BATTING');
  const [activeFormat, setActiveFormat] = useState('ALL');
  
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const playerName = route?.params?.name || 'Virat Kohli';
  const player = Object.values(players).find(p => p.name === playerName);

  // Check if player is currently playing in a live match
  const isCurrentlyStriker = globalLiveMatch?.strikerName === playerName;
  const isCurrentlyNonStriker = globalLiveMatch?.nonStrikerName === playerName;
  const isCurrentlyBowler = globalLiveMatch?.bowlerName === playerName;
  const isPlayerLive = isCurrentlyStriker || isCurrentlyNonStriker || isCurrentlyBowler;

  const isFriend = player ? friends.includes(player.id) : false;
  const hasPendingRequest = player ? socialRequests.some(
    req => req.senderId === 'me' && req.receiverId === player.id && req.status === 'pending'
  ) : false;

  const handleAddFriend = () => {
    if (player) {
      sendSocialRequest({
        senderId: 'me',
        receiverId: player.id,
        type: 'friend',
      });
      Alert.alert('Request Sent', `Friend request sent to ${player.name}`);
    }
  };

  const displayStats = player ? {
    MAT: player.stats.MAT.toString(),
    INN: player.stats.INN.toString(),
    RUNS: player.stats.RUNS.toString(),
    HS: player.stats.HS,
    AVG: player.stats.AVG.toString(),
    SR: player.stats.SR.toString(),
    '100S': player.stats['100S'].toString(),
    '50S': player.stats['50S'].toString(),
    '4S': player.stats['4S'].toString(),
    '6S': player.stats['6S'].toString(),
    WKTS: player.stats.WKTS.toString(),
    BBI: player.stats.BBI,
    ECON: player.stats.ECON.toString(),
  } : (activeTab === 'BATTING' ? MOCK_BATTING_STATS[activeFormat as keyof typeof MOCK_BATTING_STATS] : MOCK_BOWLING_STATS[activeFormat as keyof typeof MOCK_BOWLING_STATS]);

  const statKeys = Object.keys(displayStats);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Navigation */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#7B1D29" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Player Profile</Text>
        <Pressable style={styles.iconBtn}>
          <Share2 color="#7B1D29" size={22} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
           <View style={styles.gradientHero} />
           <View style={styles.avatarContainer}>
              <View style={styles.avatarOuter}>
                <Image 
                  source={{ uri: player?.avatar || 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=200&auto=format&fit=crop' }} 
                  style={styles.avatarImage} 
                />
                <View style={styles.onlineStatus} />
              </View>
           </View>
        </View>

        {/* Live Match Ribbon */}
        {isPlayerLive && (
          <View style={styles.liveRibbon}>
            <View style={styles.liveRibbonHeader}>
              <Animated.View style={[styles.liveIndicatorDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveRibbonTitle}>LIVE NOW</Text>
              <Text style={styles.liveRibbonMatch}>{globalLiveMatch?.battingTeam} vs {globalLiveMatch?.bowlingTeam}</Text>
            </View>
            <View style={styles.liveRibbonStats}>
              {isCurrentlyStriker && (
                <Text style={styles.liveStatText}>
                  Batting: <Text style={styles.liveValueText}>{globalLiveMatch?.strikerRuns}* ({globalLiveMatch?.strikerBalls})</Text>
                </Text>
              )}
              {isCurrentlyNonStriker && (
                <Text style={styles.liveStatText}>
                  Batting: <Text style={styles.liveValueText}>{globalLiveMatch?.nonStrikerRuns}* ({globalLiveMatch?.nonStrikerBalls})</Text>
                </Text>
              )}
              {isCurrentlyBowler && (
                <Text style={styles.liveStatText}>
                  Bowling: <Text style={styles.liveValueText}>{globalLiveMatch?.bowlerWickets}-{globalLiveMatch?.bowlerRuns} ({Math.floor(globalLiveMatch?.bowlerBalls! / 6)}.{globalLiveMatch?.bowlerBalls! % 6} ov)</Text>
                </Text>
              )}
              <Text style={styles.liveTeamTotal}>{globalLiveMatch?.score}/{globalLiveMatch?.wickets}</Text>
            </View>
          </View>
        )}

        {/* Profile Details */}
        <View style={styles.profileInfo}>
           <Text style={styles.playerName}>{player?.name || playerName}</Text>
           <Text style={styles.playerHandle}>{player?.username || `@${(player?.name || playerName).toLowerCase().replace(/\s/g, '.')}`}</Text>
           <View style={styles.locationRow}>
              <MapPin color="#7B1D29" size={14} fill="#7B1D29" />
              <Text style={styles.locationText}>{player?.city || 'New Delhi'}, India 🇮🇳</Text>
           </View>
            <View style={styles.tagRow}>
              <View style={styles.tag}><Text style={styles.tagText}>{player?.role || 'BAT'}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{player?.role === 'BWL' ? 'Right-arm fast' : 'Right-hand bat'}</Text></View>
           </View>

           {/* Social Actions */}
           <View style={styles.actionRow}>
              <Pressable 
                style={[
                  styles.primaryAction, 
                  { backgroundColor: Colors.maroon },
                  (isFriend || hasPendingRequest) && { backgroundColor: '#F1F5F9' }
                ]}
                onPress={!isFriend && !hasPendingRequest ? handleAddFriend : undefined}
              >
                <UserPlus color={isFriend || hasPendingRequest ? '#64748B' : '#FFFFFF'} size={18} />
                <Text style={[
                  styles.primaryActionText,
                  (isFriend || hasPendingRequest) && { color: '#64748B' }
                ]}>
                  {isFriend ? 'Friend' : hasPendingRequest ? 'Requested' : 'Add Friend'}
                </Text>
              </Pressable>
              
              <Pressable 
                style={styles.secondaryAction}
                onPress={() => navigation.navigate('Messages', { screen: 'ChatDetail', params: { name: player?.name } })}
              >
                <MessageCircle color={Colors.maroon} size={18} strokeWidth={2.5} />
                <Text style={styles.secondaryActionText}>Message</Text>
              </Pressable>
           </View>
        </View>

        {/* My Bookings Button */}
        {(!route?.params?.name || route.params.name === 'Virat Kohli') && (
          <Pressable 
            style={styles.myBookingsBtn}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <View style={styles.myBookingsLeft}>
              <View style={styles.myBookingsIconWrapper}>
                <Calendar color={Colors.maroon} size={20} />
              </View>
              <View>
                <Text style={styles.myBookingsTitle}>My Ground Bookings</Text>
                <Text style={styles.myBookingsSub}>View active and past reservations</Text>
              </View>
            </View>
            <ChevronRight color="#CBD5E1" size={20} />
          </Pressable>
        )}

        {/* Social Stats */}
        <View style={styles.socialStats}>
           <View style={styles.socialItem}>
              <Text style={styles.socialValue}>1.2K</Text>
              <Text style={styles.socialLabel}>FOLLOWING</Text>
           </View>
           <View style={styles.socialDivider} />
           <View style={styles.socialItem}>
              <Text style={styles.socialValue}>254K</Text>
              <Text style={styles.socialLabel}>FOLLOWERS</Text>
           </View>
           <View style={styles.socialDivider} />
           <View style={styles.socialItem}>
              <Text style={styles.socialValue}>{player?.stats.MAT || 482}</Text>
              <Text style={styles.socialLabel}>MATCHES</Text>
           </View>
        </View>

        {/* Highlight Cards - ALWAYS VISIBLE */}
        <View style={styles.highlightsRow}>
           <View style={styles.highlightCard}>
              <Flag color="#7B1D29" size={18} />
              <Text style={styles.highlightValue}>{player?.stats.RUNS || '12.5K'}</Text>
              <Text style={styles.highlightLabel}>TOTAL RUNS</Text>
           </View>
           <View style={styles.highlightCard}>
              <Target color="#1A237E" size={18} />
              <Text style={styles.highlightValue}>{player?.stats.WKTS || '4'}</Text>
              <Text style={styles.highlightLabel}>WICKETS</Text>
           </View>
           <View style={styles.highlightCard}>
              <TrendingUp color="#7B1D29" size={18} />
              <Text style={styles.highlightValue}>{player?.stats.AVG || '57.3'}</Text>
              <Text style={styles.highlightLabel}>AVERAGE</Text>
           </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {STAT_TABS.map(tab => (
              <Pressable 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Format Selectors */}
        <View style={styles.formatRow}>
           {FORMAT_TABS.map(fmt => (
             <Pressable 
               key={fmt} 
               style={[styles.formatBtn, activeFormat === fmt && styles.formatBtnActive]}
               onPress={() => setActiveFormat(fmt)}
             >
               <Text style={[styles.formatText, activeFormat === fmt && styles.formatTextActive]}>{fmt}</Text>
             </Pressable>
           ))}
        </View>

        {/* Data Grid with PAYWALL */}
        <View style={styles.statsGrid}>
           {statKeys.map((key, index) => (
             <View key={key} style={[styles.gridItem, index % 4 === 3 && { borderRightWidth: 0 }]}>
                <Text style={styles.gridLabel}>{key}</Text>
                <Text style={[styles.gridValue, !isPro && styles.blurredValue]}>
                  {isPro ? (displayStats as any)[key] : 'XX'}
                </Text>
             </View>
           ))}
           
           {!isPro && (
             <View style={styles.paywallOverlay}>
                <Lock color="#FFFFFF" size={24} style={{ marginBottom: 8 }} />
                <Text style={styles.paywallTitle}>Detailed Stats Locked</Text>
                <Text style={styles.paywallSubtitle}>Upgrade to PRO to view analytical breakdown</Text>
                <Pressable 
                  style={styles.upgradeBtn}
                  onPress={() => navigation.navigate('Subscription')}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                </Pressable>
             </View>
           )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    height: 100,
    backgroundColor: '#FFFFFF',
    zIndex: 10
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A237E' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingBottom: 20 },
  
  heroWrapper: { height: 180, position: 'relative' },
  gradientHero: { 
    height: 150, 
    backgroundColor: '#1E293B' // Should ideally use a gradient if available
  },
  avatarContainer: { 
    position: 'absolute', 
    bottom: 0, 
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },
  avatarOuter: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 4, 
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0'
  },
  avatarImage: { width: 92, height: 92, borderRadius: 46 },
  onlineStatus: { 
    position: 'absolute', 
    bottom: 4, 
    right: 4, 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#4CAF50', 
    borderWidth: 3, 
    borderColor: '#FFFFFF' 
  },

  profileInfo: { alignItems: 'center', marginTop: 12 },
  playerName: { fontSize: 24, fontWeight: '900', color: '#1A237E' },
  playerHandle: { fontSize: 14, fontWeight: '600', color: '#64748B', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  locationText: { fontSize: 13, fontWeight: '700', color: '#1A237E', opacity: 0.8 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { 
    backgroundColor: '#FDECEA', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  tagText: { fontSize: 11, fontWeight: '800', color: '#7B1D29' },
  
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
    width: '100%',
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.maroon,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.maroon,
  },

  myBookingsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 24, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  myBookingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myBookingsIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  myBookingsTitle: { fontSize: 16, fontWeight: '800', color: '#1A237E' },
  myBookingsSub: { fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 2 },

  socialStats: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 18,
    backgroundColor: '#FFFFFF'
  },
  socialItem: { alignItems: 'center', flex: 1 },
  socialValue: { fontSize: 18, fontWeight: '900', color: '#1A237E' },
  socialLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 2, letterSpacing: 0.5 },
  socialDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },

  highlightsRow: { 
    flexDirection: 'row', 
    gap: 12, 
    paddingHorizontal: 16, 
    marginTop: 20 
  },
  highlightCard: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2
  },
  highlightValue: { fontSize: 18, fontWeight: '900', color: '#1A237E', marginTop: 8 },
  highlightLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8', marginTop: 4, letterSpacing: 0.5 },

  tabScroll: { marginTop: 24, paddingLeft: 16 },
  tabContent: { paddingRight: 32 },
  tabItem: { marginRight: 24, paddingVertical: 8 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: '#7B1D29' },
  tabText: { fontSize: 14, fontWeight: '800', color: '#94A3B8' },
  tabTextActive: { color: '#7B1D29' },

  formatRow: { 
    flexDirection: 'row', 
    gap: 8, 
    paddingHorizontal: 16, 
    marginTop: 20 
  },
  formatBtn: { 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  formatBtnActive: { backgroundColor: '#7B1D29', borderColor: '#7B1D29' },
  formatText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  formatTextActive: { color: '#FFFFFF' },

  statsGrid: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden'
  },
  gridItem: { 
    width: (width - 32) / 4, 
    padding: 12, 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  gridLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8', marginBottom: 4 },
  gridValue: { fontSize: 15, fontWeight: '900', color: '#1A237E' },
  blurredValue: { color: '#E2E8F0', backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  paywallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
  },
  paywallTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  paywallSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 16 },
  upgradeBtn: { backgroundColor: '#7B1D29', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  upgradeBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  liveRibbon: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 16, 
    marginTop: -20, 
    borderRadius: 16, 
    padding: 12, 
    borderWidth: 2, 
    borderColor: '#EF4444', 
    shadowColor: '#EF4444', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4, 
    zIndex: 20 
  },
  liveRibbonHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  liveIndicatorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  liveRibbonTitle: { fontSize: 12, fontWeight: '900', color: '#EF4444', letterSpacing: 1 },
  liveRibbonMatch: { fontSize: 11, fontWeight: '700', color: '#64748B', flex: 1, textAlign: 'right' },
  liveRibbonStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveStatText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  liveValueText: { color: Colors.maroon },
  liveTeamTotal: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
});

export default PlayerProfileScreen;
