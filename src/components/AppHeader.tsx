import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NotificationModal } from './NotificationModal';
import { Ionicons } from '@expo/vector-icons';
import { colors as staticColors, spacing, typography, radius } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/useAppStore';

export interface RightIconState {
    name: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    badgeCount?: number;
}

interface AppHeaderProps {
    onMenuPress?: () => void;
    onSearchPress?: () => void;
    onChatPress?: () => void;
    onNotificationPress?: () => void;
    onRenewPress?: () => void;
    rightIcons?: RightIconState[];
    title?: string;
    showBack?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    onMenuPress,
    onSearchPress,
    onChatPress,
    onNotificationPress,
    onRenewPress,
    rightIcons,
    title,
    showBack,
}) => {
    const navigation = useNavigation<any>();
    const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);
    const { colors, themeMode, isDark } = useTheme();
    const { toggleThemeMode, isProMember, setActiveHomeTab } = useAppStore();

    // For Android, we use StatusBar.currentHeight to accurately pad the top
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const handleNotificationPress = () => {
        setNotificationModalVisible(true);
        if (onNotificationPress) {
            onNotificationPress();
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/header.png')}
            style={[styles.container, { paddingTop: statusBarHeight }]}
            resizeMode="cover"
        >
            <NotificationModal
                visible={isNotificationModalVisible}
                onClose={() => setNotificationModalVisible(false)}
            />
            {/* Left side: Logo + Renew Button OR Back + Title */}
            <View style={styles.leftSection}>
                {showBack || title ? (
                    <View style={styles.titleContainer}>
                        {showBack && (
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                            </TouchableOpacity>
                        )}
                        {title && <Text style={styles.headerTitle}>{title}</Text>}
                    </View>
                ) : (
                    <>
                        <Image
                            source={require('../../assets/main_logo.png')}
                            style={styles.mainLogo}
                            resizeMode="contain"
                        />
                        <TouchableOpacity style={styles.renewButton} onPress={() => navigation.navigate('ProClub')}>
                            <Text style={styles.renewButtonText}>Renew</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Right side: Theme Toggle, Search, Chat, Notifications OR custom */}
            <View style={styles.rightSection}>
                {rightIcons ? (
                    rightIcons.map((icon, index) => (
                        <TouchableOpacity key={index} style={styles.iconButton} onPress={icon.onPress}>
                            <View>
                                <Ionicons name={icon.name} size={24} color={colors.text.inverse} />
                                {icon.badgeCount !== undefined && icon.badgeCount > 0 && (
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{icon.badgeCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <>
                        {/* THEME TOGGLE ICON */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={toggleThemeMode}
                        >
                            <Ionicons
                                name={isDark ? "sunny-outline" : "moon-outline"}
                                size={22}
                                color={colors.text.inverse}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onSearchPress ? onSearchPress : () => navigation.navigate('Search')}
                        >
                            <Ionicons name="search" size={24} color={colors.text.inverse} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onChatPress ? onChatPress : () => navigation.navigate('DirectMessages')}
                        >
                            <Ionicons name="chatbox-ellipses-outline" size={24} color={colors.text.inverse} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
                            <View>
                                <Ionicons name="notifications-outline" size={24} color={colors.text.inverse} />
                                {/* Notification Badge */}
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>102</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 120, // Increased height
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md, // Added padding to push elements slightly up and expose more bottom background
        overflow: 'hidden',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: spacing.sm,
    },
    logoContainer: {
        marginHorizontal: spacing.sm,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainLogo: {
        width: 38,
        height: 38,
    },
    headerBannerLogo: {
        width: 180, // Wide banner format
        height: 50,
        marginLeft: -4, // Nudge left to align perfectly with typical padding
    },
    proBadgeMini: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: '#10B981', // green from design
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    proBadgeMiniText: {
        color: staticColors.text.inverse,
        fontSize: 8,
        fontWeight: 'bold',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacing.xs,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerTitle: {
        ...typography.presets.bodyLarge,
        color: staticColors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    renewButton: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: radius.sm,
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
        marginLeft: spacing.sm,
    },
    renewButtonText: {
        color: staticColors.text.inverse,
        ...typography.presets.bodySmall,
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#F97316', // orange from design
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: staticColors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
