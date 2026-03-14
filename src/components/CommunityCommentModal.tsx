import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface CommunityCommentModalProps {
    visible: boolean;
    onClose: () => void;
    postId: string;
}

export const CommunityCommentModal: React.FC<CommunityCommentModalProps> = ({ visible, onClose, postId }) => {
    const { communityPostComments, addCommunityComment, user } = useAppStore();
    const [commentText, setCommentText] = useState('');

    const comments = communityPostComments[postId] || [];

    const handleSendComment = () => {
        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now().toString(),
            author: user?.name || 'Anonymous',
            text: commentText.trim(),
            time: 'Just now'
        };

        addCommunityComment(postId, newComment);
        setCommentText('');
    };

    const renderComment = ({ item }: { item: any }) => (
        <View style={styles.commentCard}>
            <View style={styles.commentAvatar}>
                <Text style={styles.avatarText}>{item.author.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <Text style={styles.commentTime}>{item.time}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.dragHandle} />

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Comments</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="chatbubbles-outline" size={48} color={colors.text.tertiary} />
                                <Text style={styles.emptyText}>No comments yet</Text>
                                <Text style={styles.emptySub}>Be the first to share your thoughts!</Text>
                            </View>
                        }
                    />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                    >
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add a comment..."
                                    placeholderTextColor={colors.text.tertiary}
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={[styles.sendBtn, !commentText.trim() && { opacity: 0.5 }]}
                                    onPress={handleSendComment}
                                    disabled={!commentText.trim()}
                                >
                                    <Ionicons name="send" size={20} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <SafeAreaView />
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: '80%',
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingTop: spacing.xs,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        position: 'relative',
    },
    headerTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    closeBtn: {
        position: 'absolute',
        right: spacing.lg,
    },
    listContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    commentCard: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        fontSize: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    authorName: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginRight: spacing.sm,
    },
    commentTime: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    commentText: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        lineHeight: 18,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    emptySub: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: 4,
    },
    inputContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceHighlight,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    input: {
        flex: 1,
        ...typography.presets.body,
        color: colors.text.primary,
        maxHeight: 100,
        paddingVertical: spacing.xs,
    },
    sendBtn: {
        marginLeft: spacing.sm,
        padding: spacing.xs,
    },
});
