import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Bell, Heart, UserPlus, Trophy, Info } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useSocialStore, SocialNotification } from '../store/useSocialStore';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -80;

// Type is already in SocialStore, using that.

const NotificationIcon = ({ type }: { type: string }) => {
  const iconSize = 20;
  switch (type) {
    case 'like': return <View style={[styles.iconBg, { backgroundColor: '#FFEBEE' }]}><Heart color="#C62828" size={iconSize} fill="#C62828" /></View>;
    case 'comment': return <View style={[styles.iconBg, { backgroundColor: '#E3F2FD' }]}><Bell color="#1565C0" size={iconSize} /></View>;
    case 'mention': return <View style={[styles.iconBg, { backgroundColor: '#F3E5F5' }]}><Heart color="#7B1FA2" size={iconSize} /></View>;
    case 'system': return <View style={[styles.iconBg, { backgroundColor: '#FFF9C4' }]}><Info color="#FBC02D" size={iconSize} /></View>;
    default: return <View style={[styles.iconBg, { backgroundColor: '#F5F5F5' }]}><Info color="#616161" size={iconSize} /></View>;
  }
};

const SwipeableItem = ({ item, onRemove }: { item: SocialNotification; onRemove: (id: string) => void }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDeleting, setIsDeleting] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          pan.x.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.timing(pan.x, {
            toValue: -width,
            duration: 250,
            useNativeDriver: false,
          }).start(() => onRemove(item.id));
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.deleteAction}>
        <Trash2 color="#FFFFFF" size={24} />
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.notificationItem, { transform: [{ translateX: pan.x }] }, !item.isRead ? styles.unreadItem : null]}
      >
        <NotificationIcon type={item.type} />
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.message ? <Text style={styles.itemMessage} numberOfLines={2}>{item.message}</Text> : null}
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </Animated.View>
    </View>
  );
};

const NotificationScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead } = useSocialStore();

  const sections = [
    { title: 'NEW', data: notifications.filter(n => !n.isRead) },
    { title: 'EARLIER', data: notifications.filter(n => n.isRead) },
  ].filter(s => s.data.length > 0);

  const handleRemove = (id: string) => {
    // Implement delete in store if needed
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) markNotificationRead(n.id);
    });
  };

  const handleClearAll = () => {
    Alert.alert('Clear all notifications?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => { /* Add clear action to store */ } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color={Colors.text} size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Pressable onPress={handleMarkAllRead}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SwipeableItem item={item} onRemove={handleRemove} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell color="#E0E0E0" size={64} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#001F3F',
    marginLeft: 8,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B0000', // Maroon
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#546E7A',
    letterSpacing: 1,
  },
  itemWrapper: {
    position: 'relative',
    backgroundColor: '#E53935', // Delete color background
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unreadItem: {
    backgroundColor: '#FFF8F8', // Very light maroon tint
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#001F3F',
    marginBottom: 2,
  },
  itemMessage: {
    fontSize: 13,
    color: '#546E7A',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#263238',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#90A4AE',
    marginTop: 8,
  },
});

export default NotificationScreen;
