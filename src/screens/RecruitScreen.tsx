import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  ChevronRight,
  UserPlus,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useProStore } from '../store/useProStore';

// ─── Data ──────────────────────────────────────────────────────────
const TEAMS = [
  {
    id: 't1',
    name: 'Maroon Warriors CC',
    location: 'London, UK',
    urgent: true,
    looking: ['Top-order Batter', 'Leg Spinner'],
    badge: '🛡️',
    bgColor: '#1A1A1A',
  },
  {
    id: 't2',
    name: 'Skyline Strikers',
    location: 'Melbourne, AU',
    urgent: false,
    looking: ['Wicket-keeper'],
    badge: '⚡',
    bgColor: '#1C2D4A',
  },
  {
    id: 't3',
    name: 'Royal Challengers X',
    location: 'Mumbai, IN',
    urgent: false,
    looking: ['All-rounder', 'Fast Bowler'],
    badge: '👑',
    bgColor: '#1A1A3E',
  },
  {
    id: 't4',
    name: 'Thunder Hawks',
    location: 'Dubai, UAE',
    urgent: true,
    looking: ['Opening Batsman', 'Spin Bowler'],
    badge: '🦅',
    bgColor: '#2D1A1A',
  },
];

const PLAYERS = [
  {
    id: 'p1',
    name: 'Arjun Sharma',
    role: 'ALL-ROUNDER',
    status: 'AVAILABLE',
    stats: '342 runs | 18 wkts',
    experience: '8 Years',
    location: 'Mumbai, IN',
    roleColor: '#5B2D6B',
    avatarColor: '#2E7D32',
    initial: 'A',
  },
  {
    id: 'p2',
    name: 'Vikram Singh',
    role: 'BOWLER',
    status: 'AVAILABLE',
    stats: '85 runs | 42 wkts',
    experience: '5 Years',
    location: 'Delhi, IN',
    roleColor: '#1A3A6A',
    avatarColor: '#FF8F00',
    initial: 'V',
  },
  {
    id: 'p3',
    name: 'Rahul Verma',
    role: 'BATSMAN',
    status: 'AVAILABLE',
    stats: '1,240 runs | 0 wkts',
    experience: '12 Years',
    location: 'Bangalore, IN',
    roleColor: '#2D5A1B',
    avatarColor: '#9E9E9E',
    initial: 'R',
  },
  {
    id: 'p4',
    name: 'Siddharth Goel',
    role: 'WICKET KEEPER',
    status: 'AVAILABLE',
    stats: '512 runs | 12 Dismissals',
    experience: '4 Years',
    location: 'Pune, IN',
    roleColor: '#7B3F1A',
    avatarColor: '#2E7D32',
    initial: 'S',
  },
  {
    id: 'p5',
    name: 'Priya Nair',
    role: 'ALL-ROUNDER',
    status: 'NOT AVAILABLE',
    stats: '876 runs | 23 wkts',
    experience: '6 Years',
    location: 'Chennai, IN',
    roleColor: '#5B2D6B',
    avatarColor: '#C2185B',
    initial: 'P',
  },
];

const ROLE_FILTERS = ['All Players', 'All-Rounder', 'Bowler', 'Batsman', 'Wicket Keeper'];

// ─── Team Card ─────────────────────────────────────────────────────
const TeamCard = ({ team, onApply, onViewDetail }: any) => (
  <Pressable
    style={({ pressed }) => [styles.teamCard, pressed ? { opacity: 0.95 } : null]}
    onPress={() => onViewDetail(team)}
    accessibilityRole="button"
    accessibilityLabel={`View ${team.name} recruitment details`}
  >
    <View style={styles.teamCardHeader}>
      <View style={[styles.teamBadge, { backgroundColor: team.bgColor }]}>
        <Text style={styles.teamBadgeEmoji}>{team.badge}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <View style={styles.locationRow}>
          <MapPin color={Colors.textSecondary} size={12} />
          <Text style={styles.locationText}>{team.location}</Text>
        </View>
      </View>
      {team.urgent && (
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentText}>URGENT</Text>
        </View>
      )}
    </View>

    <Text style={styles.lookingForLabel}>LOOKING FOR:</Text>
    <View style={styles.lookingChips}>
      {team.looking.map((role: string) => (
        <View key={role} style={styles.lookingChip}>
          <Text style={styles.lookingChipText}>{role}</Text>
        </View>
      ))}
    </View>

    <Pressable
      style={({ pressed }) => [styles.applyBtn, pressed ? { opacity: 0.85 } : null]}
      onPress={() => onApply(team)}
      accessibilityRole="button"
      accessibilityLabel={`Apply to ${team.name}`}
    >
      <Text style={styles.applyBtnText}>Apply Now</Text>
    </Pressable>
  </Pressable>
);

