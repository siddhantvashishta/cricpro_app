import * as React from 'react';
import { useState, useCallback } from 'react';
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
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Plus, UserPlus, Search, X, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Player, PlayerRole } from '../store/useTeamStore';

// ─── Data ───────────────────────────────────────────────────────────
type CVC = 'C' | 'VC' | null;

const MAX_SELECTED = 11;

const PlayerRow = React.memo(({ player, checked, onToggle, cvc, onLongPress }: {
  player: Player; checked: boolean; onToggle: () => void; cvc: CVC; onLongPress: () => void;
}) => (
  <Pressable
    style={({ pressed }) => [styles.playerRow, checked ? styles.playerRowSelected : null, pressed ? { opacity: 0.85 } : null]}
    onPress={onToggle}
    onLongPress={onLongPress}
    delayLongPress={500}
  >
    {/* Checkbox */}
    <View style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
      {checked && <Check color={Colors.white} size={14} strokeWidth={3} />}
    </View>

    {/* Avatar */}
    <View style={[styles.playerAvatar, { backgroundColor: player.roleColor }]}>
      <Text style={styles.playerInitial}>{player.name.charAt(0)}</Text>
      {cvc && (
        <View style={[styles.cvcBadge, cvc === 'C' ? styles.cvcC : styles.cvcVC]}>
          <Text style={styles.cvcText}>{cvc}</Text>
        </View>
      )}
    </View>

    {/* Info */}
    <View style={styles.playerInfo}>
      <View style={styles.playerNameRow}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: player.roleColor + '22' }]}>
          <Text style={[styles.roleBadgeText, { color: player.roleColor }]}>{player.role}</Text>
        </View>
      </View>
      <Text style={styles.playerDesc}>{player.username || 'CricPro Member'}</Text>
    </View>

    {/* Stats Snippet */}
    <View style={styles.pointsCol}>
      <Text style={styles.pointsLabel}>MATCHES</Text>
      <Text style={styles.pointsValue}>{player.stats.MAT}</Text>
    </View>
  </Pressable>
));

const SelectPlayingXIScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { teamAInfo, teamBInfo, format = 'T20', overs, date, time, venue, notes } = route?.params || {};
  const { players: allPlayers, teams, addPlayerToTeam, addMatch } = useTeamStore();

  // Recruitment State
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitName, setRecruitName] = useState('');
  const [recruitRole, setRecruitRole] = useState<PlayerRole>('BAT');

  // Custom Popup States
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);

  // Dynamic Squad Fetching
  const getSquad = (teamInfo: any) => {
    if (!teamInfo) return [];
    const team = teams.find(t => t.id === teamInfo.id);
    if (!team) return [];
    return team.roster.map(pid => allPlayers[pid]).filter(Boolean);
  };

  const squadA = getSquad(teamAInfo);
  const squadB = getSquad(teamBInfo);

  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');
  // Pre-select up to 11 players automatically to save time
  const [selectedA, setSelectedA] = useState<Set<string>>(new Set(squadA.slice(0, MAX_SELECTED).map(p => p.id)));
  const [selectedB, setSelectedB] = useState<Set<string>>(new Set(squadB.slice(0, MAX_SELECTED).map(p => p.id)));
  const [cvcMap, setCvcMap] = useState<Record<string, CVC>>({});

  const currentSquad = activeTeam === 'A' ? squadA : squadB;
  const currentSelected = activeTeam === 'A' ? selectedA : selectedB;
  const setCurrentSelected = activeTeam === 'A' ? setSelectedA : setSelectedB;
  const currentTeamInfo = activeTeam === 'A' ? teamAInfo : teamBInfo;

  const totalSelected = selectedA.size + selectedB.size;

  const togglePlayer = useCallback((id: string) => {
    setCurrentSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCvcMap(m => { const n = { ...m }; delete n[id]; return n; });
      } else {
        if (next.size >= MAX_SELECTED) {
          Alert.alert('Maximum reached', `You can only select ${MAX_SELECTED} players per team.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }, [setCurrentSelected]);

  const handleLongPress = useCallback((player: Player) => {
    if (!currentSelected.has(player.id)) {
      Alert.alert('Select player first', 'Please select this player before assigning Captain or Vice-Captain.');
      return;
    }
    setTargetPlayer(player);
    setShowRoleModal(true);
  }, [currentSelected]);

  const handleConfirm = () => {
    if (selectedA.size === 0 || selectedB.size === 0) {
      Alert.alert('Selection Error', 'Please select at least one player for each team.');
      return;
    }
    setShowFinalizeModal(true);
  };

  const handleAction = (action: 'start' | 'schedule') => {
    const selectedPlayersA = squadA.filter(p => selectedA.has(p.id));
    const selectedPlayersB = squadB.filter(p => selectedB.has(p.id));

    const matchData = {
      id: `m_${Date.now()}`,
      format,
      teams: `${teamAInfo?.name} vs ${teamBInfo?.name}`,
      teamAInfo,
      teamBInfo,
      playersA: selectedPlayersA,
      playersB: selectedPlayersB,
      cvcMap,
      date,
      time,
      venue,
      status: action === 'start' ? 'live' : 'upcoming',
      overs,
      notes,
      scheduledAt: `${date} at ${time}`
    };

    addMatch(matchData as any);

    if (action === 'start') {
      navigation.navigate('CoinToss', { 
        teamA: teamAInfo,
        teamB: teamBInfo,
        playersA: selectedPlayersA,
        playersB: selectedPlayersB,
        cvcMap 
      });
    } else {
      Alert.alert('Match Scheduled', 'Your match has been saved to Upcoming Matches.');
      navigation.navigate('Main'); // Go back to Home
    }
  };

  const handleRecruit = () => {
    if (!recruitName.trim()) {
      Alert.alert('Error', 'Please enter player name.');
      return;
    }

    const team = teams.find(t => t.id === currentTeamInfo?.id);
    if (team && team.roster.length >= 15) {
      Alert.alert('Squad Full', 'You can only have up to 15 players in your squad. Please remove someone from the team details screen first.');
      return;
    }

    const newPlayer: Player = {
      id: `p_${Date.now()}`,
      name: recruitName.trim(),
      role: recruitRole,
      roleColor: recruitRole === 'BAT' ? '#1565C0' : recruitRole === 'BWL' ? '#6A1B9A' : recruitRole === 'AR' ? '#2E7D32' : '#E65100',
      stats: { MAT: 0, INN: 0, RUNS: 0, HS: '0', AVG: 0, SR: 0, '100S': 0, '50S': 0, '4S': 0, '6S': 0, WKTS: 0, BBI: '-', ECON: 0 },
      avatar: undefined,
    };

    addPlayerToTeam(currentTeamInfo.id, newPlayer);
    
    // Auto select the new player
    setCurrentSelected(prev => new Set([...Array.from(prev), newPlayer.id]));
    
    setRecruitName('');
    setShowRecruitModal(false);
    Alert.alert('Success', `${recruitName} added to ${currentTeamInfo.name} roster.`);
  };

  // Balance summary
  const allSelected = [...squadA.filter(p => selectedA.has(p.id)), ...squadB.filter(p => selectedB.has(p.id))];
  const batCount = allSelected.filter(p => p.role === 'BAT').length;
  const bwlCount = allSelected.filter(p => p.role === 'BWL').length;
  const wkCount = allSelected.filter(p => p.role === 'WK').length;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button" accessibilityLabel="Go back"
          >
            <ArrowLeft color={Colors.maroon} size={22} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Select Playing XI</Text>
            <Text style={styles.headerSub}>Match: {teamAInfo?.name} vs {teamBInfo?.name}</Text>
          </View>
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>TEAM {activeTeam}: {currentSelected.size}/{MAX_SELECTED}</Text>
          </View>
        </View>

        {/* Team Tabs */}
        <View style={styles.teamTabs}>
          {(['A', 'B'] as const).map(t => {
            const label = t === 'A' ? teamAInfo?.name : teamBInfo?.name;
            const sel = t === 'A' ? selectedA.size : selectedB.size;
            return (
              <Pressable
                key={t}
                style={styles.teamTab}
                onPress={() => setActiveTeam(t)}
              >
                <Text style={[styles.teamTabText, activeTeam === t ? styles.teamTabTextActive : null]} numberOfLines={1}>
                  {label} ({sel})
                </Text>
                {activeTeam === t && <View style={styles.teamTabUnderline} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Squad list header */}
      <View style={styles.squadHeader}>
        <View>
           <Text style={styles.squadHeaderTitle}>SQUAD MEMBERS ({currentSquad.length})</Text>
           <Text style={styles.squadHeaderHint}>Long press to assign C/VC</Text>
        </View>
        <Pressable 
          style={styles.recruitBtn}
          onPress={() => setShowRecruitModal(true)}
        >
          <UserPlus color={Colors.maroon} size={16} />
          <Text style={styles.recruitBtnText}>Recruit</Text>
        </Pressable>
      </View>

      <FlatList
        data={currentSquad}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PlayerRow
            player={item}
            checked={currentSelected.has(item.id)}
            onToggle={() => togglePlayer(item.id)}
            cvc={cvcMap[item.id] || null}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <View style={styles.bottomInfo}>
          <View style={styles.avatarStack}>
            {allSelected.slice(0, 3).map((p, i) => (
              <View key={p.id} style={[styles.stackAvatar, { backgroundColor: p.roleColor, marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }]}>
                <Text style={styles.stackInitial}>{p.name.charAt(0)}</Text>
              </View>
            ))}
            {allSelected.length > 3 && (
              <View style={[styles.stackAvatar, styles.stackMore, { marginLeft: -10 }]}>
                <Text style={styles.stackMoreText}>+{allSelected.length - 3}</Text>
              </View>
            )}
          </View>
          <Text style={styles.balanceLabel}>Player Balance</Text>
          <View style={styles.balanceBadges}>
            <View style={[styles.balanceBadge, { backgroundColor: '#1565C0' }]}><Text style={styles.balanceBadgeText}>{batCount} BAT</Text></View>
            <View style={[styles.balanceBadge, { backgroundColor: '#6A1B9A' }]}><Text style={styles.balanceBadgeText}>{bwlCount} BWL</Text></View>
            <View style={[styles.balanceBadge, { backgroundColor: '#E65100' }]}><Text style={styles.balanceBadgeText}>{wkCount} WK</Text></View>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.confirmBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBtnText}>Finalize & Proceed</Text>
          <ChevronRight color={Colors.white} size={20} />
        </Pressable>
      </View>

      {/* Role Assignment Modal */}
      <Modal visible={showRoleModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.roleModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Assign Role</Text>
                <Text style={styles.modalSubtitle}>{targetPlayer?.name}</Text>
              </View>
              <Pressable onPress={() => setShowRoleModal(false)}><X color={Colors.textSecondary} size={24} /></Pressable>
            </View>
            
            <View style={styles.roleOptions}>
              <Pressable 
                style={styles.roleOption} 
                onPress={() => { setCvcMap(m => ({ ...m, [targetPlayer!.id]: 'C' })); setShowRoleModal(false); }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: Colors.maroon }]}>
                  <Text style={styles.roleIconText}>C</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleOptionTitle}>Captain</Text>
                  <Text style={styles.roleOptionDesc}>Team leader for this match</Text>
                </View>
              </Pressable>

              <Pressable 
                style={styles.roleOption} 
                onPress={() => { setCvcMap(m => ({ ...m, [targetPlayer!.id]: 'VC' })); setShowRoleModal(false); }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: '#1B5E20' }]}>
                  <Text style={styles.roleIconText}>VC</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleOptionTitle}>Vice Captain</Text>
                  <Text style={styles.roleOptionDesc}>Supporting the team lead</Text>
                </View>
              </Pressable>

              <Pressable 
                style={[styles.roleOption, { borderBottomWidth: 0 }]} 
                onPress={() => { setCvcMap(m => { const n = { ...m }; delete n[targetPlayer!.id]; return n; }); setShowRoleModal(false); }}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: '#F1F5F9' }]}>
                  <X color={Colors.textSecondary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleOptionTitle}>Remove Role</Text>
                  <Text style={styles.roleOptionDesc}>Clear current assignment</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Finalize Match Modal */}
      <Modal visible={showFinalizeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.finalizeModalContent}>
            <View style={styles.finalizeHeader}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>MATCH READY</Text>
              </View>
              <Text style={styles.finalizeTitle}>Ready to Roll?</Text>
              <Text style={styles.finalizeDesc}>
                Squads finalized for {teamAInfo?.name} vs {teamBInfo?.name}. Choose your match action below.
              </Text>
            </View>

            <View style={styles.finalizeActions}>
              <Pressable 
                style={styles.actionCard} 
                onPress={() => { setShowFinalizeModal(false); handleAction('start'); }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: Colors.maroon }]}>
                   <Plus color={Colors.white} size={28} />
                </View>
                <Text style={styles.actionCardTitle}>Start Scoring</Text>
                <Text style={styles.actionCardDesc}>Begin live match updates now</Text>
              </Pressable>

              <Pressable 
                style={[styles.actionCard, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}
                onPress={() => { setShowFinalizeModal(false); handleAction('schedule'); }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#64748B' }]}>
                   <Check color={Colors.white} size={24} />
                </View>
                <Text style={[styles.actionCardTitle, { color: Colors.text }]}>Schedule Later</Text>
                <Text style={styles.actionCardDesc}>Save to upcoming fixtures</Text>
              </Pressable>
            </View>

            <Pressable style={styles.backToSquadBtn} onPress={() => setShowFinalizeModal(false)}>
              <Text style={styles.backToSquadText}>Back to Squads</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Recruitment Modal */}
      <Modal
        visible={showRecruitModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRecruitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recruitModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Recruit Player</Text>
                <Text style={styles.modalSubtitle}>Adding to {currentTeamInfo?.name}</Text>
              </View>
              <Pressable onPress={() => setShowRecruitModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </Pressable>
            </View>

            <View style={styles.recruitInputRow}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={styles.recruitInputBox}>
                <TextInput
                  style={styles.recruitInput}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor="#94A3B8"
                  value={recruitName}
                  onChangeText={setRecruitName}
                  autoFocus
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>SELECT PLAYING ROLE</Text>
            <View style={styles.roleGrid}>
              {(['BAT', 'BWL', 'AR', 'WK'] as PlayerRole[]).map(role => (
                <Pressable
                  key={role}
                  style={[styles.roleChip, recruitRole === role && styles.roleChipActive]}
                  onPress={() => setRecruitRole(role)}
                >
                  <Text style={[styles.roleChipText, recruitRole === role && styles.roleChipTextActive]}>{role}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [styles.recruitConfirmBtn, pressed ? { opacity: 0.9 } : null]}
              onPress={handleRecruit}
            >
              <Text style={styles.recruitConfirmText}>Confirm & Invite</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: Colors.white, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  selectedBadge: { backgroundColor: Colors.peach, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F0C0C0' },
  selectedBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.maroon },
  teamTabs: { flexDirection: 'row' },
  teamTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  teamTabText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  teamTabTextActive: { color: Colors.maroon },
  teamTabUnderline: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 2.5, backgroundColor: Colors.maroon, borderRadius: 2 },
  squadHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  squadHeaderTitle: { fontSize: 11, fontWeight: '800', color: Colors.text, letterSpacing: 0.5 },
  squadHeaderHint: { fontSize: 11, color: Colors.textSecondary },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 12 },
  playerRowSelected: { borderLeftWidth: 3, borderLeftColor: Colors.maroon },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  playerAvatar: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playerInitial: { fontSize: 18, fontWeight: '900', color: Colors.white },
  cvcBadge: { position: 'absolute', bottom: -2, right: -4, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.white },
  cvcC: { backgroundColor: Colors.maroon },
  cvcVC: { backgroundColor: '#1B5E20' },
  cvcText: { fontSize: 8, fontWeight: '900', color: Colors.white },
  playerInfo: { flex: 1 },
  playerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playerName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  roleBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  roleBadgeText: { fontSize: 10, fontWeight: '800' },
  playerDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  pointsCol: { alignItems: 'flex-end' },
  pointsLabel: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.3 },
  pointsValue: { fontSize: 20, fontWeight: '900', color: Colors.text },
  bottomBar: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  bottomInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  stackInitial: { fontSize: 11, fontWeight: '800', color: Colors.white },
  stackMore: { backgroundColor: '#E0E0E0' },
  stackMoreText: { fontSize: 10, fontWeight: '800', color: Colors.text },
  balanceLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  balanceBadges: { flexDirection: 'row', gap: 4, marginLeft: 'auto' },
  balanceBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  balanceBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.maroon, paddingVertical: 16, borderRadius: 14, gap: 10, minHeight: 52 },
  confirmBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  confirmBtnCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },

  // Recruitment UI
  recruitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.peach, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  recruitBtnText: { fontSize: 12, fontWeight: '800', color: Colors.maroon },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  recruitModalContent: { backgroundColor: Colors.white, borderRadius: 32, padding: 24, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, fontWeight: '500' },
  
  recruitInputRow: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, marginBottom: 10, letterSpacing: 1 },
  recruitInputBox: { backgroundColor: '#F1F5F9', borderRadius: 14, paddingHorizontal: 16, height: 56, justifyContent: 'center' },
  recruitInput: { fontSize: 16, color: Colors.text, fontWeight: '600' },
  
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  roleChip: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  roleChipActive: { backgroundColor: Colors.peach, borderColor: Colors.maroon },
  roleChipText: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  roleChipTextActive: { color: Colors.maroon },
  recruitConfirmBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  recruitConfirmText: { color: Colors.white, fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },

  // Role Modal
  roleModalContent: { backgroundColor: Colors.white, borderRadius: 32, padding: 24, width: '100%', maxWidth: 360 },
  roleOptions: { marginTop: 10 },
  roleOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 16 },
  roleIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  roleIconText: { color: Colors.white, fontWeight: '900', fontSize: 18 },
  roleOptionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  roleOptionDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  // Finalize Modal
  finalizeModalContent: { backgroundColor: Colors.white, borderRadius: 32, padding: 28, width: '100%', maxWidth: 400, alignItems: 'center' },
  finalizeHeader: { alignItems: 'center', marginBottom: 30 },
  matchBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  matchBadgeText: { color: '#059669', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  finalizeTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  finalizeDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
  
  finalizeActions: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionCard: { flex: 1, backgroundColor: '#FFF7ED', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#FED7AA' },
  actionIconBox: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionCardTitle: { fontSize: 15, fontWeight: '900', color: '#C2410C', marginBottom: 4 },
  actionCardDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  
  backToSquadBtn: { paddingVertical: 10 },
  backToSquadText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
});

export default SelectPlayingXIScreen;
