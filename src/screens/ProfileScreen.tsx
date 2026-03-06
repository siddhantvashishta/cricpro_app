import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components';
import { colors, spacing, typography, radius } from '../theme';

// Menu items extracted from screenshot
const MENU_ITEMS = [
    { id: '1', title: 'PRO Privileges', icon: 'shield-outline', isMaterial: true },
    { id: '2', title: 'Add a Tournament/Series', icon: 'trophy-outline', badge: 'Free' },
    { id: '3', title: 'Start A Match', icon: 'cricket', isMaterial: true, badge: 'Free' },
    { id: '4', title: 'Go Live', icon: 'videocam-outline' },
    { id: '5', title: 'My Cricket', icon: 'baseball-bat', isMaterial: true, separator: true }, // bat icon

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
    // Dummy state for auth to show user how login/logout would toggle
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const renderMenuItem = (item: typeof MENU_ITEMS[0]) => (
        <React.Fragment key={item.id}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                    {item.isMaterial ? (
                        <MaterialCommunityIcons name={item.icon as any} size={24} color={colors.text.inverse} style={styles.menuIcon} />
                    ) : (
                        <Ionicons name={item.icon as any} size={24} color={colors.text.inverse} style={styles.menuIcon} />
                    )}
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>

                <View style={styles.menuItemRight}>
                    {item.badge && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                    )}
                    {item.rightIcon && (
                        <Ionicons name={item.rightIcon as any} size={18} color="#FBBF24" /> // Yellow shirt icon
                    )}
                </View>
            </TouchableOpacity>

            {item.separator && <View style={styles.separator} />}
        </React.Fragment>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Header Block */}
                <View style={styles.profileHeader}>
                    {isLoggedIn ? (
                        <View style={styles.loggedInContainer}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>SV</Text>
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>Siddhant Vashishta</Text>
                                <Text style={styles.userPhone}>+91 98765 43210</Text>
                                <TouchableOpacity style={styles.editProfileBtn}>
                                    <Text style={styles.editProfileText}>Edit Profile</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => setIsLoggedIn(false)} style={styles.authActionButton}>
                                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.loggedOutContainer}>
                            <Ionicons name="person-circle-outline" size={60} color={colors.text.secondary} />
                            <View style={styles.loggedOutTextContainer}>
                                <Text style={styles.guestTitle}>Guest User</Text>
                                <Text style={styles.guestSub}>Login to track your stats and matches.</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsLoggedIn(true)} style={styles.loginBtn}>
                                <Text style={styles.loginBtnText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Dark Theme Menu List from Screenshot */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map(renderMenuItem)}
                </View>

                {/* App Version Footer */}
                <View style={styles.footer}>
                    <Text style={styles.versionText}>CricPro v1.0.0 (Build 54)</Text>
                    <Text style={styles.madeWithText}>Made with ♥ for Cricket</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E', // Very dark grey/black matching the menu screenshot background
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    profileHeader: {
        backgroundColor: '#2C2C2E', // Slightly lighter dark surface
        padding: spacing.lg,
        marginBottom: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    loggedInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#005CE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.presets.h2,
        color: colors.text.inverse,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        marginBottom: 2,
    },
    userPhone: {
        ...typography.presets.caption,
        color: '#A1A1AA', // Muted text
        marginBottom: spacing.sm,
    },
    editProfileBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#A1A1AA',
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
    editProfileText: {
        ...typography.presets.caption,
        color: '#A1A1AA',
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
        ...typography.presets.h3,
        color: colors.text.inverse,
        marginBottom: 2,
    },
    guestSub: {
        ...typography.presets.caption,
        color: '#A1A1AA',
    },
    loginBtn: {
        backgroundColor: '#005CE6',
        paddingHorizontal: spacing.xl,
        paddingVertical: 10,
        borderRadius: radius.md,
    },
    loginBtnText: {
        ...typography.presets.bodySmall,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    menuContainer: {
        backgroundColor: '#2C2C2E', // Menu panel background
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#3A3A3C',
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
        width: 26, // Fixed width so text aligns perfectly
        textAlign: 'center',
    },
    menuItemTitle: {
        ...typography.presets.body,
        color: colors.text.inverse,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeContainer: {
        backgroundColor: '#52525B', // grey badge
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    badgeText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#3A3A3C',
        marginLeft: 60, // Indent separator under text only
    },
    footer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    versionText: {
        ...typography.presets.caption,
        color: '#52525B', // Dark grey
        marginBottom: 4,
    },
    madeWithText: {
        ...typography.presets.caption,
        color: '#52525B',
    }
});