// ─── Player Card ───────────────────────────────────────────────────
const PlayerCard = ({ player, onViewProfile, isPro }: any) => (
  <View style={styles.playerCard}>
    {isPro && (
      <View style={styles.proSash}>
         <Text style={styles.proSashText}>PRO ANALYSIS AVAILABLE</Text>
      </View>
    )}
    <View style={styles.playerCardGrid}>
      <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor }]}>
        <Text style={styles.playerInitial}>{player.initial}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerCardName}>{player.name}</Text>
        <View style={styles.playerBadges}>
          <View style={[styles.roleBadge, { backgroundColor: player.roleColor }]}>
            <Text style={styles.roleBadgeText}>{player.role}</Text>
          </View>
          <View style={[styles.statusBadge, player.status === 'AVAILABLE' ? styles.statusAvail : styles.statusUnavail]}>
            <Text style={styles.statusBadgeText}>{player.status}</Text>
          </View>
        </View>
        
        <View style={styles.playerMetaRow}>
          <Text style={styles.playerMetaText}>{player.experience} Exp</Text>
          <View style={styles.dot} />
          <Text style={styles.playerMetaText}>{player.location}</Text>
        </View>

        {isPro && (
          <View style={styles.scoutRow}>
            <View style={styles.scoutScoreBox}>
               <Text style={styles.scoutLabel}>SCOUT SCORE</Text>
               <Text style={styles.scoutValue}>8.4<Text style={styles.scoutTotal}>/10</Text></Text>
            </View>
            <Text style={styles.playerStatsText}>{player.stats}</Text>
          </View>
        )}
      </View>
    </View>
    
    <View style={styles.playerCardFooter}>
      <Pressable
        style={({ pressed }) => [styles.analyticsBtn, pressed ? { opacity: 0.8 } : null]}
        onPress={() => {}}
      >
        <Text style={styles.analyticsBtnText}>View Full Analytics</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.viewProfileSmall, pressed ? { opacity: 0.7 } : null]}
        onPress={() => onViewProfile(player)}
      >
        <Text style={styles.viewProfileTextSmall}>View Profile</Text>
        <ChevronRight color={Colors.textSecondary} size={16} />
      </Pressable>
    </View>
  </View>
);

