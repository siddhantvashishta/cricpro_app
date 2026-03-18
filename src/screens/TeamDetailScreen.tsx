import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Trash2, MapPin, Calendar, Users, Shield, MessageSquare, Share2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Team, Player } from '../store/useTeamStore';
import { Linking } from 'react-native';
import InviteModal from '../components/InviteModal';
import { AlertCircle } from 'lucide-react-native';

const TeamDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { teamId } = route.params;
  const { teams, players, updateTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam } = useTeamStore();

  const team = teams.find(t => t.id === teamId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null);
  
  // API Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editName, setEditName] = useState(team?.name || '');
  const [editCity, setEditCity] = useState(team?.city || '');
  const [editGround, setEditGround] = useState(team?.homeGround || '');
  const [editOvers, setEditOvers] = useState(team?.overs || '');

  if (!team) {
    return (
      <View style={styles.container}>
        <Text>Team not found.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Name Required', 'Team name cannot be empty.');
      return;
    }

    setIsSaving(true);
    
    // TODO: Replace with actual API call
    // await api.updateTeam(team.id, updatedData)
    await new Promise(resolve => setTimeout(resolve, 800));

    const updated: Team = { 
      ...team, 
      name: editName.trim(), 
      city: editCity.trim(), 
      homeGround: editGround.trim(), 
      overs: editOvers 
    };
    updateTeam(updated);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTeam = async () => {
    setIsDeleting(true);
    
    // TODO: Replace with actual API call
    // await api.deleteTeam(team.id)
    await new Promise(resolve => setTimeout(resolve, 800));

    deleteTeam(team.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    navigation.goBack();
  };

  const handleAddPlayer = () => {
    setIsInviteModalVisible(true);
  };

  const handleRemovePlayer = (player: Player) => {
    setPlayerToRemove(player);
  };

  const confirmRemovePlayer = async () => {
    if (playerToRemove) {
      setIsRemoving(true);
      
      // TODO: Replace with actual API call
      // await api.removePlayerFromTeam(team.id, playerToRemove.id)
      await new Promise(resolve => setTimeout(resolve, 800));

      removePlayerFromTeam(team.id, playerToRemove.id);
      setIsRemoving(false);
      setPlayerToRemove(null);
    }
  };

  const rosterPlayers = team.roster.map(id => players[id]).filter(Boolean);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Team Detail</Text>
        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setEditName(team.name);
                setEditCity(team.city);
                setEditGround(team.homeGround);
                setEditOvers(team.overs);
                setIsEditing(true);
              }
            }}
          >
            <Edit3 color={isEditing ? Colors.maroon : Colors.text} size={20} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={handleDelete}
          >
            <Trash2 color="#E53935" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: team.themeColor }]}>
          <View style={styles.teamAvatarLg}>
             <Text style={styles.teamAvatarText}>{team.avatarLetter}</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.heroNameInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Team name"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          ) : (
            <Text style={styles.heroName}>{team.name}</Text>
          )}
          <Text style={styles.heroShort}>{team.shortName}</Text>
          <View style={styles.formatRow}>
            {team.formats.map(f => (
              <View key={f} style={styles.formatChip}>
                <Text style={styles.formatChipText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'PLAYERS', value: team.roster.length.toString(), icon: '👥' },
            { label: 'FORMAT', value: team.formats[0] || 'T20', icon: '🏏' },
            { label: 'OVERS', value: isEditing ? editOvers : team.overs, icon: '📋' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              {stat.label === 'OVERS' && isEditing ? (
                <TextInput
                  style={styles.statValueInput}
                  value={editOvers}
                  onChangeText={setEditOvers}
                  keyboardType="numeric"
                  maxLength={3}
                />
              ) : (
                <Text style={styles.statValue}>{stat.value}</Text>
              )}
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Info section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Team Info</Text>
          {[
            {
              icon: <MapPin color={Colors.textSecondary} size={16} />,
              label: 'Home City',
              value: team.city,
              editValue: editCity,
              onEdit: setEditCity,
              field: 'city',
            },
            {
              icon: <Shield color={Colors.textSecondary} size={16} />,
              label: 'Home Ground',
              value: team.homeGround,
              editValue: editGround,
              onEdit: setEditGround,
              field: 'ground',
            },
            {
              icon: <Calendar color={Colors.textSecondary} size={16} />,
              label: 'Founded',
              value: team.yearFounded,
              editValue: null,
              onEdit: null,
              field: 'year',
            },
          ].map(row => (
            <View key={row.label} style={styles.infoRow}>
              {row.icon}
              <Text style={styles.infoLabel}>{row.label}</Text>
              {isEditing && row.onEdit ? (
                <TextInput
                  style={styles.infoEditInput}
                  value={row.editValue || ''}
                  onChangeText={row.onEdit}
                  placeholder={row.label}
                  placeholderTextColor="#C0C0C0"
                />
              ) : (
                <Text style={styles.infoValue}>{row.value || '—'}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Roster Section */}
        <View style={styles.rosterCard}>
          <View style={styles.rosterHeader}>
            <Text style={styles.rosterTitle}>Players Roster</Text>
            <Pressable
              onPress={handleAddPlayer}
              accessibilityRole="button" accessibilityLabel="Add player"
            >
              <Text style={styles.addPlayer}>+ Add Player</Text>
            </Pressable>
          </View>
          {rosterPlayers.length === 0 ? (
            <View style={styles.rosterEmpty}>
              <Text style={styles.rosterEmptyText}>No players yet. Tap "+ Add Player" to get started.</Text>
            </View>
          ) : (
            rosterPlayers.map((p, index) => (
              <View key={p.id} style={[styles.rosterRow, index === rosterPlayers.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.rosterAvatar, { backgroundColor: p.roleColor + '22' }]}>
                  <Text style={[styles.rosterAvatarText, { color: p.roleColor }]}>{p.name.charAt(0)}</Text>
                </View>
                <Text style={styles.rosterName} numberOfLines={1}>{p.name}</Text>
                <View style={[styles.roleBadge, { backgroundColor: p.roleColor + '22' }]}>
                  <Text style={[styles.roleBadgeText, { color: p.roleColor }]}>{p.role}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
                  onPress={() => handleRemovePlayer(p)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.name}`}
                >
                  <Trash2 color="#E53935" size={16} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Save button when editing */}
        {isEditing && (
          <Pressable
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: team.themeColor }, (pressed || isSaving) && { opacity: 0.85 }]}
            onPress={isSaving ? undefined : handleSave}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes ✓</Text>
            )}
          </Pressable>
        )}
      </ScrollView>

      <InviteModal
        isVisible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        teamId={team.id}
        teamName={team.name}
      />

      {/* Remove Player Modal */}
      <Modal visible={!!playerToRemove} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.removeModalContent}>
            <View style={styles.removeIconBox}>
              <AlertCircle color="#E53935" size={32} />
            </View>
            <Text style={styles.removeTitle}>Remove Player</Text>
            <Text style={styles.removeDesc}>
              Are you sure you want to remove <Text style={{ fontWeight: '800', color: Colors.text }}>{playerToRemove?.name}</Text> from {team.name}? They will lose access to team updates.
            </Text>
            
            <View style={styles.removeActions}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]}
                onPress={() => !isRemoving && setPlayerToRemove(null)}
                disabled={isRemoving}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [styles.confirmRemoveBtn, (pressed || isRemoving) && { opacity: 0.8 }]}
                onPress={confirmRemovePlayer}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.confirmRemoveBtnText}>Yes, Remove</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Team Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.removeModalContent}>
            <View style={styles.removeIconBox}>
              <Trash2 color="#E53935" size={32} />
            </View>
            <Text style={styles.removeTitle}>Delete Team</Text>
            <Text style={styles.removeDesc}>
              Are you sure you want to delete <Text style={{ fontWeight: '800', color: Colors.text }}>{team.name}</Text>? This action cannot be undone and will remove all players from the roster.
            </Text>
            
            <View style={styles.removeActions}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]}
                onPress={() => !isDeleting && setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [styles.confirmRemoveBtn, (pressed || isDeleting) && { opacity: 0.8 }]}
                onPress={confirmDeleteTeam}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.confirmRemoveBtnText}>Yes, Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EE' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.text, marginLeft: 4 },
  headerRight: { flexDirection: 'row' },
  body: { padding: 16, gap: 14, paddingBottom: 40 },
  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 8 },
  teamAvatarLg: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  teamAvatarText: { fontSize: 26, fontWeight: '900', color: Colors.white },
  heroName: { fontSize: 22, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  heroNameInput: { fontSize: 22, fontWeight: '900', color: Colors.white, textAlign: 'center', borderBottomWidth: 1.5, borderBottomColor: 'rgba(255,255,255,0.5)', paddingBottom: 4, minWidth: 200 },
  heroShort: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  formatRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  formatChip: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  formatChipText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 1 } }) },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.text },
  statValueInput: { fontSize: 20, fontWeight: '900', color: Colors.maroon, textAlign: 'center', borderBottomWidth: 1.5, borderBottomColor: Colors.maroon, paddingBottom: 2, minWidth: 50 },
  statLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  infoCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, gap: 12 },
  infoCardTitle: { fontSize: 15, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, width: 100 },
  infoValue: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  infoEditInput: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.maroon, borderBottomWidth: 1.5, borderBottomColor: Colors.maroon, paddingBottom: 2 },
  rosterCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  rosterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  rosterTitle: { fontSize: 15, fontWeight: '900', color: Colors.text },
  addPlayer: { fontSize: 13, fontWeight: '800', color: Colors.maroon },
  rosterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  rosterAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  rosterAvatarText: { fontSize: 14, fontWeight: '800' },
  rosterName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '800' },
  removeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
  rosterEmpty: { paddingVertical: 24, alignItems: 'center' },
  rosterEmptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 },
  saveBtn: { borderRadius: 14, paddingVertical: 18, alignItems: 'center', minHeight: 56 },
  saveBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  removeModalContent: { backgroundColor: Colors.white, borderRadius: 28, padding: 24, width: '100%', maxWidth: 360, alignItems: 'center' },
  removeIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  removeTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  removeDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  removeActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  confirmRemoveBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#E53935', alignItems: 'center' },
  confirmRemoveBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },
});

export default TeamDetailScreen;
