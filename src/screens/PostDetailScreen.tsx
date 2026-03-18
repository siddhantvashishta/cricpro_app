import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreHorizontal, ThumbsUp, MessageCircle, Share2, SmilePlus, Send } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const POST = {
  user: 'Rahul Sharma',
  time: '2 hours ago',
  location: 'Mumbai, India',
  content: 'Unbelievable performance by the team today! That last over was pure magic. CRICPRO fans, what are your thoughts on the MVP? The stadium was absolutely electric tonight! 🏏🔥',
  image: require('../assets/stadium_night.png'),
  likes: 1200,
  comments: 348,
  shares: 56,
};

const INITIAL_COMMENTS = [
  { id: 'c1', user: 'Priya Singh', time: '1h ago', content: 'Honestly, the bowling in the death overs was what saved us. Bumrah is just on another level!', replies: [{ id: 'r1', user: 'Vikram', time: '45m ago', content: 'Totally agree. That yorker on the 4th ball was perfection. 😮' }] },
  { id: 'c2', user: 'Arjun Patel', time: '2h ago', content: 'Still can\'t believe we pulled that off. Best match of the season so far!', replies: [] },
  { id: 'c3', user: 'Meera K.', time: '2h ago', content: 'The crowd energy was INSANE. I was there and it was surreal! 🙌', replies: [] },
];

type Comment = { id: string; user: string; time: string; content: string; replies: any[] };

