import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  Linking,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  X,
  MessageSquare,
  Share2,
  UserPlus,
  Send,
  ChevronRight,
  User,
  ArrowLeft,
  Copy,
  CheckCircle2,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Player, PlayerRole } from '../store/useTeamStore';
import { useAuthStore } from '../store/useAuthStore';

const { width, height } = Dimensions.get('window');

const ROLES: { key: PlayerRole; label: string; color: string; bg: string }[] = [
  { key: 'BAT', label: 'Batsman',    color: '#1565C0', bg: '#E3F2FD' },
  { key: 'BWL', label: 'Bowler',     color: '#2E7D32', bg: '#E8F5E9' },
  { key: 'AR',  label: 'All-Rounder',color: '#6A1B9A', bg: '#F3E5F5' },
  { key: 'WK',  label: 'Wicket-Keeper', color: '#E65100', bg: '#FFF3E0' },
];

interface InviteModalProps {
  isVisible: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

type ActiveView = 'main' | 'quickAdd' | 'inAppLink';

const InviteModal = ({ isVisible, onClose, teamId, teamName }: InviteModalProps) => {
  const { teams, players, friends, sendInvite, addPlayerToTeam } = useTeamStore();
  const { userProfile } = useAuthStore();

  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [playerName, setPlayerName] = useState('');
  const [selectedRole, setSelectedRole] = useState<PlayerRole>('BAT');
  const [linkCopied, setLinkCopied] = useState(false);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  const friendList = friends.map(id => players[id]).filter(Boolean);
  const inviteLink = `https://cricpro.app/join/${teamId}`;

  // ─── WhatsApp Share ────────────────────────────────────────────────
  const handleWhatsAppInvite = async () => {
    const message =
      `🏏 Join my cricket team *"${teamName}"* on CricPro!\n\n` +
      `Tap below to accept the invite and get started:\n${inviteLink}\n\n` +
      `Download CricPro: https://cricpro.app`;

    try {
      // Try native share first (works on all platforms)
      await Share.share({ message, title: `Join ${teamName} on CricPro` });
    } catch {
      // Fallback: try WhatsApp deep link
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Share', message);
      }
    }
  };

