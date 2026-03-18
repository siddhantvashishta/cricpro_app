import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trophy, Medal, Crown, ArrowLeft, ChevronRight, TrendingUp, Target, Zap, BarChart3, Map } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Player, Team } from '../store/useTeamStore';
import { useProStore } from '../store/useProStore';

const { width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { players, teams } = useTeamStore();
  const { isPro } = useProStore();
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const [filter, setFilter] = useState<'global' | 'local'>('global');

  const topPlayers = Object.values(players)
    .sort((a, b) => (b.stats?.RUNS || 0) - (a.stats?.RUNS || 0))
    .slice(0, 10);

  const topTeams = [...teams]
    .sort((a, b) => b.players - a.players) // Mock sort by players for now
    .slice(0, 10);

  const renderTop3 = () => {
    if (topTeams.length < 3) return null;

    const [first, second, third] = [topTeams[0], topTeams[1], topTeams[2]];

    const PodiumItem = ({ rank, item, height, color }: any) => (
      <View style={[styles.podiumItem, { zIndex: rank === 1 ? 1 : 0 }]}>
        <View style={styles.podiumAvatarContainer}>
          <View style={[styles.podiumAvatar, { borderColor: color, backgroundColor: item.avatarColor || '#1A202C' }]}>
             <Text style={[styles.podiumInitial, { color: '#FFFFFF' }]}>{(item.name || '').charAt(0)}</Text>
             {rank === 1 && <Crown style={styles.crownIcon} size={20} color="#FFD700" fill="#FFD700" />}
          </View>
          <View style={[styles.rankBadge, { backgroundColor: color }]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>
        <Text style={styles.podiumName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.podiumValue}>{`${item.players} Players`}</Text>
        <View style={[styles.podiumBar, { height, backgroundColor: color + '20', borderColor: color }]} />
      </View>
    );

    return (
      <View style={styles.podium}>
        <PodiumItem rank={2} item={second} height={100} color="#94A3B8" />
        <PodiumItem rank={1} item={first} height={140} color="#FFD700" />
        <PodiumItem rank={3} item={third} height={80} color="#CD7F32" />
      </View>
    );
  };

  const renderListItem = (item: any, index: number) => {
    if (index < 3) return null; // Already in podium

    return (
      <Pressable 
        key={item.id} 
        style={styles.leaderboardCard}
        onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
      >
        <Text style={styles.listRank}>{index + 1}</Text>
        <View style={[styles.listAvatar, { backgroundColor: item.avatarColor || '#1A202C' }]}>
          <Text style={styles.listAvatarText}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listSubtitle}>{item.city}</Text>
        </View>
        <View style={styles.listStats}>
          <Text style={styles.listValue}>{item.players}</Text>
          <Text style={styles.listLabel}>Players</Text>
        </View>
        <ChevronRight size={18} color="#CBD5E1" />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Team Leaderboard</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.statsSummary}>
          <View style={styles.summaryItem}>
            <Trophy size={16} color="#FFFFFF" opacity={0.8} />
            <Text style={styles.summaryText}>{teams.length} Active Teams</Text>
          </View>
          <View style={styles.summaryBar} />
          <View style={styles.summaryItem}>
             <Target size={16} color="#FFFFFF" opacity={0.8} />
             <Text style={styles.summaryText}>Global Ranking</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <View style={styles.filterRow}>
          <Pressable 
            style={[styles.filterBtn, filter === 'global' && styles.activeFilter]}
            onPress={() => setFilter('global')}
          >
            <Text style={[styles.filterText, filter === 'global' && styles.activeFilterText]}>Global</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterBtn, filter === 'local' && styles.activeFilter]}
            onPress={() => setFilter('local')}
          >
            <Text style={[styles.filterText, filter === 'local' && styles.activeFilterText]}>Nearby</Text>
          </Pressable>
        </View>

        {renderTop3()}

        <View style={styles.listContainer}>
          {topTeams.map(renderListItem)}
        </View>

        {!isPro ? (
          <Pressable 
            style={styles.proBanner}
            onPress={() => navigation.navigate('Subscription')}
          >
            <View style={styles.proBannerContent}>
              <View style={styles.proIconContainer}>
                <Zap color="#FFD700" size={24} fill="#FFD700" />
              </View>
              <View style={styles.proTextContainer}>
                <Text style={styles.proBannerTitle}>Unlock Pro Analytics</Text>
                <Text style={styles.proBannerSubtitle}>Detailed heatmaps, strike-rate analytics, and team momentum charts.</Text>
              </View>
            </View>
            <View style={styles.proCTA}>
              <Text style={styles.proCTAText}>Upgrade Now</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </Pressable>
        ) : (
          <View style={styles.unlockedInsights}>
            <View style={styles.insightHeader}>
               <BarChart3 color={Colors.maroon} size={20} />
               <Text style={styles.insightTitle}>Advanced Performance Insights</Text>
            </View>
            <View style={styles.insightGrid}>
               <View style={styles.insightCard}>
                  <Map size={24} color="#64748B" />
                  <Text style={styles.insightCardLabel}>Pitch Heatmaps</Text>
                  <Text style={styles.insightCardValue}>UNLOCKED</Text>
               </View>
               <View style={styles.insightCard}>
                  <TrendingUp size={24} color="#64748B" />
                  <Text style={styles.insightCardLabel}>Impact Score</Text>
                  <Text style={styles.insightCardValue}>8.4/10</Text>
               </View>
            </View>
          </View>
        )}
        
        <View style={{ height: 40 }} />
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
    backgroundColor: Colors.maroon,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 6,
    borderRadius: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: Colors.maroon,
  },
  statsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryBar: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  scrollBody: {
    paddingTop: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilter: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 260,
    marginBottom: 32,
  },
  podiumItem: {
    alignItems: 'center',
    width: width * 0.28,
  },
  podiumAvatarContainer: {
    marginBottom: 12,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  podiumInitial: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A202C',
  },
  crownIcon: {
    position: 'absolute',
    top: -18,
    alignSelf: 'center',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.maroon,
    marginBottom: 12,
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listRank: {
    width: 24,
    fontSize: 14,
    fontWeight: '900',
    color: '#94A3B8',
    textAlign: 'center',
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listAvatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A202C',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  listStats: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  listValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A237E',
  },
  listLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  proBanner: {
    margin: 16,
    marginTop: 32,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  proIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTextContainer: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  proBannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    fontWeight: '500',
  },
  proCTA: {
    backgroundColor: Colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  proCTAText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  unlockedInsights: {
    margin: 16,
    marginTop: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  insightCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  insightCardValue: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.maroon,
  }
});

export default LeaderboardScreen;
