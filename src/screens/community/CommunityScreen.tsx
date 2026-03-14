import { ImageBackground, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Alert, Share, FlatList, ActionSheetIOS, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Premium Category Map
const COMMUNITY_CATEGORIES = [
    { id: '1', title: 'Scorers', icon: 'clipboard-list-outline', cta: 'Hire', bg: 'rgba(56, 189, 248, 0.15)', accent: '#38BDF8' },
    { id: '2', title: 'Umpires', icon: 'account-tie-hat', cta: 'Book', bg: 'rgba(251, 146, 60, 0.15)', accent: '#FB923C' },
    { id: '3', title: 'Commentators', icon: 'microphone-outline', cta: 'Invite', bg: 'rgba(167, 139, 250, 0.15)', accent: '#A855F7' },
    { id: '4', title: 'Streamers', icon: 'youtube-tv', cta: 'Watch', bg: 'rgba(244, 63, 94, 0.15)', accent: '#F43F5E' },
    { id: '5', title: 'Organisers', icon: 'account-tie', cta: 'Connect', bg: 'rgba(52, 211, 153, 0.15)', accent: '#34D399' },
    { id: '6', title: 'Academies', icon: 'school-outline', cta: 'Join', bg: 'rgba(96, 165, 250, 0.15)', accent: '#60A5FA' },
    { id: '7', title: 'Grounds', icon: 'stadium-outline', cta: 'Rent', bg: 'rgba(163, 230, 53, 0.15)', accent: '#84CC16' },
];

import { CommunityPost } from '../../data/mockCommunityPosts';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppHeader } from '../../components';
import { useTheme } from '../../hooks/useTheme';
import { colors as staticColors, spacing, typography, radius } from '../../theme';
import { MyCricketFilterModal } from '../../components/MyCricketFilterModal';
import { ProfessionalDirectoryModal, CommunityCommentModal, CreationFab } from '../../components';
import { useAppStore } from '../../store/useAppStore';