const CommentItem = ({ comment, onLike, onReply }: { comment: Comment; onLike: any; onReply: any }) => (
  <View style={styles.commentItem}>
    <View style={styles.commentUserRow}>
      <View style={styles.commentAvatar} />
      <View style={styles.commentBody}>
        <View style={styles.commentBubble}>
          <View style={styles.commentHeaderRow}>
            <Text style={styles.commentUser}>{comment.user}</Text>
            <Text style={styles.commentTime}>{comment.time}</Text>
          </View>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>
        <View style={styles.commentActions}>
          <Pressable
            style={({ pressed }) => [styles.commentAction, pressed ? { opacity: 0.6 } : null]}
            onPress={() => onLike(comment.id)}
            accessibilityRole="button"
            accessibilityLabel="Like comment"
          >
            <Text style={styles.commentActionText}>Like</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.commentAction, pressed ? { opacity: 0.6 } : null]}
            onPress={() => onReply(comment.user)}
            accessibilityRole="button"
            accessibilityLabel="Reply to comment"
          >
            <Text style={styles.commentActionText}>Reply</Text>
          </Pressable>
        </View>
        {comment.replies.map(reply => (
          <View key={reply.id} style={styles.replyItem}>
            <View style={[styles.commentAvatar, { width: 28, height: 28, borderRadius: 14 }]} />
            <View style={styles.commentBubble}>
              <View style={styles.commentHeaderRow}>
                <Text style={styles.commentUser}>{reply.user}</Text>
                <Text style={styles.commentTime}>{reply.time}</Text>
              </View>
              <Text style={styles.commentText}>{reply.content}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const PostDetailScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(POST.likes);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleFollow = () => setFollowing(f => !f);

  const handleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c${Date.now()}`,
      user: 'You',
      time: 'just now',
      content: replyTo ? `@${replyTo} ${newComment}` : newComment,
      replies: [],
    };
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setReplyTo(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.maroon} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => Alert.alert('Options', 'Report, Share, or Copy Link')}
          accessibilityRole="button" accessibilityLabel="More options"
        >
          <MoreHorizontal color={Colors.text} size={22} />
        </Pressable>
      </View>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            onLike={() => {}}
            onReply={(user: string) => setReplyTo(user)}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            {/* User Info */}
            <View style={styles.postUserRow}>
              <View style={styles.postAvatar} />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{POST.user}</Text>
                <Text style={styles.postUserMeta}>{POST.time} · {POST.location}</Text>
              </View>
            </View>

            {/* Follow Button */}
            <Pressable
              style={({ pressed }) => [
                styles.followBtn,
                following ? styles.followBtnActive : null,
                pressed ? { opacity: 0.85 } : null,
              ]}
              onPress={handleFollow}
              accessibilityRole="button"
              accessibilityLabel={following ? 'Unfollow user' : 'Follow user'}
            >
              <Text style={[styles.followBtnText, following ? styles.followBtnTextActive : null]}>
                {following ? '✓ Following' : 'Follow'}
              </Text>
            </Pressable>

            {/* Post Content */}
            <Text style={styles.postContent}>{POST.content}</Text>
            <Image source={POST.image} style={styles.postImage} resizeMode="cover" />

            {/* Actions */}
            <View style={styles.actionsRow}>
              <View style={styles.actionsLeft}>
                <Pressable style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.7 } : null]} onPress={handleLike} accessibilityRole="button" accessibilityLabel={liked ? 'Unlike' : 'Like'}>
                  <ThumbsUp color={liked ? Colors.maroon : Colors.textSecondary} fill={liked ? Colors.maroon : 'none'} size={20} />
                  <Text style={[styles.actionText, liked ? { color: Colors.maroon } : null]}>{(likeCount / 1000).toFixed(1)}k</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.7 } : null]} accessibilityRole="button" accessibilityLabel="View comments">
                  <MessageCircle color={Colors.textSecondary} size={20} />
                  <Text style={styles.actionText}>{POST.comments}</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionBtn, pressed ? { opacity: 0.7 } : null]} onPress={() => Alert.alert('Share', 'Share options here')} accessibilityRole="button" accessibilityLabel="Share">
                  <Share2 color={Colors.textSecondary} size={20} />
                  <Text style={styles.actionText}>{POST.shares}</Text>
                </Pressable>
              </View>
            </View>

            {/* Comments Header */}
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments ({POST.comments})</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Sort comments">
                <Text style={styles.newestBtn}>Newest ▾</Text>
              </Pressable>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        {replyTo && (
          <View style={styles.replyingBanner}>
            <Text style={styles.replyingText}>Replying to @{replyTo}</Text>
            <Pressable onPress={() => setReplyTo(null)} accessibilityRole="button" accessibilityLabel="Cancel reply">
              <Text style={styles.cancelReply}>✕</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.commentInputRow}>
          <View style={styles.commentSelfAvatar} />
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#B0B0B0"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <Pressable
            style={({ pressed }) => [styles.emojiBtn, pressed ? { opacity: 0.6 } : null]}
            accessibilityRole="button" accessibilityLabel="Add emoji"
          >
            <SmilePlus color={Colors.textSecondary} size={20} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.sendBtn, !newComment.trim() ? styles.sendBtnDisabled : null, pressed ? { opacity: 0.8 } : null]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
            accessibilityRole="button" accessibilityLabel="Send comment"
          >
            <Send color={Colors.white} size={16} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  postUserRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  postAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#90A4AE' },
  postUserInfo: { flex: 1 },
  postUserName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  postUserMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  followBtn: { backgroundColor: Colors.maroon, marginHorizontal: 16, marginBottom: 8, paddingVertical: 14, borderRadius: 12, alignItems: 'center', minHeight: 44 },
  followBtnActive: { backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: Colors.maroon },
  followBtnText: { fontSize: 15, fontWeight: '800', color: Colors.white },
  followBtnTextActive: { color: Colors.maroon },
  postContent: { fontSize: 15, color: Colors.text, lineHeight: 22, paddingHorizontal: 16, paddingBottom: 14 },
  postImage: { width: '100%', height: 220 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  actionsLeft: { flexDirection: 'row', gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, justifyContent: 'center' },
  actionText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  commentsTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  newestBtn: { fontSize: 13, fontWeight: '700', color: Colors.maroon },
  commentItem: { paddingHorizontal: 16, marginBottom: 12 },
  commentUserRow: { flexDirection: 'row', gap: 10 },
  commentAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8A0BF', marginTop: 2 },
  commentBody: { flex: 1 },
  commentBubble: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10, marginBottom: 4 },
  commentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentUser: { fontSize: 13, fontWeight: '800', color: Colors.text },
  commentTime: { fontSize: 11, color: Colors.textSecondary },
  commentText: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  commentActions: { flexDirection: 'row', gap: 16, paddingHorizontal: 4 },
  commentAction: { minHeight: 36, justifyContent: 'center' },
  commentActionText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  replyItem: { flexDirection: 'row', gap: 8, marginTop: 10 },
  commentInputContainer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: Colors.white },
  replyingBanner: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: Colors.peach },
  replyingText: { fontSize: 12, fontWeight: '600', color: Colors.maroon },
  cancelReply: { fontSize: 14, color: Colors.textSecondary, paddingHorizontal: 8 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  commentSelfAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8A0BF' },
  commentInput: { flex: 1, fontSize: 14, color: Colors.text, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 80 },
  emojiBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#C0C0C0' },
});

export default PostDetailScreen;