  // ─── Copy Link ─────────────────────────────────────────────────────
  const handleCopyLink = () => {
    Clipboard.setStringAsync(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // ─── Quick Add ─────────────────────────────────────────────────────
  const handleQuickAdd = () => {
    if (!playerName.trim()) {
      Alert.alert('Name Required', 'Please enter the player\'s name.');
      return;
    }

    const team = teams.find(t => t.id === teamId);
    if (team && team.roster.length >= 15) {
      Alert.alert('Squad Full', 'You can only have up to 15 players in your squad. Remove someone to add a new player.');
      return;
    }

    const roleObj = ROLES.find(r => r.key === selectedRole)!;
    const newPlayer: Player = {
      id: `p_${Date.now()}`,
      name: playerName.trim(),
      role: selectedRole,
      roleColor: roleObj.color,
      stats: {
        MAT: 0, INN: 0, RUNS: 0, HS: '0', AVG: 0, SR: 0,
        '100S': 0, '50S': 0, '4S': 0, '6S': 0, WKTS: 0, BBI: '-', ECON: 0,
      },
    };

    addPlayerToTeam(teamId, newPlayer);
    Alert.alert('Player Added ✅', `${playerName} has been added to ${teamName}`);
    setPlayerName('');
    setSelectedRole('BAT');
    setActiveView('main');
    onClose();
  };

  // ─── In-App Invite ─────────────────────────────────────────────────
  const handleInAppInvite = (friend: Player) => {
    const team = teams.find(t => t.id === teamId);
    if (team && team.roster.length >= 15) {
      Alert.alert('Squad Full', 'You can only have up to 15 players in your squad. Remove someone to invite new players.');
      return;
    }

    sendInvite({
      teamId,
      senderId: userProfile?.username || 'me',
      receiverId: friend.id,
      type: 'in-app',
    });
    setInvitedIds(prev => new Set([...prev, friend.id]));
    Alert.alert('Invite Sent ✅', `${friend.name} received your invite in their messages.`);
  };

  const handleClose = () => {
    setActiveView('main');
    setPlayerName('');
    setSelectedRole('BAT');
    onClose();
  };

  // ─── RENDER ────────────────────────────────────────────────────────
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            {activeView !== 'main' ? (
              <Pressable onPress={() => setActiveView('main')} style={styles.backBtn}>
                <ArrowLeft color={Colors.text} size={20} />
              </Pressable>
            ) : (
              <View style={styles.backBtn} />
            )}
            <Text style={styles.title}>
              {activeView === 'main' ? 'Invite Players' :
               activeView === 'quickAdd' ? 'Add Player Manually' :
               'Team Invite Link'}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <X color={Colors.textSecondary} size={20} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

            {/* ── MAIN VIEW ─────────────────────────────────────────── */}
            {activeView === 'main' && (
              <>
                {/* Team info */}
                <View style={styles.teamBanner}>
                  <Text style={styles.teamBannerName}>{teamName}</Text>
                  <Text style={styles.teamBannerSub}>Invite others to join your squad</Text>
                </View>

                <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
                <View style={styles.quickActions}>
                  {/* WhatsApp */}
                  <Pressable
                    style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
                    onPress={handleWhatsAppInvite}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                      <Share2 color="#2E7D32" size={26} />
                    </View>
                    <Text style={styles.actionLabel}>WhatsApp</Text>
                    <Text style={styles.actionSub}>Share invite</Text>
                  </Pressable>

                  {/* Quick Add */}
                  <Pressable
                    style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
                    onPress={() => setActiveView('quickAdd')}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                      <UserPlus color="#1565C0" size={26} />
                    </View>
                    <Text style={styles.actionLabel}>Quick Add</Text>
                    <Text style={styles.actionSub}>Add manually</Text>
                  </Pressable>

                  {/* In-App Link */}
                  <Pressable
                    style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
                    onPress={() => setActiveView('inAppLink')}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                      <MessageSquare color="#E65100" size={26} />
                    </View>
                    <Text style={styles.actionLabel}>In-App</Text>
                    <Text style={styles.actionSub}>Invite friends</Text>
                  </Pressable>
                </View>

                {/* Invite Link Box */}
                <View style={styles.linkBox}>
                  <View style={styles.linkTextWrap}>
                    <Text style={styles.linkLabel}>Team Invite Link</Text>
                    <Text style={styles.linkUrl} numberOfLines={1}>{inviteLink}</Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [styles.copyBtn, linkCopied && styles.copyBtnDone, pressed && { opacity: 0.8 }]}
                    onPress={handleCopyLink}
                  >
                    {linkCopied
                      ? <CheckCircle2 color="#2E7D32" size={20} />
                      : <Copy color={Colors.maroon} size={20} />
                    }
                  </Pressable>
                </View>

                {/* Friends list */}
                <View style={styles.divider} />
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>YOUR FRIENDS</Text>
                  <Text style={styles.friendCount}>{friendList.length} total</Text>
                </View>
                {friendList.length > 0 ? (
                  friendList.map(friend => (
                    <View key={friend.id} style={styles.friendItem}>
                      <View style={styles.friendAvatar}>
                        <Text style={styles.friendAvatarText}>{friend.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendRole}>{friend.role} · {friend.city || 'Cricket Player'}</Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.inviteBtn,
                          invitedIds.has(friend.id) && styles.inviteBtnDone,
                          pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => handleInAppInvite(friend)}
                        disabled={invitedIds.has(friend.id)}
                      >
                        {invitedIds.has(friend.id) ? (
                          <Text style={styles.inviteBtnText}>Sent ✓</Text>
                        ) : (
                          <>
                            <Send color={Colors.white} size={13} />
                            <Text style={styles.inviteBtnText}>Invite</Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyFriends}>
                    <User color="#CBD5E0" size={36} />
                    <Text style={styles.emptyText}>No friends in your network yet.</Text>
                    <Text style={styles.emptySubText}>Share your invite link to grow your squad!</Text>
                  </View>
                )}
              </>
            )}

            {/* ── QUICK ADD VIEW ─────────────────────────────────────── */}
            {activeView === 'quickAdd' && (
              <>
                <Text style={styles.formHint}>Enter the player's details below to add them directly to your team roster.</Text>

                <Text style={styles.fieldLabel}>Player Name</Text>
                <View style={styles.inputBox}>
                  <User color={Colors.textSecondary} size={18} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Rahul Sharma"
                    placeholderTextColor="#B0B0B0"
                    value={playerName}
                    onChangeText={setPlayerName}
                    autoFocus
                    maxLength={40}
                  />
                </View>

                <Text style={styles.fieldLabel}>Role</Text>
                <View style={styles.roleGrid}>
                  {ROLES.map(role => (
                    <Pressable
                      key={role.key}
                      style={({ pressed }) => [
                        styles.roleChip,
                        { borderColor: role.color + '55', backgroundColor: selectedRole === role.key ? role.bg : '#FAFAFA' },
                        selectedRole === role.key && styles.roleChipActive,
                        pressed && { opacity: 0.85 }
                      ]}
                      onPress={() => setSelectedRole(role.key)}
                    >
                      <Text style={[styles.roleChipKey, { color: role.color }]}>{role.key}</Text>
                      <Text style={[styles.roleChipLabel, selectedRole === role.key && { color: role.color, fontWeight: '700' }]}>
                        {role.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [styles.addBtn, !playerName.trim() && styles.addBtnDisabled, pressed && { opacity: 0.85 }]}
                  onPress={handleQuickAdd}
                >
                  <UserPlus color={Colors.white} size={18} />
                  <Text style={styles.addBtnText}>Add to Roster</Text>
                </Pressable>
              </>
            )}

            {/* ── IN-APP LINK VIEW ───────────────────────────────────── */}
            {activeView === 'inAppLink' && (
              <>
                <Text style={styles.formHint}>Share this link with players inside CricPro. When they tap it, they'll be asked to join your team.</Text>

                <View style={styles.bigLinkBox}>
                  <Text style={styles.bigLinkLabel}>Your Team's Invite Link</Text>
                  <Text style={styles.bigLinkUrl}>{inviteLink}</Text>

                  <Pressable
                    style={({ pressed }) => [styles.bigCopyBtn, linkCopied && styles.bigCopyBtnDone, pressed && { opacity: 0.85 }]}
                    onPress={handleCopyLink}
                  >
                    {linkCopied
                      ? <><CheckCircle2 color={Colors.white} size={18} /><Text style={styles.bigCopyBtnText}>Copied!</Text></>
                      : <><Copy color={Colors.white} size={18} /><Text style={styles.bigCopyBtnText}>Copy Link</Text></>
                    }
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [styles.shareAltBtn, pressed && { opacity: 0.85 }]}
                  onPress={handleWhatsAppInvite}
                >
                  <Share2 color={Colors.maroon} size={18} />
                  <Text style={styles.shareAltText}>Share via other apps</Text>
                  <ChevronRight color={Colors.maroon} size={16} />
                </Pressable>
              </>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.9,
    paddingTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 20 },
    }),
  },
  handleBar: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '900', color: Colors.text },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scrollBody: { paddingHorizontal: 20, paddingTop: 20 },

  // Team banner
  teamBanner: { backgroundColor: Colors.maroon, borderRadius: 16, padding: 18, marginBottom: 24, alignItems: 'center' },
  teamBannerName: { fontSize: 20, fontWeight: '900', color: Colors.white },
  teamBannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  // Section labels
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 14 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 },
  divider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 24 },