export const CommunityScreen: React.FC = () => {
    const { communityPosts, likedCommunityPosts, toggleCommunityPostLike, user, deleteCommunityPost, communityPostComments, isProMember, setHeaderConfig } = useAppStore();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [directoryVisible, setDirectoryVisible] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [activePostId, setActivePostId] = useState<string | null>(null);

    // For Double Tap Animation
    const lastTap = useRef<number>(0);
    const heartScale = useRef(new Animated.Value(0)).current;
    const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);
    const navigation = useNavigation<any>();
    const { colors, isDark } = useTheme();

    // Use store-managed communityPosts
    const combinedFeedData = activeCategory
        ? communityPosts.filter(post => post.cat === activeCategory || post.tags?.includes(`#${activeCategory.replace(/\s/g, '')}`))
        : communityPosts;

    const handleCategoryPress = (title: string) => {
        setSelectedDirectory(title);
        setDirectoryVisible(true);
    };

    const handleToggleLike = (postId: string) => {
        toggleCommunityPostLike(postId);
        // Haptic or visual feedback could be added here if needed
    };

    const handlePostAction = (post: CommunityPost) => {
        const isAuthor = post.author === user?.name;

        const options = ['Cancel', 'Hide Post', 'Report Player'];
        const destructiveButtonIndex = isAuthor ? 3 : undefined;

        if (isAuthor) {
            options.push('Delete Post');
        }

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex: 0,
                    destructiveButtonIndex,
                    title: 'Post Actions',
                    message: `Manage post from ${post.author}`
                },
                (buttonIndex) => {
                    executePostAction(buttonIndex, post, isAuthor);
                }
            );
        } else {
            const buttons: any[] = [
                { text: 'Hide Post', onPress: () => executePostAction(1, post, isAuthor) },
                { text: 'Report Player', onPress: () => executePostAction(2, post, isAuthor) },
                { text: 'Cancel', style: 'cancel' }
            ];

            if (isAuthor) {
                buttons.unshift({
                    text: 'Delete Post',
                    onPress: () => executePostAction(3, post, isAuthor),
                    style: 'destructive'
                });
            }

            Alert.alert('Post Actions', `Manage post from ${post.author}`, buttons);
        }
    };

    const executePostAction = (index: number, post: CommunityPost, isAuthor: boolean) => {
        if (index === 1) {
            Alert.alert('Hidden', 'This post will no longer appear in your feed.');
            // Implementation would filter this out
        } else if (index === 2) {
            Alert.alert('Reported', 'Our moderation team will review this player\'s activity.');
        } else if (index === 3 && isAuthor) {
            Alert.alert(
                'Delete Post?',
                'Are you sure you want to permanently delete this post?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteCommunityPost(post.id)
                    }
                ]
            );
        }
    };

    const handleShare = async (post: any) => {
        try {
            await Share.share({
                message: `${post.author} posted on CricPro: "${post.content}"\n\nDownload CricPro for more cricket updates!`,
                title: 'CricPro Social',
            });
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const handleDoubleTap = (postId: string) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
            // Trigger Like if not already liked
            if (!likedCommunityPosts[postId]) {
                toggleCommunityPostLike(postId);
            }
            
            // Trigger Animation
            setAnimatingPostId(postId);
            heartScale.setValue(0);
            Animated.spring(heartScale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 4,
                tension: 40
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(heartScale, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true
                    }).start(() => setAnimatingPostId(null));
                }, 500);
            });
        }
        lastTap.current = now;
    };

    const handleOpenComments = (postId: string) => {
        setActivePostId(postId);
        setCommentModalVisible(true);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: undefined,
                rightIcons: [
                    { name: 'search', onPress: () => navigation.navigate('Search') },
                    { name: 'chatbox-ellipses-outline', onPress: () => navigation.navigate('DirectMessages') },
                    { name: 'funnel-outline', onPress: () => setIsFilterVisible(true) }
                ],
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation]);
    const renderCategoryItem = ({ item }: { item: typeof COMMUNITY_CATEGORIES[0] }) => {
        const isActive = activeCategory === item.title;
        return (
            <TouchableOpacity
                style={[styles.premiumCategoryCard, { backgroundColor: item.bg, borderColor: item.accent + '30' }]}
                activeOpacity={0.7}
                onPress={() => handleCategoryPress(item.title)}
            >
                <View style={styles.premiumIconContainer}>
                    <MaterialCommunityIcons name={item.icon as any} size={28} color={isActive ? 'white' : item.accent} />
                </View>
                <View>
                    <Text style={[styles.premiumCategoryTitle, { color: isActive ? 'white' : colors.text.primary }]}>{item.title}</Text>
                    <Text style={[styles.premiumCategoryCta, { color: isActive ? 'rgba(255,255,255,0.7)' : colors.text.secondary }]}>{item.cta} ↗</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFeedItem = ({ item }: { item: CommunityPost }) => {
        const isLiked = !!likedCommunityPosts[item.id];
        const displayLikes = item.likes + (isLiked ? 1 : 0);

        return (
            <View style={styles.feedCard}>
                <View style={styles.feedHeader}>
                    <View style={styles.avatarWrap}>
                        <View style={[styles.avatar, { backgroundColor: colors.surfaceHighlight }]} />
                        {item.verified && <View style={styles.verifiedBadge}><Ionicons name="checkmark-circle" size={14} color="#38BDF8" /></View>}
                    </View>
                    <View style={styles.authorInfoWrap}>
                        <View style={styles.authorRow}>
                            <Text style={styles.authorName}>{item.author}</Text>
                            {/* Pro Member Gold Badge for the current mocked user */}
                            {isProMember && item.author === 'Siddhant V.' && (
                                <Ionicons name="shield-checkmark" size={14} color="#F59E0B" style={{ marginLeft: 4 }} />
                            )}
                            <Text style={styles.feedTime}>• {item.time}</Text>
                        </View>
                        <Text style={styles.authorRole}>{item.role || 'Community Player'}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreIcon} onPress={() => handlePostAction(item)}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.feedContent}>{item.content}</Text>
                {item.tags && (
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag: string, idx: number) => (
                            <Text key={idx} style={styles.postTag}>{tag}</Text>
                        ))}
                    </View>
                )}

                {item.image && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleDoubleTap(item.id)}
                        style={styles.mediaContainer}
                    >
                        <Image source={{ uri: item.image }} style={styles.feedImage} />

                        {animatingPostId === item.id && (
                            <View style={styles.heartOverlay}>
                                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                    <Ionicons name="heart" size={80} color="white" />
                                </Animated.View>
                            </View>
                        )}

                        <View style={styles.floatingActionBar}>
                            <TouchableOpacity style={styles.floatingBtn} onPress={() => handleToggleLike(item.id)}>
                                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? "#F43F5E" : "white"} />
                                <Text style={styles.floatingBtnText}>{displayLikes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.floatingBtn} onPress={() => handleOpenComments(item.id)}>
                                <Ionicons name="chatbubble-outline" size={24} color="white" />
                                <Text style={styles.floatingBtnText}>{item.comments + (communityPostComments[item.id]?.length || 0)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.floatingBtn} onPress={() => handleShare(item)}>
                                <Ionicons name="share-social-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
                <MyCricketFilterModal
                    visible={isFilterVisible}
                    onClose={() => setIsFilterVisible(false)}
                    onApply={(filters) => {
                        Alert.alert('Community Filters', `Filtering feed by ${filters.type} from ${filters.time}.`);
                    }}
                />

                <ProfessionalDirectoryModal
                    visible={directoryVisible}
                    onClose={() => setDirectoryVisible(false)}
                    category={selectedDirectory}
                />

                <FlatList
                    data={combinedFeedData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFeedItem}
                    ListHeaderComponent={
                        <>
                            <TouchableOpacity 
                                style={styles.locationHeader} 
                                activeOpacity={0.8}
                                onPress={() => Alert.alert('Location Settings', 'Changing your location will refresh the Global Network feed for your region.')}
                            >
                                <Ionicons name="location" size={16} color="#F97316" />
                                <Text style={styles.headerText}> Bengaluru (Bangalore)</Text>
                                <Ionicons name="chevron-down" size={16} color={colors.text.secondary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>

                            <View style={styles.carouselContainer}>
                                <Text style={styles.sectionTitle}>Quick Connect</Text>
                                <FlatList
                                    data={COMMUNITY_CATEGORIES}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderCategoryItem}
                                    contentContainerStyle={styles.horizontalCarousel}
                                />
                            </View>

                            <TouchableOpacity style={styles.postBanner} activeOpacity={0.9} onPress={() => navigation.navigate('WritePost')}>
                                <View style={styles.postBannerAvatar}>
                                    <Text style={styles.postBannerInitials}>{(user?.name || 'A').substring(0, 2).toUpperCase()}</Text>
                                </View>
                                <View style={styles.postBannerInputArea}>
                                    <Text style={styles.postBannerHint}>Share your cricket journey...</Text>
                                </View>
                                <Ionicons name="images" size={22} color={colors.primary} />
                            </TouchableOpacity>

                            <View style={styles.feedDivider}>
                                <Text style={styles.sectionTitle}>{activeCategory ? `${activeCategory} Feed` : 'Global Network'}</Text>
                            </View>
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />

                {activePostId && (
                    <CommunityCommentModal
                        visible={commentModalVisible}
                        onClose={() => setCommentModalVisible(false)}
                        postId={activePostId}
                    />
                )}

                <CreationFab />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: staticColors.background,
    },
    locationHeader: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: staticColors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerText: {
        ...typography.presets.body,
        color: staticColors.text.primary,
        fontWeight: typography.weights.medium,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: staticColors.text.primary,
    },
    carouselContainer: {
        paddingVertical: spacing.md,
        backgroundColor: staticColors.surface,
        marginBottom: spacing.xs,
    },
    horizontalCarousel: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.sm,
    },
    premiumCategoryCard: {
        width: 130,
        height: 140,
        borderRadius: radius.md,
        borderWidth: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
        marginRight: spacing.sm,
    },
    premiumIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumCategoryTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        marginBottom: 2,
    },
    premiumCategoryCta: {
        ...typography.presets.caption,
        fontWeight: typography.weights.medium,
    },
    postBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: staticColors.surface,
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: spacing.xs,
    },
    postBannerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: staticColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    postBannerInitials: {
        color: 'white',
        fontWeight: typography.weights.bold,
        fontSize: 14,
    },
    postBannerInputArea: {
        flex: 1,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        marginRight: spacing.md,
    },
    postBannerHint: {
        color: staticColors.text.secondary,
        ...typography.presets.body,
    },
    feedDivider: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: staticColors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    feedCard: {
        backgroundColor: staticColors.surface,
        marginBottom: spacing.lg,
        paddingVertical: spacing.md,
    },
    feedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    avatarWrap: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#071428',
        borderRadius: 10,
    },
    authorInfoWrap: {
        flex: 1,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: staticColors.text.primary,
        marginRight: 6,
    },
    authorRole: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
        marginTop: 2,
    },
    moreIcon: {
        padding: spacing.xs,
    },
    feedTime: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
    },
    feedContent: {
        ...typography.presets.body,
        color: staticColors.text.primary,
        lineHeight: 22,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        gap: 6,
    },
    postTag: {
        color: staticColors.primary,
        ...typography.presets.caption,
        fontWeight: typography.weights.medium,
    },
    mediaContainer: {
        width: '100%',
        position: 'relative',
    },
    feedImage: {
        width: '100%',
        height: 350,
        backgroundColor: '#E5E7EB',
    },
    floatingActionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: spacing.lg,
        paddingTop: 40,
        gap: spacing.lg,
        // Linear Gradient visual emulation
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    floatingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    floatingBtnText: {
        color: 'white',
        fontWeight: typography.weights.bold,
        fontSize: 14,
    },
    heartOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    }
});
