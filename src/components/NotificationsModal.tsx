import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { X, CheckCircle2, UserPlus, ShieldAlert } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'join_accept' | 'join_request' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'join_accept',
    title: 'Invite Accepted',
    message: 'Rahul Sharma accepted your invite to join Mumbai Indians.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'join_request',
    title: 'New Join Request',
    message: 'Virat Kohli wants to join Delhi Capitals.',
    time: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Roster Update',
    message: 'Your team Chennai Super Kings is now full (15/15 players).',
    time: '1 day ago',
    isRead: true,
  }
];

interface NotificationsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationsModal = ({ isVisible, onClose }: NotificationsModalProps) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.handleBar} />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2 New</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X color={Colors.textSecondary} size={20} />
            </Pressable>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {MOCK_NOTIFICATIONS.map((notif, index) => (
              <View key={notif.id}>
                <View style={[styles.notificationCard, !notif.isRead && styles.unreadCard]}>
                  {/* Icon Box */}
                  <View style={[
                    styles.iconBox, 
                    notif.type === 'join_accept' ? { backgroundColor: '#E8F5E9' } :
                    notif.type === 'join_request' ? { backgroundColor: '#E3F2FD' } :
                    { backgroundColor: '#FFF3E0' }
                  ]}>
                    {notif.type === 'join_accept' ? <CheckCircle2 color="#2E7D32" size={20} /> :
                     notif.type === 'join_request' ? <UserPlus color="#1565C0" size={20} /> :
                     <ShieldAlert color="#E65100" size={20} />}
                  </View>

                  {/* Content */}
                  <View style={styles.content}>
                    <Text style={styles.title}>{notif.title}</Text>
                    <Text style={styles.message}>{notif.message}</Text>
                    <Text style={styles.time}>{notif.time}</Text>
                  </View>

                  {/* Unread Dot */}
                  {!notif.isRead && <View style={styles.unreadDot} />}
                </View>
                {index < MOCK_NOTIFICATIONS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    paddingTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 20 },
    }),
  },
  handleBar: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.text },
  badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 10 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#DC2626' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginLeft: 'auto' },
  
  list: { paddingHorizontal: 20, paddingTop: 16 },
  notificationCard: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 16, gap: 14 },
  unreadCard: { backgroundColor: '#FAFAFA', borderRadius: 16, paddingHorizontal: 12, marginHorizontal: -12 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text },
  message: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  time: { fontSize: 11, color: '#A0AEC0', fontWeight: '500', marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.maroon, marginTop: 18 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 58 },
});

export default NotificationsModal;
