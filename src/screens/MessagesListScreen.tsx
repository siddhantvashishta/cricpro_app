import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Edit3, Search, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const PINNED_TEAMS = [
  { id: 't1', name: 'India', color: '#1B5E20', online: true },
  { id: 't2', name: 'Australia', color: '#002B5B', online: false },
  { id: 't3', name: 'England', color: '#1B4D89', online: false },
  { id: 't4', name: 'S. Africa', color: '#006A4E', online: false },
  { id: 't5', name: 'N. Zealand', color: '#000000', online: false },
];

const RECENT_CHATS = [
  {
    id: 'c1',
    name: 'Virat Kohli Fan Club',
    lastMessage: 'Did you see that cover drive in the las...',
    time: '10:45 AM',
    unread: 3,
    isGroup: true,
  },
  {
    id: 'c2',
    name: 'Rahul Dravid',
    lastMessage: 'The practice session has been moved ...',
    time: 'Yesterday',
    unread: 1,
    isGroup: false,
  },
  {
    id: 'c3',
    name: 'Coach Sharma',
    lastMessage: 'Review the analysis for the upcomin...',
    time: '2:30 PM',
    unread: 12,
    isGroup: false,
  },
  {
    id: 'c4',
    name: 'Anjali (Journalist)',
    lastMessage: 'Thanks for the interview notes! This will m...',
    time: 'Monday',
    unread: 0,
    isGroup: false,
  },
  {
    id: 'c5',
    name: 'U-19 Selection Group',
    lastMessage: 'The final squad for the tournament ha...',
    time: 'Sunday',
    unread: 5,
    isGroup: true,
  },
];

const MessagesListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const renderChatItem = ({ item }: { item: typeof RECENT_CHATS[0] }) => (
    <Pressable
      style={({ pressed }) => [styles.chatItem, pressed ? { backgroundColor: '#F0F0F0' } : null]}
      onPress={() => navigation.navigate('ChatDetail', { name: item.name })}
    >
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: item.isGroup ? '#424242' : '#E0E1E2' }]}>
           <Text style={styles.avatarPlaceholderText}>{item.name.charAt(0)}</Text>
        </View>
        {!item.isGroup && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatTopRow}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.chatTime, item.unread > 0 ? styles.chatTimeActive : null]}>{item.time}</Text>
        </View>
        <View style={styles.chatBottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerIcon}>
          <Menu color="#001F3F" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <Pressable style={styles.headerIcon}>
          <Edit3 color="#001F3F" size={24} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9E9E9E" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#9E9E9E"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Pinned Teams */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PINNED TEAMS</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.pinnedTeamsList}
        >
          {PINNED_TEAMS.map(team => (
            <Pressable key={team.id} style={styles.pinnedTeamItem}>
              <View style={[styles.teamCircle, { backgroundColor: team.color }]}>
                <Text style={styles.teamInitial}>{team.name.charAt(0)}</Text>
                {team.online && <View style={styles.teamOnlineIndicator} />}
              </View>
              <Text style={styles.teamNameLabel} numberOfLines={1}>{team.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recent Chats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT CHATS</Text>
        </View>
        <View style={styles.chatsList}>
          {RECENT_CHATS.map(chat => (
            <React.Fragment key={chat.id}>
              {renderChatItem({ item: chat })}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
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
    height: 56,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#001F3F',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#212121',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#001F3F',
    letterSpacing: 1,
  },
  pinnedTeamsList: {
    paddingLeft: 16,
    paddingBottom: 20,
    gap: 16,
  },
  pinnedTeamItem: {
    alignItems: 'center',
    width: 70,
  },
  teamCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  teamInitial: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  teamOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  teamNameLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212121',
  },
  chatsList: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001F3F',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  chatTimeActive: {
    color: Colors.maroon,
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: Colors.maroon,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});

export default MessagesListScreen;
