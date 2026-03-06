import React, { useState } from 'react';
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
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

export const WritePostScreen: React.FC = () => {
    const navigation = useNavigation();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Form State
    const [postContent, setPostContent] = useState('');

    const handleCreatePost = () => {
        if (!postContent.trim()) {
            Alert.alert('Empty Post', 'Please write something before posting.');
            return;
        }

        // Simulate API call for frontend mockup
        Alert.alert(
            'Posted!',
            'Your thought has been shared with the community.',
            [{ text: 'Great', onPress: () => navigation.goBack() }]
        );
    };

    const attachMedia = () => {
        Alert.alert('Attach Media', 'Opens photo library to attach an image or video.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Write Post</Text>
                <TouchableOpacity
                    style={[styles.postHeaderBtn, !postContent.trim() && styles.postHeaderBtnDisabled]}
                    onPress={handleCreatePost}
                    disabled={!postContent.trim()}
                >
                    <Text style={[styles.postHeaderBtnText, !postContent.trim() && styles.postHeaderBtnTextDisabled]}>POST</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* User Info Bar */}
                    <View style={styles.userInfoRow}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color={colors.text.inverse} />
                        </View>
                        <Text style={styles.userName}>You</Text>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="earth" size={12} color={colors.text.tertiary} />
                            <Text style={styles.privacyBadgeText}>Public</Text>
                        </View>
                    </View>

                    {/* Text Area */}
                    <TextInput
                        style={styles.textArea}
                        placeholder="What's happening in your cricket world?"
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        autoFocus
                        value={postContent}
                        onChangeText={setPostContent}
                    />

                </ScrollView>

                {/* Toolbar Context */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolbarBtn} onPress={attachMedia}>
                        <Ionicons name="image-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolbarBtn}>
                        <Ionicons name="location-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolbarBtn}>
                        <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />
                    <Text style={styles.charCount}>{postContent.length}/280</Text>
                </View>

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
    textArea: {
        ...typography.presets.h3,
        color: colors.text.primary,
        lineHeight: 28,
        textAlignVertical: 'top', // Needed for multiline on Android
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    toolbarBtn: {
        padding: spacing.sm,
        marginRight: spacing.sm,
    },
    charCount: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
    }
});
