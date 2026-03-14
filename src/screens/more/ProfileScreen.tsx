import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, Image, Share, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';
import { useTheme } from '../../hooks/useTheme';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useAppStore } from '../../store/useAppStore';

import * as StoreReview from 'expo-store-review';

// Menu items extracted from screenshot
// ... (rest of MENU_ITEMS)
const MENU_ITEMS = [
    { id: '1', title: 'PRO Privileges', icon: 'shield-outline', isMaterial: true },
    { id: '2', title: 'Add a Tournament/Series', icon: 'trophy-outline', badge: 'Free' },
    { id: '3', title: 'Start A Match', icon: 'cricket', isMaterial: true, badge: 'Free' },
    { id: '4', title: 'Go Live', icon: 'videocam-outline' },
    { id: '5', 'title': 'My Cricket', icon: 'baseball-bat', isMaterial: true, separator: true }, // bat icon

    { id: '6', title: 'My Performance', icon: 'chart-bar', isMaterial: true },
    { id: '7', title: 'CricPro Store', icon: 'bag-handle-outline', rightIcon: 'shirt' }, // T-shirt right icon
    { id: '8', title: 'Player Leaderboard', icon: 'podium-outline' },
    { id: '9', title: 'Team Leaderboard', icon: 'layers-outline' },
    { id: '10', title: 'CricPro Awards', icon: 'medal-outline', separator: true },

    { id: '11', title: 'Associations', icon: 'share-social-outline' },
    { id: '12', title: 'Clubs', icon: 'business-outline', separator: true },

    { id: '13', title: 'Contact', icon: 'chatbubbles-outline' },
    { id: '14', title: 'Share the app', icon: 'arrow-redo-outline' },
    { id: '15', title: 'Rate us', icon: 'star-outline' },
];

