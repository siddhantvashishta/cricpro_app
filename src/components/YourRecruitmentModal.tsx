import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

import { useAppStore } from '../store/useAppStore';
import { ActionSheetModal } from './ActionSheetModal';
import { useState } from 'react';

interface YourRecruitmentModalProps {
    visible: boolean;
    onClose: () => void;
    onNewPost: () => void; // Added to trigger creation from here
}

export const YourRecruitmentModal: React.FC<YourRecruitmentModalProps> = ({ visible, onClose, onNewPost }) => {
    const { myPosts, communityPosts, deletePost, deleteCommunityPost } = useAppStore();
    const [actionSheetVisible, setActionSheetVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    // Merge both recruitment and community posts
    const allMyActivity = [
        ...myPosts.map(p => ({ ...p, isCommunity: false })),
        ...communityPosts.map(p => ({ ...p, isCommunity: true, type: 'Community', teamName: 'Community Post' }))
    ].sort((a, b) => {
        // Simple sort by ID (which is timestamp based)
        return parseInt(b.id.replace('cp_', '')) - parseInt(a.id.replace('cp_', ''));
    });
    const handleMoreOptions = (item: any) => {
        setSelectedPost(item);
        setActionSheetVisible(true);
    };

    const actionOptions = [
        { label: 'Edit Post', onPress: () => Alert.alert('Edit', 'Opening edit form...') },
        { label: 'Mark as Filled', onPress: () => Alert.alert('Status', 'Post marked as filled!') },
        {
            label: 'Delete Post', onPress: () => {
                Alert.alert('Delete', 'Are you sure you want to remove this post?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            if (selectedPost.isCommunity) {
                                deleteCommunityPost(selectedPost.id);
                            } else {
                                deletePost(selectedPost.id);
                            }
                            setActionSheetVisible(false);
                            Alert.alert('Deleted', 'Your post has been removed.');
                        }
                    }
                ]);
            }, isDestructive: true
        },
    ];
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.postCard}>
            <View style={styles.postInfo}>
                <View style={[styles.typeBadge, item.isCommunity && styles.communityBadge]}>
                    <Text style={[styles.typeText, item.isCommunity && styles.communityTypeText]}>
                        {item.type}
                    </Text>
                </View>
                <Text style={styles.postTitle} numberOfLines={1}>
                    {item.isCommunity ? item.content : item.teamName}
                </Text>
                <Text style={styles.postMeta}>
                    {item.isCommunity ? item.time : `${item.date} • ${item.ground}`}
                </Text>
            </View>
            <View style={styles.statusAndActions}>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Active</Text>
                </View>
                <TouchableOpacity onPress={() => handleMoreOptions(item)}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Your Recruitment </Text>
                            <Text style={styles.headerSubtitle}>Manage your recent posts</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={allMyActivity}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="document-text-outline" size={48} color={colors.text.tertiary} />
                                <Text style={styles.emptyText}>You haven't posted any requirements yet.</Text>
                            </View>
                        }
                    />

                    <TouchableOpacity
                        style={styles.newPostBtn}
                        onPress={() => {
                            onClose();
                            onNewPost();
                        }}
                    >
                        <Ionicons name="add" size={24} color={colors.text.inverse} />
                        <Text style={styles.newPostText}>Create New Post</Text>
                    </TouchableOpacity>

                    <ActionSheetModal
                        visible={actionSheetVisible}
                        onClose={() => setActionSheetVisible(false)}
                        title={selectedPost?.isCommunity ? 'Manage Post' : `Manage: ${selectedPost?.teamName}`}
                        options={actionOptions}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        height: '90%',
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    headerSubtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    listContent: {
        padding: spacing.md,
    },
    postCard: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postInfo: {
        flex: 1,
    },
    typeBadge: {
        backgroundColor: '#E5E7EB',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.sm,
        marginBottom: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.secondary,
    },
    postTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    postMeta: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    statusAndActions: {
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    statusBadge: {
        backgroundColor: '#D1FAE5', // Light green
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#065F46', // Dark green
    },
    communityBadge: {
        backgroundColor: '#D1FAE5', // Emerald
    },
    communityTypeText: {
        color: '#059669',
    },
    filledBadge: {
        backgroundColor: '#F3F4F6',
    },
    filledStatusText: {
        color: colors.text.tertiary,
    },
    newPostBtn: {
        flexDirection: 'row',
        backgroundColor: '#F97316',
        margin: spacing.lg,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    newPostText: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: spacing.xxl,
    },
    emptyText: {
        ...typography.presets.body,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.md,
    }
});