// ─── Main Recruit Screen ───────────────────────────────────────────
const RecruitScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { isPro } = useProStore();
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('players'); // Default to players per design 2
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Players');
  const [teams, setTeams] = useState(TEAMS);
  const [players, setPlayers] = useState(PLAYERS);

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.looking.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All Players' ||
      p.role.toUpperCase().includes(activeFilter.toUpperCase().replace('-', ' '));
    return matchesSearch && matchesFilter;
  });

  const handleApply = (team: any) => {
    Alert.alert(
      `Apply to ${team.name}`,
      'Your application will be submitted with your profile. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', style: 'default', onPress: () => Alert.alert('Applied! ✅', `Your application to ${team.name} has been sent.`) },
      ]
    );
  };

  const handleViewDetail = (team: any) => {
    navigation.navigate('RecruitmentDetail', { team });
  };

  const handleViewProfile = (player: any) => {
    Alert.alert('Player Profile', `${player.name}\n${player.role}\n${player.stats}\n\nFull profile coming soon!`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.menuBtn, pressed ? { opacity: 0.6 } : null]} accessibilityRole="button" accessibilityLabel="Open menu">
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 16 }]} />
          <View style={styles.menuLine} />
        </Pressable>
        <Text style={styles.headerTitle}>CRICPRO</Text>
        <Pressable style={({ pressed }) => [styles.iconBtn44, pressed ? { opacity: 0.6 } : null]} accessibilityRole="button" accessibilityLabel="Notifications">
          <Bell color={Colors.text} size={22} />
        </Pressable>
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search color="#A0A0A0" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'teams' ? 'Search teams or players' : 'Search players by name or role'}
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {activeTab === 'teams' && (
          <Pressable
            style={({ pressed }) => [styles.filterBtn, pressed ? { opacity: 0.7 } : null]}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <SlidersHorizontal color={Colors.text} size={20} />
          </Pressable>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          style={styles.tab}
          onPress={() => { setActiveTab('teams'); setSearchQuery(''); }}
          accessibilityRole="tab"
          accessibilityLabel="Find Teams"
          accessibilityState={{ selected: activeTab === 'teams' }}
        >
          <Text style={[styles.tabText, activeTab === 'teams' ? styles.tabTextActive : null]}>FIND TEAMS</Text>
          {activeTab === 'teams' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => { setActiveTab('players'); setSearchQuery(''); }}
          accessibilityRole="tab"
          accessibilityLabel="Find Players"
          accessibilityState={{ selected: activeTab === 'players' }}
        >
          <Text style={[styles.tabText, activeTab === 'players' ? styles.tabTextActive : null]}>FIND PLAYERS</Text>
          {activeTab === 'players' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      {/* Players Role Filter Chips */}
      {activeTab === 'players' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {ROLE_FILTERS.map(filter => (
            <Pressable
              key={filter}
              style={[styles.filterChip, activeFilter === filter ? styles.filterChipActive : null]}
              onPress={() => setActiveFilter(filter)}
              accessibilityRole="radio"
              accessibilityLabel={`Filter: ${filter}`}
              accessibilityState={{ checked: activeFilter === filter }}
            >
              <Text style={[styles.filterChipText, activeFilter === filter ? styles.filterChipTextActive : null]}>
                {filter}
              </Text>
              {activeFilter !== filter && filter !== 'All Players' && (
                <ChevronDown color={Colors.textSecondary} size={12} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Lists */}
      {activeTab === 'teams' ? (
        <FlatList
          data={filteredTeams}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TeamCard team={item} onApply={handleApply} onViewDetail={handleViewDetail} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No teams found matching your search.</Text>}
        />
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlayerCard player={item} onViewProfile={handleViewProfile} isPro={isPro} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No players found matching your criteria.</Text>}
        />
      )}
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuBtn: { width: 44, height: 44, justifyContent: 'center', gap: 4 },
  menuLine: { height: 2, width: 22, backgroundColor: Colors.text, borderRadius: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.maroon, letterSpacing: 1.5 },
  iconBtn44: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },

  // Search
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterBtn: { width: 46, height: 46, backgroundColor: '#F3F4F6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  // Tabs
  tabRow: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.5 },
  tabTextActive: { color: Colors.maroon },
  tabUnderline: { position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2.5, backgroundColor: Colors.maroon, borderRadius: 2 },

  // Filters
  filterChips: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: Colors.white },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: '#E5E5E5', minHeight: 36 },
  filterChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  filterChipText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  filterChipTextActive: { color: Colors.white },

  listContent: { padding: 16, gap: 16 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: 14 },

  // Team Card
  teamCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  teamCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  teamBadge: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  teamBadgeEmoji: { fontSize: 24 },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: Colors.textSecondary },
  urgentBadge: { backgroundColor: Colors.peach, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#F0C0C0' },
  urgentText: { fontSize: 10, fontWeight: '800', color: Colors.maroon },
  lookingForLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8 },
  lookingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  lookingChip: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#EBEBEB' },
  lookingChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  applyBtn: { backgroundColor: Colors.maroon, paddingVertical: 15, borderRadius: 12, alignItems: 'center', minHeight: 50 },
  applyBtnText: { fontSize: 15, fontWeight: '800', color: Colors.white },

  // Player Card
  playerCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  proSash: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FFA000', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12 },
  proSashText: { fontSize: 8, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  playerCardGrid: { flexDirection: 'row', gap: 16 },
  playerAvatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  playerInitial: { fontSize: 24, fontWeight: '800', color: Colors.white },
  playerInfo: { flex: 1 },
  playerCardName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  playerBadges: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#E8F5E9' },
  statusAvail: { backgroundColor: '#E8F5E9' },
  statusUnavail: { backgroundColor: '#FFEBEE' },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#2E7D32' },
  scoutRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  scoutScoreBox: { backgroundColor: '#F5F7FA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E0E7FF' },
  scoutLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  scoutValue: { fontSize: 14, fontWeight: '900', color: '#F59E0B' },
  scoutTotal: { fontSize: 10, fontWeight: '600', color: '#94A3B8' },
  playerStatsText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  playerCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  analyticsBtn: { backgroundColor: '#1E3A8A', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  analyticsBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  viewProfileSmall: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewProfileTextSmall: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  playerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  playerMetaText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' },
});

export default RecruitScreen;