  // Quick Action cards
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionCard: { alignItems: 'center', gap: 8, width: (width - 40 - 32) / 3 },
  iconContainer: {
    width: 64, height: 64, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  actionLabel: { fontSize: 13, fontWeight: '800', color: Colors.text },
  actionSub: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },

  // Invite link box
  linkBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 12, marginBottom: 24 },
  linkTextWrap: { flex: 1 },
  linkLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 3 },
  linkUrl: { fontSize: 13, fontWeight: '600', color: Colors.maroon },
  copyBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.peach, justifyContent: 'center', alignItems: 'center' },
  copyBtnDone: { backgroundColor: '#E8F5E9' },
  friendCount: { fontSize: 12, fontWeight: '600', color: '#A0AEC0' },

  // Friend list
  friendItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#EDF2F7', marginBottom: 10 },
  friendAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.peach, justifyContent: 'center', alignItems: 'center' },
  friendAvatarText: { fontSize: 18, fontWeight: '900', color: Colors.maroon },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  friendRole: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  inviteBtn: { backgroundColor: Colors.maroon, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  inviteBtnDone: { backgroundColor: '#2E7D32' },
  inviteBtnText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  emptyFriends: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#A0AEC0', textAlign: 'center' },
  emptySubText: { fontSize: 12, color: '#CBD5E0', textAlign: 'center' },

  // Quick Add Form
  formHint: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 24, fontWeight: '500' },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: Colors.text, marginBottom: 8, letterSpacing: 0.3 },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, height: 54, borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 20 },
  input: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  roleChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 2, width: (width - 40 - 10) / 2 },
  roleChipActive: { borderWidth: 2 },
  roleChipKey: { fontSize: 13, fontWeight: '900' },
  roleChipLabel: { fontSize: 13, color: Colors.textSecondary },
  addBtn: { backgroundColor: Colors.maroon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  addBtnDisabled: { backgroundColor: '#D1D5DB' },
  addBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },

  // In-App Link view
  bigLinkBox: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 16 },
  bigLinkLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8 },
  bigLinkUrl: { fontSize: 14, fontWeight: '700', color: Colors.maroon, marginBottom: 20, lineHeight: 22 },
  bigCopyBtn: { backgroundColor: Colors.maroon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  bigCopyBtnDone: { backgroundColor: '#2E7D32' },
  bigCopyBtnText: { fontSize: 15, fontWeight: '900', color: Colors.white },
  shareAltBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.peach, borderRadius: 16, padding: 16 },
  shareAltText: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.maroon },
});

export default InviteModal;
