import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Calendar, ChevronRight, Clock, X, Info } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

type Match = {
  id: string;
  format: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
};

const INITIAL_MATCHES: Match[] = [
  { id: 'm1', format: 'T20', teams: 'India (IND) vs Australia (AUS)', date: '15 Mar 2026', time: '07:30 PM', venue: 'Wankhede Stadium, Mumbai', status: 'live' },
  { id: 'm2', format: 'ODI', teams: 'England (ENG) vs New Zealand (NZ)', date: '18 Mar 2026', time: '02:00 PM', venue: 'Lords, London', status: 'upcoming' },
  { id: 'm3', format: 'T10', teams: 'Team Alpha vs Team Beta', date: '10 Mar 2026', time: '06:00 PM', venue: 'Community Ground', status: 'completed', result: 'Team Alpha won by 8 runs' },
];

const STATUS_COLORS: Record<string, string> = { live: '#E53935', upcoming: '#1565C0', completed: '#2E7D32' };

const MatchCard = ({ match, onPress }: { match: Match; onPress: () => void }) => (
  <Pressable
    style={({ pressed }) => [styles.matchCard, pressed ? { opacity: 0.9 } : null]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${match.teams}, ${match.format}, ${match.date}`}
  >
    <View style={styles.matchCardTop}>
      <View style={styles.formatRow}>
        <View style={[styles.formatBadge, { backgroundColor: Colors.maroon }]}>
          <Text style={styles.formatBadgeText}>{match.format}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[match.status] + '18' }]}>
          {match.status === 'live' && <View style={styles.liveDot} />}
          <Text style={[styles.statusText, { color: STATUS_COLORS[match.status] }]}>
            {match.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <ChevronRight color={Colors.textSecondary} size={18} />
    </View>

    <Text style={styles.teamsText}>{match.teams}</Text>

    <View style={styles.matchMeta}>
      <View style={styles.metaItem}><Calendar color={Colors.textSecondary} size={13} /><Text style={styles.metaText}>{match.date}</Text></View>
      <View style={styles.metaItem}><Clock color={Colors.textSecondary} size={13} /><Text style={styles.metaText}>{match.time}</Text></View>
    </View>
    <Text style={styles.venueText} numberOfLines={1}>📍 {match.venue}</Text>

    {match.result && (
      <View style={styles.resultBanner}>
        <Text style={styles.resultText}>🏆 {match.result}</Text>
      </View>
    )}
  </Pressable>
);

const MatchesMainScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showQuickAction, setShowQuickAction] = useState(false);

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  const handleDeleteMatch = (id: string) => {
    Alert.alert('Delete Match', 'Are you sure you want to delete this match?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMatches(prev => prev.filter(m => m.id !== id)) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Matches</Text>
        <Pressable
          style={({ pressed }) => [styles.createBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={() => navigation.navigate('MatchSetup', {
            onMatchSaved: (newMatch: Match) => {
              setMatches(prev => [...prev, newMatch]);
            }
          })}
          accessibilityRole="button"
          accessibilityLabel="Create new match"
        >
          <Plus color={Colors.white} size={18} />
          <Text style={styles.createBtnText}>New Match</Text>
        </Pressable>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['all', 'live', 'upcoming', 'completed'] as const).map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f ? styles.filterChipActive : null]}
            onPress={() => setFilter(f)}
            accessibilityRole="radio"
            accessibilityLabel={`Filter: ${f}`}
            accessibilityState={{ checked: filter === f }}
          >
            {f === 'live' && filter === f && <View style={styles.liveIndicator} />}
            <Text style={[styles.filterChipText, filter === f ? styles.filterChipTextActive : null]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => {
              setSelectedMatch(item);
              setShowQuickAction(true);
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏏</Text>
            <Text style={styles.emptyTitle}>No Matches Yet</Text>
            <Text style={styles.emptyText}>Tap "New Match" to set up your first match.</Text>
          </View>
        }
      />
      {/* Quick Action Modal */}
      <Modal
        visible={showQuickAction}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuickAction(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalBody}>
              <Text style={styles.modalTeamsText}>{selectedMatch?.teams}</Text>
              
              <View style={styles.modalDetails}>
                <Text style={styles.modalDetailItem}>
                  <Text style={styles.modalLabel}>Format: </Text>{selectedMatch?.format}
                </Text>
                <Text style={styles.modalDetailItem}>
                  <Text style={styles.modalLabel}>Date: </Text>{selectedMatch?.date}
                </Text>
                <Text style={styles.modalDetailItem}>
                  <Text style={styles.modalLabel}>Venue: </Text>{selectedMatch?.venue}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Pressable 
                  style={styles.modalActionBtn}
                  onPress={() => {
                    if (selectedMatch) handleDeleteMatch(selectedMatch.id);
                    setShowQuickAction(false);
                  }}
                >
                  <Text style={[styles.modalActionText, { color: '#E53935' }]}>DELETE</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalActionBtn}
                  onPress={() => {
                    const match = selectedMatch;
                    setShowQuickAction(false);
                    navigation.navigate('MatchSetup', { 
                      match: match,
                      onMatchSaved: (updatedMatch: Match) => {
                        setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
                      }
                    });
                  }}
                >
                  <Text style={styles.modalActionText}>EDIT MATCH</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalActionBtn}
                  onPress={() => {
                    const match = selectedMatch;
                    setShowQuickAction(false);
                    navigation.navigate('SelectPlayingXI', { 
                      teamA: match?.teams.split(' vs ')[0], 
                      teamB: match?.teams.split(' vs ')[1], 
                      format: match?.format 
                    });
                  }}
                >
                  <Text style={styles.modalActionText}>SETUP PLAYING XI</Text>
                </Pressable>

                <Pressable 
                  style={[styles.modalActionBtn, { borderBottomWidth: 0 }]}
                  onPress={() => setShowQuickAction(false)}
                >
                  <Text style={[styles.modalActionText, { color: Colors.textSecondary }]}>CANCEL</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.text },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.maroon, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, minHeight: 44 },
  createBtnText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36 },
  filterChipActive: { backgroundColor: Colors.maroon },
  filterChipText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  filterChipTextActive: { color: Colors.white },
  liveIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.white },
  list: { padding: 16, gap: 14 },
  matchCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 }, android: { elevation: 2 } }) },
  matchCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  formatRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  formatBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  formatBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E53935' },
  statusText: { fontSize: 10, fontWeight: '800' },
  teamsText: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  matchMeta: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  venueText: { fontSize: 12, color: Colors.textSecondary },
  resultBanner: { marginTop: 10, backgroundColor: '#E8F5E9', borderRadius: 8, padding: 8 },
  resultText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: Colors.white, borderRadius: 12, width: '100%', maxWidth: 340, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 }, android: { elevation: 10 } }) },
  modalBody: { padding: 24 },
  modalTeamsText: { fontSize: 22, fontWeight: '500', color: '#333', marginBottom: 16, lineHeight: 28 },
  modalDetails: { marginBottom: 24 },
  modalDetailItem: { fontSize: 16, color: '#444', marginBottom: 4 },
  modalLabel: { color: '#666' },
  modalActions: { alignItems: 'flex-end', gap: 4 },
  modalActionBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  modalActionText: { fontSize: 16, fontWeight: '600', color: '#1A73E8', letterSpacing: 0.5 },
});

export default MatchesMainScreen;
