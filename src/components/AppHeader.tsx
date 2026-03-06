import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NotificationModal } from './NotificationModal';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

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
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    onMenuPress,
    onSearchPress,
    onChatPress,
    onNotificationPress,
    onRenewPress,
    rightIcons,
}) => {
    const navigation = useNavigation<any>();
    const [isNotificationModalVisible, setNotificationModalVisible] = useState(false);

    // For Android, we use StatusBar.currentHeight to accurately pad the top
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const handleNotificationPress = () => {
        setNotificationModalVisible(true);
        if (onNotificationPress) {
            onNotificationPress();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: statusBarHeight }]}>
            <NotificationModal
                visible={isNotificationModalVisible}
                onClose={() => setNotificationModalVisible(false)}
            />
            {/* Left side: Logo + Renew Button */}
            <View style={styles.leftSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name="shield-checkmark" size={24} color={colors.text.inverse} />
                    <View style={styles.proBadgeMini}>
                        <Text style={styles.proBadgeMiniText}>PRO</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.renewButton} onPress={onRenewPress}>
                    <Text style={styles.renewButtonText}>Renew</Text>
                </TouchableOpacity>
            </View>

            {/* Right side: Search, Chat, Notifications OR custom */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Remove fixed height, let padding and intrinsic content dictate height, or add a minimum height
        minHeight: 60,
        backgroundColor: '#005CE6', // Exact blue from design
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
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
        color: colors.text.inverse,
        fontSize: 8,
        fontWeight: 'bold',
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
        color: colors.text.inverse,
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
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
