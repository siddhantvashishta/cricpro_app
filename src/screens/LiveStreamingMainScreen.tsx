import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Search, Bell, ChevronRight, Play } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore } from '../store/useTeamStore';
import { useProStore } from '../store/useProStore';

const { width } = Dimensions.get('window');

const LIVE_NOW = [
  {
    id: 'l1',
    title: 'IND 156/2 (18.4) vs AUS',
    series: 'ICC World Cup',
    watching: '24K WATCHING',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'l2',
    title: 'PAK 42/0 (5.2) vs ENG',
    series: 'Asia Cup',
    watching: '12K WATCHING',
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
  },
];

const UPCOMING = [
  {
    id: 'u1',
    title: 'ENG vs RSA: 1st ODI',
    time: 'STARTS IN 2H 30M',
    venue: "Lord's Cricket Ground, London",
    thumbnail: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'u2',
    title: 'NZ vs BAN: T20 Series',
    time: 'STARTS IN 5H 45M',
    venue: 'Eden Park, Auckland',
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-920036214751?q=80&w=1000&auto=format&fit=crop',
  },
];

const RECENT_MATCHES = [
  {
    id: 'r1',
    title: 'IND vs AUS: Full Match Highlights - Finals',
    stats: '150K views • 2 days ago',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'r2',
    title: 'Best Catches & Wickets of the Tournament',
    stats: '89K views • 4 days ago',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=1000&auto=format&fit=crop',
  },
];

const LiveStreamingMainScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { matches } = useTeamStore();
  const { isPro } = useProStore();

  const storeLiveMatches = matches.filter(m => m.status === 'live');
  const storeUpcomingMatches = matches.filter(m => m.status === 'upcoming');

  // Map store matches to streaming format
  const mappedLiveMatches = storeLiveMatches.map(m => ({
    id: m.id,
    title: `${m.teamAInfo.shortName} ${m.scoreA || '0/0'} vs ${m.teamBInfo.shortName}`,
    series: m.format,
    watching: `${Math.floor(Math.random() * 50) + 5}K WATCHING`,
    thumbnail: m.teamAInfo.shortName === 'MM' ? 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=1000&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
    isReal: true
  }));

  const displayLive = mappedLiveMatches.length > 0 ? mappedLiveMatches : LIVE_NOW;
  const displayUpcoming = storeUpcomingMatches.length > 0 ? storeUpcomingMatches.map(m => ({
    id: m.id,
    title: `${m.teamAInfo.shortName} vs ${m.teamBInfo.shortName}: ${m.format}`,
    time: `STARTS AT ${m.time}`,
    venue: m.venue,
    thumbnail: 'https://images.unsplash.com/photo-1519861531473-920036214751?q=80&w=1000&auto=format&fit=crop'
  })) : UPCOMING;

  const renderLiveCard = (item: typeof LIVE_NOW[0]) => (
    <Pressable 
      key={item.id} 
      style={styles.liveCard}
      onPress={() => navigation.navigate('LivePlayer', { stream: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.liveThumbnail} />
      <View style={styles.liveOverlay}>
        <View style={styles.watchingBadge}>
          <View style={styles.watchingDot} />
          <Text style={styles.watchingText}>{item.watching}</Text>
        </View>
        <View style={styles.liveInfo}>
          <Text style={styles.liveSeries}>{item.series}</Text>
          <Text style={styles.liveTitle}>{item.title}</Text>
        </View>
        <View style={styles.liveTag}>
          <Text style={styles.liveTagText}>LIVE</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderUpcomingCard = (item: typeof UPCOMING[0]) => (
    <Pressable key={item.id} style={styles.upcomingCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.upcomingThumbnail} />
      <View style={styles.upcomingInfo}>
        <Text style={styles.upcomingTime}>{item.time}</Text>
        <Text style={styles.upcomingTitle}>{item.title}</Text>
        <Text style={styles.upcomingVenue}>{item.venue}</Text>
      </View>
      <Pressable style={styles.remindBtn}>
        <Bell color="#FFFFFF" size={20} fill="#FFFFFF" />
      </Pressable>
    </Pressable>
  );

  const renderRecentCard = (item: typeof RECENT_MATCHES[0]) => (
    <Pressable key={item.id} style={styles.recentCard}>
      <View style={styles.recentThumbContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.recentThumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <Text style={styles.recentTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.recentStats}>{item.stats}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerBtn}><Menu color="#FFFFFF" size={24} /></Pressable>
        <Text style={styles.headerTitle}>LIVE STREAMING</Text>
        <Pressable style={styles.headerBtn}><Search color="#FFFFFF" size={24} /></Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sections */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.liveIndicatorDot} />
            <Text style={styles.sectionTitle}>LIVE NOW</Text>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.liveList}
        >
          {displayLive.map(renderLiveCard as any)}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UPCOMING STREAMS</Text>
        </View>
        <View style={styles.upcomingList}>
          {displayUpcoming.map(renderUpcomingCard as any)}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT MATCHES</Text>
        </View>
        <View style={styles.recentGrid}>
          {RECENT_MATCHES.map(renderRecentCard)}
        </View>
        
        {/* Pro Action FAB - Go Live */}
        <Pressable 
          style={[styles.goLiveFAB, !isPro && { opacity: 0.8, backgroundColor: '#455A64' }]}
          onPress={() => {
            if (isPro) {
              navigation.navigate('LiveBroadcaster');
            } else {
              navigation.navigate('Subscription');
            }
          }}
        >
          <Play color="#FFFFFF" size={24} fill="#FFFFFF" />
          <Text style={styles.goLiveText}>{isPro ? 'GO LIVE' : 'UNLOCK LIVE BR'}</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: Colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  liveList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  liveCard: {
    width: width * 0.8,
    height: 200,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  liveThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  liveOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  watchingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  watchingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  watchingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveInfo: {
    marginBottom: 8,
  },
  liveSeries: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '700',
  },
  liveTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  liveTag: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  upcomingList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  upcomingThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  upcomingTime: {
    color: '#D84315',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
    marginTop: 4,
  },
  upcomingVenue: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
  remindBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  recentCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
  },
  recentThumbContainer: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  recentThumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
    lineHeight: 18,
  },
  recentStats: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 4,
    fontWeight: '600',
  },
  goLiveFAB: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.maroon,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  goLiveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
    letterSpacing: 1,
  },
});

export default LiveStreamingMainScreen;
