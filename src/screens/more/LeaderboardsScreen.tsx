import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';

const { width } = Dimensions.get('window');

const PLAYER_LEADERBOARD = [
    { id: '1', name: 'Roman Saini', team: 'Mighty Meteors', pts: '2,450', rank: 1, avatar: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '2', name: 'Virat K', team: 'Super Kings', pts: '2,320', rank: 2, avatar: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '3', name: 'Babar A', team: 'Mighty Meteors', pts: '2,180', rank: 3, avatar: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '4', name: 'Ben S', team: 'Royal Challengers', pts: '2,050', rank: 4, avatar: 'https://images.unsplash.com/photo-1510511459019-5deeee71216a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '5', name: 'Sharma', team: 'Royal Challengers', pts: '1,980', rank: 5, avatar: 'https://images.unsplash.com/photo-1624526267942-ab0c09b83b8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 'self', name: 'Siddhant V', team: 'HSR Lions', pts: '1,240', rank: 124, avatar: null },
];

const TEAM_LEADERBOARD = [
    { id: '1', name: 'Mighty Meteors', won: 12, pts: '240', rank: 1, logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '2', name: 'Super Kings', won: 10, pts: '200', rank: 2, logo: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc02?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '3', name: 'Thunderbolts', won: 9, pts: '180', rank: 3, logo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
];

export const LeaderboardsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Players' | 'Teams'>('Players');

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.rankItem, item.id === 'self' && styles.selfItem]}>
            <View style={styles.rankLeft}>
                <Text style={[styles.rankNumber, item.rank <= 3 && styles.topRank]}>{item.rank}</Text>
                {item.avatar || item.logo ? (
                    <Image source={{ uri: (item.avatar || item.logo) as string }} style={styles.itemImage} />
                ) : (
                    <View style={styles.itemPlaceholder}>
                        <Text style={styles.placeholderText}>{item.name[0]}</Text>
                    </View>
                )}
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.team || `Wins: ${item.won}`}</Text>
                </View>
            </View>
            <View style={styles.rankRight}>
                <Text style={styles.pointsText}>{item.pts}</Text>
                <Text style={styles.ptsLabel}>PTS</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Leaderboards" showBack />

            {/* Custom Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Players' && styles.activeTab]}
                    onPress={() => setActiveTab('Players')}
                >
                    <Text style={[styles.tabText, activeTab === 'Players' && styles.activeTabText]}>Players</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Teams' && styles.activeTab]}
                    onPress={() => setActiveTab('Teams')}
                >
                    <Text style={[styles.tabText, activeTab === 'Teams' && styles.activeTabText]}>Teams</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeTab === 'Players' ? PLAYER_LEADERBOARD : TEAM_LEADERBOARD}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        <View style={styles.podiumContainer}>
                            {/* 2nd Place */}
                            <View style={[styles.podiumItem, { height: 140 }]}>
                                <Image source={{ uri: PLAYER_LEADERBOARD[1].avatar || undefined }} style={[styles.podiumAvatar, { borderColor: '#94A3B8' }]} />
                                <View style={[styles.podiumBase, { backgroundColor: '#475569' }]}>
                                    <Text style={styles.podiumRank}>2</Text>
                                </View>
                                <Text style={styles.podiumName} numberOfLines={1}>{PLAYER_LEADERBOARD[1].name}</Text>
                            </View>

                            {/* 1st Place */}
                            <View style={[styles.podiumItem, { height: 180 }]}>
                                <View style={styles.crown}>
                                    <MaterialCommunityIcons name="crown" size={24} color="#FBBF24" />
                                </View>
                                <Image source={{ uri: PLAYER_LEADERBOARD[0].avatar || undefined }} style={[styles.podiumAvatar, { width: 80, height: 80, borderRadius: 40, borderColor: '#FBBF24' }]} />
                                <View style={[styles.podiumBase, { backgroundColor: '#F59E0B' }]}>
                                    <Text style={styles.podiumRank}>1</Text>
                                </View>
                                <Text style={styles.podiumName} numberOfLines={1}>{PLAYER_LEADERBOARD[0].name}</Text>
                            </View>

                            {/* 3rd Place */}
                            <View style={[styles.podiumItem, { height: 120 }]}>
                                <Image source={{ uri: PLAYER_LEADERBOARD[2].avatar || undefined }} style={[styles.podiumAvatar, { borderColor: '#B45309' }]} />
                                <View style={[styles.podiumBase, { backgroundColor: '#78350F' }]}>
                                    <Text style={styles.podiumRank}>3</Text>
                                </View>
                                <Text style={styles.podiumName} numberOfLines={1}>{PLAYER_LEADERBOARD[2].name}</Text>
                            </View>
                        </View>
                    </View>
                }
            />

            {/* Sticky Current User Rank */}
            {activeTab === 'Players' && (
                <View style={styles.stickyUserRank}>
                    <View style={styles.rankLeft}>
                        <Text style={styles.stickyRankNum}>124</Text>
                        <View style={[styles.itemPlaceholder, { backgroundColor: '#005CE6' }]}>
                            <Text style={styles.placeholderText}>SV</Text>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>Siddhant V (You)</Text>
                            <Text style={styles.itemSub}>Improve stats to rank up!</Text>
                        </View>
                    </View>
                    <View style={styles.rankRight}>
                        <Text style={styles.pointsText}>1,240</Text>
                        <Text style={styles.ptsLabel}>PTS</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    tabBar: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: '#2C2C2E',
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        borderRadius: radius.md,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: radius.sm,
    },
    activeTab: {
        backgroundColor: '#005CE6',
    },
    tabText: {
        ...typography.presets.bodySmall,
        fontWeight: 'bold',
        color: '#71717A',
    },
    activeTabText: {
        color: '#FFF',
    },
    listContent: {
        paddingBottom: 100,
    },
    headerSection: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 220,
        width: width - spacing.xl * 2,
    },
    podiumItem: {
        width: (width - 60) / 3,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    podiumAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        marginBottom: 8,
    },
    podiumBase: {
        width: '80%',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
    },
    podiumRank: {
        ...typography.presets.h3,
        color: '#FFF',
    },
    podiumName: {
        ...typography.presets.caption,
        color: '#FFF',
        marginTop: 8,
        fontWeight: 'bold',
    },
    crown: {
        marginBottom: -10,
        zIndex: 1,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    selfItem: {
        backgroundColor: 'rgba(0, 92, 230, 0.05)',
    },
    rankLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rankNumber: {
        ...typography.presets.bodySmall,
        fontWeight: 'bold',
        color: '#71717A',
        width: 30,
    },
    topRank: {
        color: '#FBBF24',
        fontSize: 16,
    },
    itemImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: spacing.md,
    },
    itemPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#3F3F46',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    placeholderText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: colors.text.inverse,
    },
    itemSub: {
        ...typography.presets.caption,
        color: '#71717A',
        marginTop: 2,
    },
    rankRight: {
        alignItems: 'flex-end',
    },
    pointsText: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#FFF',
    },
    ptsLabel: {
        fontSize: 9,
        color: '#71717A',
        letterSpacing: 1,
    },
    stickyUserRank: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2C2C2E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#3A3A3C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    stickyRankNum: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#005CE6',
        width: 30,
    },
});
