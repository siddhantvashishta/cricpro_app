import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Menu, Bell, Search, MapPin, Users, Plus, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore } from '../store/useTeamStore';

// ─── Data ────────────────────────────────────────────────────────────────────
import { Tournament as StoreTournament } from '../store/useTeamStore';

export type Tournament = {
  id: string;
  name: string;
  status: 'live' | 'upcoming' | 'completed';
  format: string;
  venue: string;
  teamsJoined?: number;
  maxTeams?: number;
  regTeams?: number;
  winner?: string;
  startDate?: string;
  endDate?: string;
  isMyTournament?: boolean; // Mock-only field
} | StoreTournament;

const INITIAL_TOURNAMENTS: (Tournament & { isMyTournament: boolean })[] = [
  { id: 't1', name: 'Premier League Season 4', status: 'live', format: 'T20', venue: 'Mumbai Sports Complex', teamsJoined: 12, maxTeams: 16, isMyTournament: true },
  { id: 't2', name: 'Inter-Corporate Cup', status: 'upcoming', format: 'ODI', venue: 'Bangalore Cricket Ground', regTeams: 8, isMyTournament: true },
  { id: 't3', name: 'Winter Smash 2023', status: 'completed', format: 'T20', venue: 'Delhi Gymkhana', winner: 'Apex Strikers', isMyTournament: true },
  { id: 't4', name: 'IPL Pro Series', status: 'live', format: 'T20', venue: 'Eden Gardens, Kolkata', teamsJoined: 8, maxTeams: 8, isMyTournament: false },
  { id: 't5', name: 'National ODI Cup 2024', status: 'upcoming', format: 'ODI', venue: 'Wankhede Stadium', regTeams: 6, isMyTournament: false },
  { id: 't6', name: 'City Test Championship', status: 'completed', format: 'Test', venue: 'M. Chinnaswamy Stadium', winner: 'Red Lions', isMyTournament: false },
  { id: 't7', name: 'T10 Blast Off', status: 'upcoming', format: 'T10', venue: 'Dubai Stadium', regTeams: 4, isMyTournament: false },
];

const STATUS_CONFIG = {
  live: { label: 'LIVE', bg: '#E53935', text: Colors.white },
  upcoming: { label: 'UPCOMING', bg: '#1565C0', text: Colors.white },
  completed: { label: 'COMPLETED', bg: '#546E7A', text: Colors.white },
};

const HERO_COLORS = {
  live: [Colors.maroon, '#6D0000'],
  upcoming: ['#1B2B6B', '#0D1B4B'],
  completed: ['#546E7A', '#37474F'],
};

const FORMAT_FILTERS = ['All', 'T20', 'ODI', 'Test'];

