import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  TextInput,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  Plus,
  MoreHorizontal,
  Trophy,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useSocialStore, SocialPost } from '../store/useSocialStore';

const { width } = Dimensions.get('window');

// ─── Match Result Card ─────────────────────────────────────────────
const MatchResultCard = ({ post, onShare }: { post: SocialPost; onShare?: () => void }) => (
  <View style={styles.matchCard}>
    <View style={styles.matchCardBadge}>
      <Text style={styles.matchBadgeText}>MATCH RESULT</Text>
      <Text style={styles.postTime}>{post.time}</Text>
    </View>
    <View style={styles.matchScoreRow}>
      <View style={styles.matchTeam}>
        <View style={styles.teamLogo} />
        <Text style={styles.teamName}>{post.team1?.name}</Text>
        <Text style={styles.teamScore}>{post.team1?.score}</Text>
      </View>
      <Text style={styles.vsText}>VS</Text>
      <View style={styles.matchTeam}>
        <View style={[styles.teamLogo, { backgroundColor: '#1E3A5F' }]} />
        <Text style={styles.teamName}>{post.team2?.name}</Text>
        <Text style={styles.teamScore}>{post.team2?.score}</Text>
      </View>
    </View>
    <Text style={styles.matchResult}>{post.result}</Text>
    <View style={styles.matchFooter}>
      <View style={styles.momTag}>
        <Text style={styles.momTagText}>🏅 MoM: {post.mom}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.shareBtn, pressed ? { opacity: 0.6 } : null]}
        onPress={onShare}
      >
        <Share2 color={Colors.textSecondary} size={18} />
      </Pressable>
    </View>
  </View>
);

// ─── Achievement Card ──────────────────────────────────────────────
const AchievementCard = ({ post, onCelebrate }: { post: SocialPost; onCelebrate?: () => void }) => (
  <View style={styles.achievementCard}>
    <View style={styles.achievementAvatar} />
    <Text style={styles.achievementTitle}>
      {post.player} {post.achievement}
    </Text>
    <Text style={styles.achievementDetail}>{post.detail}</Text>
    <Pressable
      style={({ pressed }) => [styles.celebrateBtn, pressed ? { opacity: 0.8 } : null]}
      onPress={onCelebrate}
    >
      <Text style={styles.celebrateBtnText}>Celebrate</Text>
    </Pressable>
  </View>
);

// ─── Social Post Card ──────────────────────────────────────────────
const SocialPostCard = ({ post, onComment, onOptions }: { post: SocialPost; onComment?: () => void; onOptions?: () => void }) => {
  const toggleLike = useSocialStore(state => state.toggleLike);
  const toggleBookmark = useSocialStore(state => state.toggleBookmark);
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      if (!post.liked) {
        toggleLike(post.id);
      }
      animateHeart();
    } else {
      lastTap.current = now;
    }
  };

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(animatedValue, { toValue: 1, useNativeDriver: true, friction: 3 }),
      Animated.delay(500),
      Animated.timing(animatedValue, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.socialCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <View style={styles.userAvatar} />
          <View>
            <Text style={styles.userName}>{post.user}</Text>
            <Text style={styles.userHandle}>{post.handle} · {post.time}</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.moreBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={onOptions}
        >
          <MoreHorizontal color={Colors.textSecondary} size={20} />
        </Pressable>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.image && (
        <Pressable onPress={handleDoubleTap}>
          <Image source={post.image} style={styles.postImage} resizeMode="cover" />
          <Animated.View style={[styles.overlayHeart, { transform: [{ scale: animatedValue }], opacity: animatedValue }]}>
            <Heart color={Colors.white} fill={Colors.white} size={80} />
          </Animated.View>
        </Pressable>
      )}

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => toggleLike(post.id)}
          >
            <Heart
              color={post.liked ? '#E53E3E' : Colors.textSecondary}
              fill={post.liked ? '#E53E3E' : 'none'}
              size={22}
            />
            <Text style={[styles.actionCount, post.liked ? { color: '#E53E3E' } : null]}>
              {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={onComment}
          >
            <MessageCircle color={Colors.textSecondary} size={22} />
            <Text style={styles.actionCount}>{post.comments}</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.6 } : null]}>
            <Send color={Colors.textSecondary} size={20} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => toggleBookmark(post.id)}
        >
          <Bookmark
            color={post.bookmarked ? Colors.maroon : Colors.textSecondary}
            fill={post.bookmarked ? Colors.maroon : 'transparent'}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
};

