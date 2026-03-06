import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Animated,
    PanResponder,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
}

const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Match Started',
        message: 'Your team "Mighty Meteors" just started their match. Follow live now!',
        time: '2 mins ago',
        isRead: false,
        icon: 'notifications-circle'
    },
    {
        id: '2',
        title: 'New Tournament Invite',
        message: 'You have been invited to join "Hades Big Bash 5.0". Accept now?',
        time: '1 hour ago',
        isRead: false,
        icon: 'trophy'
    },
    {
        id: '3',
        title: 'Weekly Stats Are In',
        message: 'Check out your performance stats for the past week. You scored 150 runs!',
        time: 'Yesterday',
        isRead: true,
        icon: 'stats-chart'
    },
    {
        id: '4',
        title: 'System Update',
        message: 'App has been updated with new features and improvements.',
        time: '2 days ago',
        isRead: true,
        icon: 'information-circle'
    }
];

// Individual Swipeable Item Component
const SwipeableNotification = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only capture horizontal movements
                return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                // If swiped far enough left or right
                if (Math.abs(gestureState.dx) > 120) {
                    Animated.timing(pan.x, {
                        toValue: gestureState.dx > 0 ? 500 : -500, // slide out completely
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        // Trigger deletion, LayoutAnimation handles the gap closing
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        onRemove(item.id);
                    });
                } else {
                    // Spring back to center
                    Animated.spring(pan.x, {
                        toValue: 0,
                        useNativeDriver: false,
                        bounciness: 10,
                    }).start();
                }
            },
        })
    ).current;

    // Use absolute positioning for the background delete colors based on swipe direction if desired, 
    // but a simple fade-out translates wonderfully in light theme without red backgrounds.
    const opacity = pan.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View style={{ opacity, transform: [{ translateX: pan.x }] }} {...panResponder.panHandlers}>
            <TouchableOpacity style={[styles.notificationCard, !item.isRead && styles.unreadCard]} activeOpacity={0.9}>
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon as any} size={28} color={item.isRead ? colors.text.secondary : colors.primary} />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        </Animated.View>
    );
};


export const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    // Reset when modal opens if we wanted to fake live updates, but letting them persist for now
    useEffect(() => {
        if (!visible) {
            // Optional: reset notifications after closing for demo purposes so user can see them again
            // setTimeout(() => setNotifications(INITIAL_NOTIFICATIONS), 500);
        }
    }, [visible]);

    const handleRemoveItem = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleClearAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications([]);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.touchableOverlay}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Notifications</Text>

                        <View style={styles.headerActions}>
                            {notifications.length > 0 && (
                                <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                                    <Text style={styles.clearAllText}>Clear All</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* List */}
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <SwipeableNotification item={item} onRemove={handleRemoveItem} />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="notifications-off-outline" size={48} color={colors.text.secondary} />
                                <Text style={styles.emptyText}>No notifications right now.</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    touchableOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        position: 'absolute',
        top: 65,
        right: spacing.md,
        width: 320,
        maxHeight: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden', // Contain list when swiped out
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearAllBtn: {
        marginRight: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: '#FFF0E6', // Light accent
        borderRadius: 12,
    },
    clearAllText: {
        ...typography.presets.caption,
        color: colors.accent,
        fontWeight: typography.weights.bold,
    },
    closeButton: {
        padding: spacing.xs,
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxl,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    unreadCard: {
        backgroundColor: '#F0F5FF',
        borderColor: '#D6E4FF',
    },
    iconContainer: {
        marginRight: spacing.md,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    message: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        lineHeight: 18,
        marginBottom: 4,
    },
    time: {
        ...typography.presets.caption,
        fontSize: 10,
        color: colors.text.tertiary,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        alignSelf: 'center',
        marginLeft: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xxl * 2,
    },
    emptyText: {
        ...typography.presets.body,
        color: colors.text.secondary,
        marginTop: spacing.md,
    }
});
