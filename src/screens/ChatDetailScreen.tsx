import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MoreVertical, 
  Send,
  CheckCheck,
  Edit2,
  Trash2,
  X,
  User,
  BellOff,
  Eraser,
  Share2,
  UserPlus,
  Trophy
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore } from '../store/useTeamStore';

const { width } = Dimensions.get('window');

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    text: 'Hey, are you coming to the cricket match today? CRICPRO starts at 7 PM! 🏏',
    time: '10:30 AM',
    sender: 'other',
    type: 'text',
  },
  {
    id: 'm2',
    text: 'Yes! I\'ll be there in 15 minutes. Save me a seat near the boundary. I\'m already in my team gear.',
    time: '10:32 AM',
    sender: 'me',
    type: 'text',
    status: 'read',
  },
  {
    id: 'm3',
    text: 'Perfect. I\'m wearing the maroon CRICPRO jersey so you can find me easily. Seats are right here!',
    time: '10:35 AM',
    sender: 'other',
    type: 'image_text',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=1000&auto=format&fit=crop',
  },
];

const ChatDetailScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { invites, acceptInvite, teams } = useTeamStore();
  
  const contactName = route?.params?.name || 'John Doe';
  const contactId = route?.params?.id || 'r1'; // Default for demo

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Synchronize store invites with messages
    const relevantInvites = invites.filter(inv => 
      (inv.receiverId === contactId) || (inv.senderId === contactId)
    );

    const inviteMessages = relevantInvites.map(inv => ({
      id: inv.id,
      inviteId: inv.id,
      teamId: inv.teamId,
      status: inv.status,
      type: 'invite',
      text: '', // Required by the state type inference
      sender: inv.senderId === 'me' ? 'me' : 'other',
      time: new Date(inv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setMessages(prev => {
      // Avoid duplicate messages by checking invite IDs
      const nonInviteMessages = prev.filter(m => !m.id?.toString().startsWith('inv_'));
      return [...nonInviteMessages, ...inviteMessages];
    });
  }, [invites, contactId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    if (editingId) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingId ? { ...msg, text: inputText.trim(), time: msg.time + ' (edited)' } : msg
      ));
      setEditingId(null);
    } else {
      const newMessage = {
        id: `m${Date.now()}`,
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
        type: 'text',
        status: 'sent',
      };
      setMessages([...messages, newMessage]);
    }
    setInputText('');
  };

  const handleLongPress = (msg: any) => {
    if (msg.sender === 'me') {
      setSelectedMessage(msg);
      setShowOptions(true);
    }
  };

  const startEdit = () => {
    setEditingId(selectedMessage.id);
    setInputText(selectedMessage.text);
    setShowOptions(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
            setShowOptions(false);
          }
        },
      ]
    );
  };

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    let text = '';
    if (action === 'score') text = "Check out the live score: Ind 245/4 (42.1 ov) 🏏";
    if (action === 'invite') text = "Hey, join my cricket team on CRICPRO! Let's play together. 🤝";
    
    if (text) {
      const newMessage = {
        id: `m${Date.now()}`,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
        type: 'text',
        status: 'sent',
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === 'clear') {
      Alert.alert('Clear Chat', 'Delete all messages in this conversation?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) }
      ]);
    } else if (action === 'profile') {
      navigation.navigate('Main', { 
        screen: 'Profile', 
        params: { 
          screen: 'PlayerProfile', 
          params: { name: contactName } 
        } 
      });
    } else if (action === 'mute') {
      Alert.alert('Notifications Muted', `You will no longer receive alerts from ${contactName}.`);
    }
  };

  const renderMessage = (msg: any) => {
    const isMe = msg.sender === 'me';
    const isInvite = msg.type === 'invite';

    if (isInvite) {
      const inviteTeam = teams.find(t => t.id === msg.teamId);
      const isAccepted = msg.status === 'accepted';

      return (
        <View key={msg.id} style={styles.inviteCardWrapper}>
          <View style={styles.inviteCard}>
            <View style={styles.inviteIconCircle}>
              <UserPlus color={Colors.maroon} size={24} />
            </View>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteTitle}>Team Invitation</Text>
              <Text style={styles.inviteText}>
                You've been invited to join <Text style={styles.boldText}>{inviteTeam?.name || 'a team'}</Text>
              </Text>
              
              {isAccepted ? (
                <View style={styles.acceptedBadge}>
                  <CheckCheck color="#2E7D32" size={16} />
                  <Text style={styles.acceptedText}>Joined</Text>
                </View>
              ) : (
                <View style={styles.inviteActions}>
                  <Pressable 
                    style={[styles.acceptBtn, { backgroundColor: inviteTeam?.themeColor || Colors.maroon }]}
                    onPress={() => {
                      acceptInvite(msg.inviteId);
                      Alert.alert('Welcome!', `You have joined ${inviteTeam?.name}.`);
                    }}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </Pressable>
                  <Pressable style={styles.declineBtn} onPress={() => Alert.alert('Declined', 'Invitation declined.')}>
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }

    return (
      <Pressable 
        key={msg.id} 
        onLongPress={() => handleLongPress(msg)}
        style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}
      >
        {!isMe && (
          <View style={styles.msgAvatar}>
             <Text style={styles.msgAvatarText}>{contactName.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.messageContent}>
          <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
            {msg.type === 'image_text' && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: msg.imageUrl }} style={styles.msgImage} />
              </View>
            )}
            <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
              {msg.text}
            </Text>
          </View>
          <View style={[styles.msgMeta, isMe ? styles.msgMetaMe : styles.msgMetaOther]}>
            <Text style={styles.msgTime}>{msg.time}</Text>
            {isMe && <CheckCheck size={14} color={msg.status === 'read' ? '#4FC3F7' : '#9E9E9E'} style={styles.readReceipt} />}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <ArrowLeft color={Colors.maroon} size={24} />
          </Pressable>
          
          <View style={styles.userInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{contactName.charAt(0)}</Text>
              <View style={styles.onlineStatus} />
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{contactName}</Text>
              <Text style={styles.onlineLabel}>Online</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.headerActionBtn} onPress={() => setShowMenu(true)}>
              <MoreVertical color="#001F3F" size={22} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>TODAY</Text>
        </View>

        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.inputInner}>
          {editingId ? (
            <Pressable style={styles.inputIconBtn} onPress={() => { setEditingId(null); setInputText(''); }}>
              <X color={Colors.maroon} size={22} />
            </Pressable>
          ) : (
            <Pressable style={styles.inputIconBtn} onPress={() => setShowQuickActions(true)}>
              <View style={styles.plusCircle}>
                 <Text style={styles.plusText}>+</Text>
              </View>
            </Pressable>
          )}
          <TextInput
            style={styles.textInput}
            placeholder={editingId ? "Edit message..." : "Type a message..."}
            placeholderTextColor="#9E9E9E"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>
        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Send color="#FFFFFF" size={22} />
        </Pressable>
      </View>

      {/* Message Options Modal */}
      <Modal visible={showOptions} transparent animationType="fade" onRequestClose={() => setShowOptions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowOptions(false)}>
          <View style={styles.optionsContainer}>
            <Pressable style={styles.optionItem} onPress={startEdit}>
              <Edit2 color="#001F3F" size={20} />
              <Text style={styles.optionText}>Edit Message</Text>
            </Pressable>
            <View style={styles.optionSeparator} />
            <Pressable style={styles.optionItem} onPress={confirmDelete}>
              <Trash2 color="#F44336" size={20} />
              <Text style={[styles.optionText, { color: '#F44336' }]}>Delete Message</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Header Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.optionsContainer}>
            <Pressable style={styles.optionItem} onPress={() => handleMenuAction('profile')}>
              <User color="#001F3F" size={20} />
              <Text style={styles.optionText}>View Cricket Profile</Text>
            </Pressable>
            <View style={styles.optionSeparator} />
            <Pressable style={styles.optionItem} onPress={() => handleMenuAction('mute')}>
              <BellOff color="#001F3F" size={20} />
              <Text style={styles.optionText}>Mute Notifications</Text>
            </Pressable>
            <View style={styles.optionSeparator} />
            <Pressable style={styles.optionItem} onPress={() => handleMenuAction('clear')}>
              <Eraser color="#F44336" size={20} />
              <Text style={[styles.optionText, { color: '#F44336' }]}>Clear Chat</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Quick Actions Modal (+) */}
      <Modal visible={showQuickActions} transparent animationType="slide" onRequestClose={() => setShowQuickActions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowQuickActions(false)}>
          <View style={[styles.optionsContainer, styles.quickActionsContainer]}>
            <Text style={styles.quickActionTitle}>Cricket Quick Actions</Text>
            <View style={styles.quickActionGrid}>
              <Pressable style={styles.quickActionItem} onPress={() => handleQuickAction('score')}>
                <View style={[styles.actionIconBg, { backgroundColor: '#E8F5E9' }]}><Share2 color="#2E7D32" size={24} /></View>
                <Text style={styles.actionLabel}>Live Score</Text>
              </Pressable>
              <Pressable style={styles.quickActionItem} onPress={() => handleQuickAction('invite')}>
                <View style={[styles.actionIconBg, { backgroundColor: '#E3F2FD' }]}><UserPlus color="#1565C0" size={24} /></View>
                <Text style={styles.actionLabel}>Invite Team</Text>
              </Pressable>
              <Pressable style={styles.quickActionItem}>
                <View style={[styles.actionIconBg, { backgroundColor: '#FFF3E0' }]}><Trophy color="#EF6C00" size={24} /></View>
                <Text style={styles.actionLabel}>Matches</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth:1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 12,
  },
  headerBtn: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E65100',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001F3F',
  },
  onlineLabel: {
    fontSize: 12,
    color: Colors.maroon,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionBtn: {
    padding: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dateBadge: {
    alignSelf: 'center',
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 20,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.maroon,
    letterSpacing: 0.5,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CFD8DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  msgAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#546E7A',
  },
  messageContent: {
    marginLeft: 10,
    marginRight: 10,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 1 },
    }),
  },
  bubbleMe: {
    backgroundColor: Colors.maroon,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextOther: {
    color: '#212121',
    fontWeight: '500',
  },
  messageTextMe: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  msgImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  msgMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  msgMetaOther: {
    alignSelf: 'flex-start',
  },
  msgMetaMe: {
    alignSelf: 'flex-end',
  },
  msgTime: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  readReceipt: {
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  inputInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
    paddingHorizontal: 8,
    minHeight: 48,
  },
  inputIconBtn: {
    padding: 8,
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.8,
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001F3F',
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  quickActionsContainer: {
    padding: 24,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#001F3F',
    marginBottom: 20,
    textAlign: 'center',
  },
  quickActionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
  },
  // Invite Card Styles
  inviteCardWrapper: {
    paddingHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
  },
  inviteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inviteIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteInfo: {
    flex: 1,
    gap: 4,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
  },
  inviteText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '800',
    color: Colors.maroon,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  declineBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#718096',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  acceptedText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
});

export default ChatDetailScreen;