// ─── Main Community Feed Screen ────────────────────────────────────
const CommunityFeedScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { posts, notifications } = useSocialStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const handleChallenge = () => {
    navigation.navigate('WeeklyChallenge');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.menuBtn, pressed ? { opacity: 0.6 } : null]}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 16 }]} />
          <View style={styles.menuLine} />
        </Pressable>
        <Text style={styles.headerTitle}>CRICPRO</Text>
        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => navigation.navigate('Notifications')} // Functional notification destination
          >
            <Bell color={Colors.text} size={22} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.discoveryHeader}>
        <Pressable 
          style={[styles.discoveryTab, styles.activeDiscoveryTab]}
          onPress={() => {}}
        >
          <Text style={[styles.discoveryTabText, styles.activeDiscoveryTabText]}>Feed</Text>
        </Pressable>
        <Pressable 
          style={styles.discoveryTab}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.discoveryTabText}>Explore</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Posts */}
        <View style={{ paddingTop: 10 }}>
          {posts.map(post => {
            if (post.type === 'match_result') {
              return <MatchResultCard key={post.id} post={post} onShare={() => {}} />;
            }
            if (post.type === 'achievement') {
              return <AchievementCard key={post.id} post={post} onCelebrate={() => {}} />;
            }
            return (
              <SocialPostCard
                key={post.id}
                post={post}
                onComment={() => handlePostPress(post.id)}
              />
            );
          })}
        </View>

        {/* Weekly Challenge banner */}
        <Pressable
          style={({ pressed }) => [styles.challengeBanner, pressed ? { opacity: 0.9 } : null]}
          onPress={handleChallenge}
          accessibilityRole="button"
          accessibilityLabel="View weekly challenge"
        >
          <Trophy color={Colors.white} size={28} />
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeLabel}>WEEKLY CHALLENGE</Text>
            <Text style={styles.challengeTitle}>Best Catch of the Week 🧤</Text>
          </View>
          <Text style={styles.challengeArrow}>›</Text>
        </Pressable>
      </ScrollView>

      {/* FAB Create Post */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85, transform: [{ scale: 0.97 }] } : null]}
        onPress={handleCreatePost}
        accessibilityRole="button"
        accessibilityLabel="Create new post"
      >
        <Plus color={Colors.white} size={26} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuBtn: { width: 44, height: 44, justifyContent: 'center', gap: 4 },
  menuLine: { height: 2, width: 22, backgroundColor: Colors.text, borderRadius: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.maroon, letterSpacing: 1.5 },
  notifBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  notifBadge: {
    position: 'absolute', top: 5, right: 5,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: '#FF3B30', paddingHorizontal: 4,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  notifBadgeText: { fontSize: 9, fontWeight: '900', color: Colors.white },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Discovery
  discoveryHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  discoveryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeDiscoveryTab: {
    backgroundColor: Colors.maroon,
  },
  discoveryTabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  activeDiscoveryTabText: {
    color: '#FFFFFF',
  },

  // Stories
  storiesList: { paddingHorizontal: 12, paddingVertical: 14, gap: 16 },
  storyItem: { alignItems: 'center', width: 60 },
  storyAddCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.maroon,
    justifyContent: 'center', alignItems: 'center',
  },
  storyCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#E0E0E0',
  },
  storyCircleActive: { borderColor: Colors.maroon },
  storyAvatarInner: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#C5C5C5',
  },
  storyName: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },

  divider: { height: 8, backgroundColor: '#F0F0F0' },

  // Match Result Card
  matchCard: {
    backgroundColor: Colors.white,
    margin: 12,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }),
  },
  matchCardBadge: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  matchBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.maroon, letterSpacing: 0.8 },
  postTime: { fontSize: 11, color: Colors.textSecondary },
  matchScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  matchTeam: { alignItems: 'center', flex: 1 },
  teamLogo: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.maroon, marginBottom: 6 },
  teamName: { fontSize: 12, fontWeight: '700', color: Colors.text },
  teamScore: { fontSize: 22, fontWeight: '900', color: Colors.text },
  vsText: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
  matchResult: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  matchFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  momTag: { backgroundColor: Colors.peach, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  momTagText: { fontSize: 11, fontWeight: '700', color: Colors.maroon },
  shareBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },

  // Achievement Card
  achievementCard: {
    backgroundColor: Colors.maroon,
    margin: 12,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  achievementAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 },
  achievementTitle: { fontSize: 22, fontWeight: '900', color: Colors.white, textAlign: 'center', lineHeight: 30, marginBottom: 8 },
  achievementDetail: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  celebrateBtn: { backgroundColor: Colors.white, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, minHeight: 44 },
  celebrateBtnText: { fontSize: 14, fontWeight: '800', color: Colors.maroon },

  // Social Post Card
  socialCard: { backgroundColor: Colors.white, marginHorizontal: 12, marginBottom: 12, borderRadius: 16, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  postUser: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#C5CAE9' },
  userName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  userHandle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  moreBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  postContent: { fontSize: 14, color: Colors.text, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 12 },
  postImage: { width: '100%', height: 380 },
  overlayHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  postActionsLeft: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 44, justifyContent: 'center' },
  actionCount: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },

  // Challenge Banner
  challengeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFB800', marginHorizontal: 12, marginVertical: 8, borderRadius: 16, padding: 16, gap: 12 },
  challengeInfo: { flex: 1 },
  challengeLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.5)', letterSpacing: 0.8 },
  challengeTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginTop: 2 },
  challengeArrow: { fontSize: 24, fontWeight: '700', color: Colors.text },

  // FAB
  fab: {
    position: 'absolute', right: 20, bottom: 90,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.maroon,
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 }, android: { elevation: 6 } }),
  },
});

export default CommunityFeedScreen;