export const ProfileScreen: React.FC = () => {
    const { isAuthenticated, user, logout, updateUserProfile, setHeaderConfig } = useAppStore();
    const { selectedImage: profileImage, pickImage, removeImage } = useImagePicker();
    const { colors, isDark } = useTheme();

    const navigation = useNavigation<any>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'More',
                rightIcons: undefined,
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out CricPro, the ultimate cricket scoring and community app! 🏏 Download now: https://cricpro.app',
                url: 'https://cricpro.app',
                title: 'Share CricPro App',
            });
        } catch (error) {
            console.error('Error sharing app:', error);
        }
    };

    const handleRateUs = async () => {
        if (await StoreReview.isAvailableAsync()) {
            await StoreReview.requestReview();
        }
    };

    const handleMenuItemPress = (item: typeof MENU_ITEMS[0]) => {
        const screenMap: Record<string, string> = {
            'PRO Privileges': 'ProPrivileges',
            'Add a Tournament/Series': 'StartTournament',
            'Start A Match': 'ScheduleMatch',
            'Go Live': 'GoLive',
            'My Cricket': 'My Cricket',
            'My Performance': 'Performance',
            'CricPro Store': 'Store',
            'Player Leaderboard': 'Leaderboards',
            'Team Leaderboard': 'Leaderboards',
            'CricPro Awards': 'Awards',
            'Associations': 'Associations',
            'Clubs': 'Clubs',
            'Contact': 'Contact',
        };

        if (item.title === 'Share the app') {
            handleShare();
            return;
        }

        if (item.title === 'Rate us') {
            handleRateUs();
            return;
        }

        const target = screenMap[item.title];
        if (target) {
            navigation.navigate(target);
        }
    };

    const renderMenuItem = (item: typeof MENU_ITEMS[0]) => (
        <React.Fragment key={item.id}>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuItemPress(item)}
            >
                <View style={styles.menuItemLeft}>
                    {item.isMaterial ? (
                        <MaterialCommunityIcons name={item.icon as any} size={24} color={colors.text.primary} style={styles.menuIcon} />
                    ) : (
                        <Ionicons name={item.icon as any} size={24} color={colors.text.primary} style={styles.menuIcon} />
                    )}
                    <Text style={[styles.menuItemTitle, { color: colors.text.primary }]}>{item.title}</Text>
                </View>

                <View style={styles.menuItemRight}>
                    {item.badge && (
                        <View style={[styles.badgeContainer, { backgroundColor: isDark ? colors.surfaceHighlight : '#F1F5F9' }]}>
                            <Text style={[styles.badgeText, { color: colors.primary }]}>{item.badge}</Text>
                        </View>
                    )}
                    {item.rightIcon && (
                        <Ionicons name={item.rightIcon as any} size={18} color="#FBBF24" /> // Yellow shirt icon
                    )}
                </View>
            </TouchableOpacity>

            {item.separator && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        </React.Fragment>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Profile Header Block */}
                    <View style={[styles.profileHeaderCard, { backgroundColor: colors.surface }]}>
                        {isAuthenticated && user ? (
                            <View style={styles.loggedInContainer}>
                                <TouchableOpacity
                                    style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
                                    activeOpacity={0.8}
                                    onPress={pickImage}
                                >
                                    {profileImage || user.avatar ? (
                                        <Image source={{ uri: profileImage || user.avatar }} style={styles.avatarImage} />
                                    ) : (
                                        <Text style={styles.avatarText}>{user.name.substring(0, 2).toUpperCase()}</Text>
                                    )}
                                    <View style={[styles.editBadge, { backgroundColor: colors.accent, borderColor: colors.surface }]}>
                                        <Ionicons name="camera" size={10} color="#FFFFFF" />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.userInfo}>
                                    <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
                                    <Text style={[styles.userPhone, { color: colors.text.secondary }]}>{user.email}</Text>
                                    <TouchableOpacity style={[styles.editProfileBtn, { borderColor: colors.border }]} onPress={pickImage}>
                                        <Text style={[styles.editProfileText, { color: colors.text.secondary }]}>Update Photo</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => logout()} style={styles.authActionButton}>
                                    <Ionicons name="log-out-outline" size={24} color={colors.error} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.loggedOutContainer}>
                                <Ionicons name="person-circle-outline" size={60} color={colors.text.tertiary} />
                                <View style={styles.loggedOutTextContainer}>
                                    <Text style={[styles.guestTitle, { color: colors.text.primary }]}>Guest User</Text>
                                    <Text style={[styles.guestSub, { color: colors.text.secondary }]}>Login to track your stats and matches.</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.loginBtn, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.loginBtnText}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Dark Theme Menu List */}
                    <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
                        {MENU_ITEMS.map(renderMenuItem)}
                    </View>

                    {/* App Version Footer */}
                    <View style={styles.footer}>
                        <Image
                            source={require('../../../assets/footerlogo.png')}
                            style={[styles.footerLogo, { tintColor: colors.text.tertiary }]}
                            resizeMode="contain"
                        />
                        <Text style={[styles.versionText, { color: colors.text.tertiary }]}>CricPro v1.0.0 (Build 54)</Text>
                        <Text style={[styles.madeWithText, { color: colors.text.tertiary }]}>Made with ♥ for Cricket</Text>
                    </View>

                </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    profileHeaderCard: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.xl,
        // Shadow for premium look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    loggedInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.presets.h2,
        color: '#FFFFFF',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        marginBottom: 2,
    },
    userPhone: {
        ...typography.presets.caption,
        marginBottom: spacing.xs,
    },
    editProfileBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
    editProfileText: {
        fontSize: 10,
        fontWeight: typography.weights.medium,
    },
    authActionButton: {
        padding: spacing.sm,
    },
    loggedOutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loggedOutTextContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },
    guestTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        marginBottom: 2,
    },
    guestSub: {
        ...typography.presets.caption,
    },
    loginBtn: {
        paddingHorizontal: spacing.xl,
        paddingVertical: 10,
        borderRadius: radius.md,
    },
    loginBtnText: {
        ...typography.presets.bodySmall,
        color: '#FFFFFF',
        fontWeight: typography.weights.bold,
    },
    menuCard: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.xs,
        borderRadius: radius.xl,
        // Shadow for premium look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: spacing.lg,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: spacing.lg,
        width: 26,
        textAlign: 'center',
    },
    menuItemTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.medium,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: typography.weights.heavy,
    },
    separator: {
        height: 1,
        marginHorizontal: spacing.xl,
        opacity: 0.1,
    },
    footer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    footerLogo: {
        width: 100,
        height: 50,
        marginBottom: spacing.xs,
        opacity: 0.3,
    },
    versionText: {
        ...typography.presets.caption,
        marginBottom: 2,
        opacity: 0.5,
    },
    madeWithText: {
        ...typography.presets.caption,
        opacity: 0.5,
    }
});
