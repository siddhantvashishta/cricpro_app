import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Settings, Search, ChevronRight, Plus, Users } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Team } from '../store/useTeamStore';
import NotificationsModal from '../components/NotificationsModal';

const FormatTag = ({ label }: { label: string }) => (
  <View style={styles.formatTag}>
    <Text style={styles.formatTagText}>{label}</Text>
  </View>
);

const TeamCard = ({ team, onPress }: { team: Team; onPress: () => void }) => (
  <Pressable
    style={({ pressed }) => [styles.teamCard, pressed ? { opacity: 0.88 } : null]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${team.name}, ${team.roster.length} players`}
  >
    {/* Avatar */}
    <View style={[styles.teamAvatar, { backgroundColor: team.avatarColor }]}>
      <Text style={styles.teamAvatarText}>{team.avatarLetter}</Text>
    </View>

    {/* Info */}
    <View style={styles.teamInfo}>
      <Text style={styles.teamName}>{team.name}</Text>
      <Text style={styles.teamMeta}>Founded {team.yearFounded} | {team.roster.length} Players</Text>
      <View style={styles.formatRow}>
        {team.formats.map(f => <FormatTag key={f} label={f} />)}
      </View>
    </View>

    <ChevronRight color={Colors.textSecondary} size={20} />
  </Pressable>
);

const MyTeamsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { teams } = useTeamStore();
  const [query, setQuery] = useState('');
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return teams;
    return teams.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.city.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, teams]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.maroon} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>My Teams</Text>
        <View style={styles.headerRight}>
          <Pressable 
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]} 
            onPress={() => setIsNotificationsVisible(true)}
            accessibilityRole="button" 
            accessibilityLabel="Notifications"
          >
            <View>
              <Bell color={Colors.text} size={22} />
              <View style={styles.notificationBadge} />
            </View>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]} 
            onPress={() => navigation.navigate('TeamSettings')}
            accessibilityRole="button" 
            accessibilityLabel="Settings"
          >
            <Settings color={Colors.text} size={22} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search color="#B0B0B0" size={16} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search your teams..."
          placeholderTextColor="#B0B0B0"
          accessibilityLabel="Search teams"
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Users color={Colors.textSecondary} size={48} />
            <Text style={styles.emptyTitle}>No Teams Yet</Text>
            <Text style={styles.emptyText}>Tap + to create your first team</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85 } : null]}
        onPress={() => navigation.navigate('CreateTeam')}
        accessibilityRole="button"
        accessibilityLabel="Create new team"
      >
        <Plus color={Colors.white} size={26} strokeWidth={2.5} />
      </Pressable>

      {/* Notifications Modal */}
      <NotificationsModal 
        isVisible={isNotificationsVisible}
        onClose={() => setIsNotificationsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EE' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: Colors.text, marginLeft: 4 },
  headerRight: { flexDirection: 'row' },
  notificationBadge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E53935', borderWidth: 1.5, borderColor: Colors.white },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 14, backgroundColor: Colors.white, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#F0E0E0' },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  list: { paddingHorizontal: 14, paddingBottom: 100 },
  teamCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 16, gap: 14, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  teamAvatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  teamAvatarText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  teamInfo: { flex: 1, gap: 4 },
  teamName: { fontSize: 16, fontWeight: '900', color: Colors.text },
  teamMeta: { fontSize: 12, color: Colors.textSecondary },
  formatRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  formatTag: { backgroundColor: Colors.peach, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: '#F0C0C0' },
  formatTagText: { fontSize: 11, fontWeight: '800', color: Colors.maroon },
  fab: { position: 'absolute', bottom: 28, right: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 }, android: { elevation: 8 } }) },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { fontSize: 13, color: Colors.textSecondary },
});

export default MyTeamsScreen;
