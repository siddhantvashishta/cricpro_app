import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Search, Share2, AlertTriangle, Copy, Link as LinkIcon, Check } from 'lucide-react-native';
import { useTeamStore, Player } from '../store/useTeamStore';
import * as Clipboard from 'expo-clipboard';

const { height } = Dimensions.get('window');

interface TransferOwnershipModalProps {
  isVisible: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  onConfirmTransfer: (newOwner: Player) => void;
}

const TransferOwnershipModal = ({ isVisible, onClose, teamId, teamName, onConfirmTransfer }: TransferOwnershipModalProps) => {
  const { friends, players } = useTeamStore();
  const [query, setQuery] = useState('');
  
  // Selection and Confirmation State
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  
  // UI States
  const [linkCopied, setLinkCopied] = useState(false);

  const transferLink = `cricpro.app/transfer/${teamId}?token=temp_admin`;

  const filteredUsers = useMemo(() => {
    const friendList = friends.map(id => players[id]).filter(Boolean);
    if (!query.trim()) return friendList; // Default to friends list
    
    // In a real app, global search happens on the backend.
    // Here we search our global `players` dict.
    const searchLower = query.toLowerCase();
    const allPlayers = Object.values(players);
    const matches = allPlayers.filter(
      u => u.name.toLowerCase().includes(searchLower) || (u.username && u.username.toLowerCase().includes(searchLower))
    );
    
    return matches;
  }, [query, friends, players]);

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `I'm transferring ownership of ${teamName} to you on CricPro. Click the link to accept Admin rights! ${transferLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(transferLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    setIsTransferring(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTransferring(false);
    onConfirmTransfer(selectedUser);
  };

  const resetStateAndClose = () => {
    setQuery('');
    setSelectedUser(null);
    setIsTransferring(false);
    onClose();
  };

  // ----------------------------------------
  // CONFIRMATION VIEW
  // ----------------------------------------
  if (selectedUser) {
    return (
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContent}>
            <View style={styles.dangerIconBox}>
              <AlertTriangle color="#E53935" size={32} />
            </View>
            <Text style={styles.confirmTitle}>Transfer Ownership</Text>
            <Text style={styles.confirmDesc}>
              Are you sure you want to surrender your Admin rights for <Text style={{ fontWeight: '800', color: Colors.text }}>{teamName}</Text> to <Text style={{ fontWeight: '800', color: Colors.text }}>{selectedUser.name}</Text>? 
              {'\n\n'}You will become a regular player and this action cannot be undone.
            </Text>
            
            <View style={styles.confirmActions}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]}
                onPress={() => !isTransferring && setSelectedUser(null)}
                disabled={isTransferring}
              >
                <Text style={styles.cancelBtnText}>Back</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [styles.dangerConfirmBtn, (pressed || isTransferring) && { opacity: 0.8 }]}
                onPress={handleConfirm}
                disabled={isTransferring}
              >
                {isTransferring ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.dangerConfirmBtnText}>Yes, Transfer</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // ----------------------------------------
  // MAIN SELECTION VIEW
  // ----------------------------------------
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={resetStateAndClose}>
      <Pressable style={styles.overlay} onPress={resetStateAndClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.handleBar} />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transfer Ownership</Text>
            <Pressable onPress={resetStateAndClose} style={styles.closeBtn}>
              <X color={Colors.textSecondary} size={20} />
            </Pressable>
          </View>

          {/* Share Link Card */}
          <View style={styles.clipboardCard}>
            <View style={styles.linkHeaderBox}>
              <Text style={styles.clipboardTitle}>Generate Admin Transfer Link</Text>
              <Text style={styles.clipboardSubtitle}>Share this private link to hand over the team securely.</Text>
            </View>
            <View style={styles.clipboardRow}>
              <View style={styles.linkBox}>
                <LinkIcon color="#A0AEC0" size={16} />
                <Text style={styles.linkText} numberOfLines={1}>{transferLink}</Text>
              </View>
              <View style={styles.clipboardActions}>
                <Pressable style={({ pressed }) => [styles.actionCircle, pressed && { backgroundColor: '#E2E8F0' }]} onPress={handleCopyLink}>
                  {linkCopied ? <Check color={Colors.maroon} size={16} /> : <Copy color={Colors.text} size={16} />}
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionCircle, { backgroundColor: '#FFF0F0' }, pressed && { opacity: 0.8 }]} onPress={handleShareLink}>
                  <Share2 color={Colors.maroon} size={15} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.sectionHeader}>{query.trim() ? 'GLOBAL SEARCH' : 'SELECT FROM FRIENDS / ROSTER'}</Text>
            <View style={styles.searchBar}>
              <Search color="#B0B0B0" size={18} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search players to transfer to..."
                placeholderTextColor="#A0AEC0"
                value={query}
                onChangeText={setQuery}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <X color="#B0B0B0" size={16} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Player List */}
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.userRow}>
                {item.avatar ? (
                  <View style={[styles.avatar, { backgroundColor: '#E2E8F0' }]} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                )}
                
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userHandle}>@{item.username || item.id}</Text>
                </View>

                <Pressable 
                  style={({ pressed }) => [styles.selectBtn, pressed && { opacity: 0.8 }]}
                  onPress={() => setSelectedUser(item)}
                >
                  <Text style={styles.selectBtnText}>Select</Text>
                </Pressable>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No players found matching "{query}"</Text>
              </View>
            }
          />

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.88,
    paddingTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 20 },
    }),
  },
  handleBar: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 20, top: -4 },
  
  clipboardCard: { backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 8, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  linkHeaderBox: { marginBottom: 12 },
  clipboardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  clipboardSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  clipboardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  linkBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7', gap: 8 },
  linkText: { flex: 1, fontSize: 13, color: '#4A5568', fontWeight: '500' },
  clipboardActions: { flexDirection: 'row', gap: 8 },
  actionCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  searchContainer: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 10 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.peach, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: Colors.maroon },
  userInfo: { flex: 1, marginLeft: 12, gap: 2 },
  userName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  userHandle: { fontSize: 13, color: Colors.textSecondary },
  selectBtn: { backgroundColor: '#FFF0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  selectBtnText: { fontSize: 13, fontWeight: '800', color: Colors.maroon },
  divider: { height: 8 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },

  // Confirm Modal Styles
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  confirmContent: { backgroundColor: Colors.white, borderRadius: 28, padding: 24, width: '100%', maxWidth: 360, alignItems: 'center' },
  dangerIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  confirmDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  dangerConfirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#E53935', alignItems: 'center' },
  dangerConfirmBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },
});

export default TransferOwnershipModal;