// ─── Tournament Card ────────────────────────────────────────────────────────
const TournamentCard = ({ item, onPress }: { item: Tournament; onPress: () => void }) => {
  const sc = STATUS_CONFIG[item.status];
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed ? { opacity: 0.92 } : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.status}, ${item.format}`}
    >
      {/* Hero Banner */}
      <View style={[styles.cardHero, { backgroundColor: HERO_COLORS[item.status][0] }]}>
        <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
          {item.status === 'live' && <View style={styles.livePulse} />}
          <Text style={[styles.statusBadgeText, { color: sc.text }]}>{sc.label}</Text>
        </View>
        <Text style={styles.cardHeroTitle}>{item.name}</Text>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.cardMetaRow}>
          <View style={styles.cardMetaLeft}>
            <MapPin color={Colors.textSecondary} size={13} />
            <Text style={styles.cardVenue} numberOfLines={1}>{item.venue}</Text>
          </View>
          <View style={styles.formatBadge}>
            <Text style={styles.formatBadgeText}>{item.format}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          {item.status === 'live' && 'teamsJoined' in item && (
            <View>
              <Text style={styles.cardInfoLabel}>TEAMS JOINED</Text>
              <Text style={styles.cardInfoValue}>{item.teamsJoined} / {item.maxTeams}</Text>
            </View>
          )}
          {item.status === 'upcoming' && 'regTeams' in item && (
            <View>
              <Text style={styles.cardInfoLabel}>REGISTRATION</Text>
              <Text style={styles.cardInfoValue}>{item.regTeams} Teams</Text>
            </View>
          )}
          {item.status === 'upcoming' && !('regTeams' in item) && (
            <View>
              <Text style={styles.cardInfoLabel}>MAX TEAMS</Text>
              <Text style={styles.cardInfoValue}>{item.maxTeams} Teams</Text>
            </View>
          )}
          {item.status === 'completed' && (
            <View>
              <Text style={styles.cardInfoLabel}>WINNER</Text>
              <Text style={[styles.cardInfoValue, { color: Colors.maroon }]}>{item.winner}</Text>
            </View>
          )}

          {item.status === 'live' && (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.8 } : null]}
              onPress={onPress}
              accessibilityRole="button" accessibilityLabel="View matches"
            >
              <Text style={styles.actionBtnText}>View Matches</Text>
            </Pressable>
          )}
          {item.status === 'upcoming' && (
            <Pressable
              style={({ pressed }) => [styles.actionBtnOutline, pressed ? { opacity: 0.8 } : null]}
              onPress={() => Alert.alert('Join Tournament', `Join "${item.name}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Join', onPress: () => Alert.alert('Joined!', `You have registered for ${item.name}.`) },
              ])}
              accessibilityRole="button" accessibilityLabel="Join now"
            >
              <Text style={styles.actionBtnOutlineText}>Join Now</Text>
            </Pressable>
          )}
          {item.status === 'completed' && (
            <Pressable
              style={({ pressed }) => [styles.actionBtnOut2, pressed ? { opacity: 0.8 } : null]}
              onPress={onPress}
              accessibilityRole="button" accessibilityLabel="View results"
            >
              <Text style={styles.actionBtnOut2Text}>Results</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
const TournamentListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { tournaments } = useTeamStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');
  const [formatFilter, setFormatFilter] = useState('All');

  const filtered = useMemo(() => {
    // Combine mock data with real store data for richer experience
    const allTournaments = [...tournaments, ...INITIAL_TOURNAMENTS];
    let list = allTournaments.filter(t => {
      const isMine = ('isMyTournament' in t && t.isMyTournament) || tournaments.some(st => st.id === t.id);
      return activeTab === 'my' ? isMine : !isMine;
    });
    if (formatFilter !== 'All') list = list.filter(t => t.format === formatFilter);
    if (query.trim()) list = list.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || (t.venue && t.venue.toLowerCase().includes(query.toLowerCase())));
    return list;
  }, [query, activeTab, formatFilter, tournaments]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Menu">
          <Menu color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>CRICPRO</Text>
        <Pressable style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Notifications">
          <Bell color={Colors.maroon} size={22} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search color="#B0B0B0" size={16} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search tournaments..."
          placeholderTextColor="#B0B0B0"
          accessibilityLabel="Search tournaments"
        />
      </View>

      {/* My Tournaments / Discover tabs */}
      <View style={styles.mainTabs}>
        {[{ key: 'my', label: 'My Tournaments' }, { key: 'discover', label: 'Discover' }].map(tab => (
          <Pressable
            key={tab.key}
            style={styles.mainTab}
            onPress={() => setActiveTab(tab.key as 'my' | 'discover')}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text style={[styles.mainTabText, activeTab === tab.key ? styles.mainTabTextActive : null]}>{tab.label}</Text>
            {activeTab === tab.key && <View style={styles.mainTabUnderline} />}
          </Pressable>
        ))}
      </View>

      {/* Format filter chips */}
      <View style={styles.formatRow}>
        {FORMAT_FILTERS.map(f => (
          <Pressable
            key={f}
            style={[styles.formatChip, formatFilter === f ? styles.formatChipActive : null]}
            onPress={() => setFormatFilter(f)}
            accessibilityRole="radio"
            accessibilityLabel={`Filter by ${f}`}
            accessibilityState={{ checked: formatFilter === f }}
          >
            <Text style={[styles.formatChipText, formatFilter === f ? styles.formatChipTextActive : null]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TournamentCard
            item={item}
            onPress={() => navigation.navigate('TournamentDetail', { tournament: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyTitle}>No Tournaments Found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or create one!</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85 } : null]}
        onPress={() => navigation.navigate('CreateTournament')}
        accessibilityRole="button"
        accessibilityLabel="Create tournament"
      >
        <Plus color={Colors.white} size={26} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: Colors.maroon, letterSpacing: 0.8 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 14, backgroundColor: Colors.white, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#F0E0E0' },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  mainTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  mainTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  mainTabText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  mainTabTextActive: { color: Colors.maroon },
  mainTabUnderline: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 2.5, backgroundColor: Colors.maroon, borderRadius: 2 },
  formatRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  formatChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E5E5', minHeight: 36 },
  formatChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  formatChipText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  formatChipTextActive: { color: Colors.white },
  list: { padding: 14, gap: 14, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }) },
  cardHero: { padding: 16, minHeight: 80, justifyContent: 'space-between', gap: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 5 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.white },
  statusBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  cardHeroTitle: { fontSize: 18, fontWeight: '900', color: Colors.white },
  cardBody: { padding: 14 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardMetaLeft: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  cardVenue: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  formatBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  formatBadgeText: { fontSize: 12, fontWeight: '800', color: Colors.text },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfoLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 4 },
  cardInfoValue: { fontSize: 15, fontWeight: '900', color: Colors.text },
  actionBtn: { backgroundColor: Colors.maroon, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, minHeight: 42 },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  actionBtnOutline: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: Colors.maroon, minHeight: 42 },
  actionBtnOutlineText: { fontSize: 13, fontWeight: '800', color: Colors.maroon },
  actionBtnOut2: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#B0B0B0', minHeight: 42 },
  actionBtnOut2Text: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 }, android: { elevation: 8 } }) },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
});

export default TournamentListScreen;
