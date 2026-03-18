import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPlus, Users, Check, X, Shield, Clock, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, SocialRequest } from '../store/useTeamStore';

const { width } = Dimensions.get('window');

const SocialRequestsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { socialRequests, respondToSocialRequest, players, teams } = useTeamStore();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = socialRequests.filter(req => req.receiverId === 'me' && req.status === 'pending');
  const sentRequests = socialRequests.filter(req => req.senderId === 'me');

  const handleResponse = (requestId: string, status: 'accepted' | 'declined', type: string) => {
    respondToSocialRequest(requestId, status);
    const message = status === 'accepted' 
      ? `You are now ${type === 'friend' ? 'friends' : 'part of the team'}!`
      : 'Request declined.';
    Alert.alert(status.charAt(0).toUpperCase() + status.slice(1), message);
  };

  const renderRequestItem = (req: SocialRequest) => {
    const sender = players[req.senderId] || { name: 'Unknown Cricketer', role: 'Player' };
    const isTeamJoined = req.type === 'team_join';
    const team = isTeamJoined && req.teamId ? teams.find(t => t.id === req.teamId) : null;

    return (
      <View key={req.id} style={styles.requestCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: isTeamJoined ? '#1A202C' : '#CBD5E1' }]}>
            <Text style={styles.avatarText}>{sender.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>
              <Text style={styles.bold}>{sender.name}</Text>
              {isTeamJoined ? ' wants to join ' : ' sent you a friend request'}
              {isTeamJoined && <Text style={styles.bold}>{team?.name}</Text>}
            </Text>
            <View style={styles.metaRow}>
              <Clock size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{new Date(req.timestamp).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable 
            style={[styles.actionBtn, styles.declineBtn]} 
            onPress={() => handleResponse(req.id, 'declined', req.type)}
          >
            <X size={18} color="#64748B" />
            <Text style={styles.declineText}>Decline</Text>
          </Pressable>
          <Pressable 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => handleResponse(req.id, 'accepted', req.type)}
          >
            <Check size={18} color="#FFFFFF" />
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderSentRequestItem = (req: SocialRequest) => {
    const receiver = players[req.receiverId] || { name: 'Cricketer', role: 'Player' };
    const isTeamJoin = req.type === 'team_join';
    const team = isTeamJoin && req.teamId ? teams.find(t => t.id === req.teamId) : null;

    return (
      <View key={req.id} style={styles.requestCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: '#F1F5F9' }]}>
            <Text style={[styles.avatarText, { color: '#64748B' }]}>{receiver.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>
              You requested to {isTeamJoin ? 'join ' : 'be friends with '}
              <Text style={styles.bold}>{isTeamJoin ? team?.name : receiver.name}</Text>
            </Text>
            <View style={styles.metaRow}>
              <Clock size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{req.status.toUpperCase()} • {new Date(req.timestamp).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1A202C" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Social Requests</Text>
        <View style={styles.headerRight}>
           <View style={styles.badge}>
             <Text style={styles.badgeText}>{receivedRequests.length}</Text>
           </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>Received</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>Sent</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {activeTab === 'received' ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map(renderRequestItem)
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Users color="#94A3B8" size={48} />
              </View>
              <Text style={styles.emptyTitle}>No Pending Requests</Text>
              <Text style={styles.emptyText}>When cricketers or teams invite you, they'll show up here.</Text>
            </View>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map(renderSentRequestItem)
          ) : (
            <View style={styles.emptyState}>
               <Text style={styles.emptyText}>You haven't sent any requests yet.</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
    marginLeft: 8,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.maroon,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 6,
    margin: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#F8FAFC',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  activeTabText: {
    color: Colors.maroon,
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '800',
    color: '#1A202C',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  declineBtn: {
    backgroundColor: '#F1F5F9',
  },
  acceptBtn: {
    backgroundColor: Colors.maroon,
  },
  declineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  }
});

export default SocialRequestsScreen;
