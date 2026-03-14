import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StatusBar,
    Image,
    Keyboard,
    Animated,
    Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

export const WritePostScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { addCommunityPost, user } = useAppStore();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Form State
    const [postContent, setPostContent] = useState('');
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [attachedLocation, setAttachedLocation] = useState<string | null>(null);

    const inputRef = useRef<TextInput>(null);
    const imageScale = useRef(new Animated.Value(0)).current;
    const charCountScale = useRef(new Animated.Value(1)).current;

    // Extract hashtags on the fly (words starting with #)
    const extractHashtags = (text: string) => {
        const matches = text.match(/#[a-z0-9_]+/gi);
        return matches ? matches : [];
    };

    useEffect(() => {
        if (postContent.length > 0) {
            Animated.sequence([
                Animated.timing(charCountScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
                Animated.timing(charCountScale, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();
        }
    }, [postContent.length]);

    useEffect(() => {
        if (attachedImage) {
            Animated.spring(imageScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true
            }).start();
        } else {
            imageScale.setValue(0);
        }
    }, [attachedImage]);

    const handleCreatePost = () => {
        if (!postContent.trim() && !attachedImage) {
            Alert.alert('Empty Post', 'Please write something or attach an image.');
            return;
        }

        const extractedTags = extractHashtags(postContent);

        const finalContent = attachedLocation
            ? `${postContent.trim()}\n\n📍 ${attachedLocation}`
            : postContent.trim();

        const newPost = {
            id: `p_${Date.now()}`, // Unique ID
            author: user?.name || 'Anonymous',
            verified: true, // Assuming default user is verified for this demo
            role: user?.role || 'Pro Player',
            time: 'Just now',
            content: finalContent,
            tags: extractedTags,
            likes: 0,
            comments: 0,
            image: attachedImage,
            cat: undefined // It will appear in the Global Network by default
        };

        // Inject to top of feed
        addCommunityPost(newPost);

        navigation.goBack();
    };

    const attachMedia = async () => {
        if (attachedImage) {
            setAttachedImage(null);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAttachedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert('Error', 'Failed to pick image from library.');
        }
    };

    const handleLocationToggle = () => {
        if (attachedLocation) {
            setAttachedLocation(null);
        } else {
            // Mocking a beautiful stadium location for the premium feel
            setAttachedLocation('Wankhede Stadium, Mumbai');
        }
    };

    const handleTagToggle = () => {
        // WhatsApp style: append a hashtag and immediately focus the keyboard so the user can type
        setPostContent(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '#' : ' #'));
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Post</Text>
                <TouchableOpacity
                    style={[styles.postHeaderBtn, (!postContent.trim() && !attachedImage) && styles.postHeaderBtnDisabled]}
                    onPress={handleCreatePost}
                    disabled={(!postContent.trim() && !attachedImage)}
                >
                    <Text style={[styles.postHeaderBtnText, (!postContent.trim() && !attachedImage) && styles.postHeaderBtnTextDisabled]}>POST</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* User Info Bar */}
                    <View style={styles.userInfoRow}>
                        <View style={styles.avatar}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{(user?.name || 'A').substring(0, 2).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.userName}>{user?.name || 'Anonymous'}</Text>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="earth" size={12} color={colors.text.tertiary} />
                            <Text style={styles.privacyBadgeText}>Public</Text>
                        </View>
                    </View>

                    {/* Top Action Bar */}
                    <View style={styles.topActionBar}>
                        <TouchableOpacity style={styles.topActionBtn} onPress={attachMedia}>
                            <Ionicons name="image-outline" size={24} color={attachedImage ? colors.primary : colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topActionBtn} onPress={handleLocationToggle}>
                            <Ionicons name="location-outline" size={24} color={attachedLocation ? colors.primary : colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topActionBtn} onPress={handleTagToggle}>
                            <Ionicons name="pricetag-outline" size={24} color={colors.text.secondary} />
                        </TouchableOpacity>

                        <View style={{ flex: 1 }} />
                        <Animated.Text 
                            style={[
                                styles.charCount, 
                                postContent.length > 250 && { color: colors.warning },
                                postContent.length > 280 && { color: colors.error, fontWeight: 'bold' },
                                { transform: [{ scale: charCountScale }] }
                            ]}
                        >
                            {postContent.length}/280
                        </Animated.Text>
                    </View>

                    {/* Text Area */}
                    <TextInput
                        ref={inputRef}
                        style={styles.textArea}
                        placeholder="What's happening in your cricket world?"
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        autoFocus
                        value={postContent}
                        onChangeText={setPostContent}
                    />

                    {/* Location Badge Preview */}
                    {attachedLocation && (
                        <View style={styles.locationBadgeContainer}>
                            <Ionicons name="location" size={16} color={colors.primary} />
                            <Text style={styles.locationBadgeText}>{attachedLocation}</Text>
                            <TouchableOpacity onPress={() => setAttachedLocation(null)}>
                                <Ionicons name="close" size={16} color={colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Image Attachment Preview */}
                    {attachedImage && (
                        <Animated.View style={[styles.mediaPreviewContainer, { transform: [{ scale: imageScale }] }]}>
                            <Image source={{ uri: attachedImage }} style={styles.mediaPreviewImage} />
                            <TouchableOpacity style={styles.removeMediaBtn} onPress={() => {
                                setAttachedImage(null);
                                Vibration.vibrate(10);
                            }}>
                                <Ionicons name="close-circle" size={28} color="rgba(0,0,0,0.7)" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    postHeaderBtn: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.warning,
        borderRadius: 16,
    },
    postHeaderBtnDisabled: {
        backgroundColor: colors.surfaceHighlight, // Muted grey
    },
    postHeaderBtnText: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    postHeaderBtnTextDisabled: {
        color: colors.text.tertiary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    userName: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginRight: spacing.sm,
    },
    privacyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    privacyBadgeText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        marginLeft: 4,
    },
    topActionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: spacing.md,
    },
    topActionBtn: {
        padding: spacing.xs,
    },
    textArea: {
        ...typography.presets.h3,
        color: colors.text.primary,
        lineHeight: 28,
        textAlignVertical: 'top', // Needed for multiline on Android
        minHeight: 150, // Ensure enough height to tap into
    },
    charCount: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
    },
    mediaPreviewContainer: {
        marginTop: spacing.md,
        position: 'relative',
        width: '100%',
    },
    mediaPreviewImage: {
        width: '100%',
        height: 250,
        borderRadius: radius.md,
    },
    removeMediaBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 2,
    },
    locationBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceHighlight,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
        marginTop: spacing.sm,
        gap: 6,
    },
    locationBadgeText: {
        ...typography.presets.caption,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    }
});
