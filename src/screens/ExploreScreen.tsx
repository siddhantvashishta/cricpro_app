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
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, UserPlus, Users, Eye, TrendingUp, MapPin } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Player, Team } from '../store/useTeamStore';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const ExploreScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { players, teams, toggleFollow, following, sendSocialRequest, friends, socialRequests } = useTeamStore();
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const [search, setSearch] = useState('');

  const trendingPlayers = Object.values(players).slice(0, 6);
  const trendingTeams = teams.slice(0, 4);

  const renderPlayerCard = (player: Player) => {
    const isFriend = friends.includes(player.id);
    const hasPendingRequest = socialRequests.some(
      req => req.senderId === 'me' && req.receiverId === player.id && req.status === 'pending'
    );

    const handleAddFriend = () => {
      sendSocialRequest({
        senderId: 'me',
        receiverId: player.id,
        type: 'friend',
      });
    };

    return (
      <Pressable 
        key={player.id} 
        style={styles.gridCard}
        onPress={() => navigation.navigate('PlayerProfile', { name: player.name })}
      >
        <View style={[styles.cardImage, { backgroundColor: player.roleColor || '#E2E8F0' }]}>
          <Text style={styles.cardInitial}>{player.name.charAt(0)}</Text>
          <View style={styles.cardOverlay}>
             <View style={styles.roleTag}>
               <Text style={styles.roleTagText}>{player.role}</Text>
             </View>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{player.name}</Text>
          <Text style={styles.cardSubtext}>{player.city || 'Mumbai'} • {player.stats?.RUNS || 0} runs</Text>
          <Pressable 
            style={[
              styles.followBtn, 
              (isFriend || hasPendingRequest) && styles.followingBtn
            ]}
            onPress={!isFriend && !hasPendingRequest ? handleAddFriend : undefined}
          >
            <Text style={[
              styles.followBtnText, 
              (isFriend || hasPendingRequest) && styles.followingBtnText
            ]}>
              {isFriend ? 'Friend' : hasPendingRequest ? 'Requested' : 'Add Friend'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderTeamCard = (team: Team) => {
    const isMember = team.roster.includes('me');
    const hasPendingRequest = socialRequests.some(
      req => req.senderId === 'me' && req.teamId === team.id && req.status === 'pending'
    );

    const handleJoinTeam = () => {
      sendSocialRequest({
        senderId: 'me',
        receiverId: 'owner', // In a real app, this would be the owner's ID
        type: 'team_join',
        teamId: team.id,
      });
    };

    return (
      <Pressable 
        key={team.id} 
        style={styles.gridCard}
        onPress={() => navigation.navigate('TeamDetail', { teamId: team.id })}
      >
        <View style={[styles.cardImage, { backgroundColor: team.themeColor || '#1A202C' }]}>
          <Text style={styles.cardInitial}>{team.name.charAt(0)}</Text>
          <View style={styles.cardOverlay}>
             <View style={styles.teamBadge}>
               <Text style={styles.teamBadgeText}>TEAM</Text>
             </View>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{team.name}</Text>
          <Text style={styles.cardSubtext}>{team.players} Players • {team.city}</Text>
          <Pressable 
            style={[
              styles.followBtn, 
              (isMember || hasPendingRequest) && styles.followingBtn
            ]}
            onPress={!isMember && !hasPendingRequest ? handleJoinTeam : undefined}
          >
            <Text style={[
              styles.followBtnText, 
              (isMember || hasPendingRequest) && styles.followingBtnText
            ]}>
              {isMember ? 'Joined' : hasPendingRequest ? 'Pending' : 'Join Team'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search color="#94A3B8" size={20} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search cricketers, teams..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable style={styles.filterBtn}>
            <SlidersHorizontal color="#1A202C" size={20} />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          <Pressable 
            style={[styles.tab, activeTab === 'players' && styles.activeTab]}
            onPress={() => setActiveTab('players')}
          >
            <Users size={18} color={activeTab === 'players' ? Colors.maroon : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>Players</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'teams' && styles.activeTab]}
            onPress={() => setActiveTab('teams')}
          >
            <TrendingUp size={18} color={activeTab === 'teams' ? Colors.maroon : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'teams' && styles.activeTabText]}>Teams</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover Trending {activeTab === 'players' ? 'Cricketers' : 'Clubs'}</Text>
          <Text style={styles.sectionSubtitle}>People near {Object.values(players)[0]?.city || 'Mumbai'}</Text>
        </View>

        <View style={styles.grid}>
          {activeTab === 'players' 
            ? trendingPlayers.map(renderPlayerCard)
            : trendingTeams.map(renderTeamCard)
          }
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>Join a Team 🏏</Text>
            <Text style={styles.bannerText}>Teams are looking for {activeTab === 'players' ? 'players like you' : 'new talent'}. Check recruiting status.</Text>
            <Pressable style={styles.bannerBtn} onPress={() => navigation.navigate('Recruit')}>
               <Text style={styles.bannerBtnText}>Explore Matches</Text>
            </Pressable>
          </View>
          <View style={styles.bannerCircle} />
        </View>

        <View style={styles.matchingSection}>
          <Text style={styles.sectionTitle}>Matchmaking Hub</Text>
          <Text style={styles.sectionSubtitle}>Find your perfect team matchup</Text>
          <View style={styles.matchmakingOptions}>
             <Pressable style={styles.matchmakingCard}>
                <View style={[styles.matchIconBg, { backgroundColor: '#E0F2FE' }]}><Users color="#0284C7" size={24} /></View>
                <Text style={styles.matchLabel}>Need Team</Text>
             </Pressable>
             <Pressable style={styles.matchmakingCard}>
                <View style={[styles.matchIconBg, { backgroundColor: '#F0FDF4' }]}><UserPlus color="#16A34A" size={24} /></View>
                <Text style={styles.matchLabel}>Need Player</Text>
             </Pressable>
             <Pressable style={styles.matchmakingCard}>
                <View style={[styles.matchIconBg, { backgroundColor: '#FFF7ED' }]}><MapPin color="#EA580C" size={24} /></View>
                <Text style={styles.matchLabel}>Nearby</Text>
             </Pressable>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FEF2F2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  activeTabText: {
    color: Colors.maroon,
  },
  scrollContent: {
    paddingTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  gridCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  cardImage: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInitial: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    opacity: 0.3,
  },
  cardOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A202C',
  },
  teamBadge: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  teamBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardInfo: {
    padding: 16,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
  },
  followBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#F1F5F9',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  followingBtnText: {
    color: '#64748B',
  },
  banner: {
    margin: 16,
    marginTop: 32,
    backgroundColor: Colors.maroon,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bannerInfo: {
    flex: 1,
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 20,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.maroon,
  },
  bannerCircle: {
    position: 'absolute',
    right: -20,
    bottom: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  matchingSection: {
    padding: 20,
    marginTop: 8,
  },
  matchmakingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  matchmakingCard: {
    width: (width - 64) / 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  matchIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A202C',
  }
});

export default ExploreScreen;
