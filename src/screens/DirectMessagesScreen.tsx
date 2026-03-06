import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';

// Advanced feature Tabs requested by User
const MESSAGE_TABS = ['Direct', 'Team Discussions'];

// Dummy data mirroring the provided screenshot with added advanced features
const DUMMY_MESSAGES = [
    {
        id: '1',
        sender: 'Sarthak Mohapatra',
        message: 'Congrats Sarthak Mohapatra on unlocking th...',
        time: '07/02',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        isMedia: true, // For the picture icon seen in screenshot
        unread: 0,
    },
    {
        id: '2',
        sender: 'Karthik Shetti',
        message: 'Hello',
        time: '15/05',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        isMedia: false,
        unread: 0,
    },
    {
        id: '3',
        sender: 'Sudesh',
        message: 'Heelo Sudesh This is Nilesh from playtm cricket. ...',
        time: '08/01',
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        isMedia: false,
        unread: 0,
    }
];

export const DirectMessagesScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Direct');

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const renderMessageItem = ({ item }: { item: typeof DUMMY_MESSAGES[0] }) => (
        <TouchableOpacity style={styles.messageItem} activeOpacity={0.7}>
            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            <View style={styles.messageContent}>
                <View style={styles.messageHeaderRow}>
                    <Text style={styles.senderName}>{item.sender}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.messageSnippetRow}>
                    {item.isMedia && (
                        <Ionicons name="image-outline" size={14} color="#10B981" style={styles.mediaIcon} /> // Green landscape icon from screenshot
                    )}
                    <Text style={styles.messageSnippet} numberOfLines={1}>
                        {item.message}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header replicating screenshot */}
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Direct messages (dm)</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="add" size={28} color={colors.text.inverse} />
                </TouchableOpacity>
            </View>

            {/* Advanced Team Discussion Tabs */}
            <View style={styles.advancedTabsContainer}>
                {MESSAGE_TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.advancedTab, activeTab === tab && styles.advancedTabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.advancedTabText, activeTab === tab && styles.advancedTabTextActive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sub-Header Toolbar (All Bubble & Requests) */}
            <View style={styles.toolbarRow}>
                <View style={styles.allBubble}>
                    <Text style={styles.allBubbleText}>All</Text>
                </View>

                <TouchableOpacity style={styles.requestsButton}>
                    <Text style={styles.requestsText}>Requests</Text>
                    <View style={styles.requestsBadge}>
                        <Text style={styles.requestsBadgeText}>1</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                data={DUMMY_MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // White background
    },
    header: {
        backgroundColor: '#005CE6', // Exact blue from design
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
        paddingHorizontal: spacing.sm,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        flex: 1,
        marginLeft: spacing.sm,
    },
    iconButton: {
        padding: spacing.sm,
    },
    advancedTabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    advancedTab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    advancedTabActive: {
        borderBottomColor: '#005CE6',
    },
    advancedTabText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    advancedTabTextActive: {
        color: '#005CE6',
        fontWeight: typography.weights.bold,
    },
    toolbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // very light line from screenshot
    },
    allBubble: {
        backgroundColor: '#F97316', // Orange bubble
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
    },
    allBubbleText: {
        ...typography.presets.caption,
        color: colors.text.inverse,
        fontWeight: typography.weights.medium,
    },
    requestsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requestsText: {
        ...typography.presets.caption,
        color: '#DC2626', // Red color for request text
        fontWeight: typography.weights.bold,
        marginRight: spacing.xs,
    },
    requestsBadge: {
        backgroundColor: '#DC2626',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    requestsBadgeText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    messageItem: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: spacing.md,
        backgroundColor: '#E4E4E7',
    },
    messageContent: {
        flex: 1,
        justifyContent: 'center',
    },
    messageHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    senderName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    timeText: {
        ...typography.presets.caption,
        color: '#A1A1AA', // Grey date color
        fontSize: 11,
    },
    messageSnippetRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mediaIcon: {
        marginRight: 4,
    },
    messageSnippet: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        flex: 1,
    }
});
