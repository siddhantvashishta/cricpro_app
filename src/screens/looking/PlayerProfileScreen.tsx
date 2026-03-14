import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { MOCK_PLAYERS, PlayerProfile } from '../../data/mockPlayers';

// Mock data removed in favor of dynamic lookup from MOCK_PLAYERS

export const PlayerProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { playerId } = (route.params as any) || { playerId: '1' };

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Dynamically look up the player profile
    const profile: PlayerProfile = MOCK_PLAYERS.find(p => p.id === playerId) || MOCK_PLAYERS[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Player Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header Block */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />

                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{profile.name}</Text>
                            {profile.isPro && (
                                <View style={styles.proBadge}>
                                    <Text style={styles.proBadgeText}>PRO</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.role}>{profile.role} • {profile.team}</Text>

                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity style={styles.followBtn}>
                                <Text style={styles.followBtnText}>Follow</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.msgBtn}
                                onPress={() => navigation.navigate('ChatDetail', { name: profile.name, avatar: profile.imageUrl })}
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bio Block */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.bioText}>{profile.bio}</Text>
                </View>

                {/* Batting Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Batting Career</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Matches</Text>
                            <Text style={styles.statValue}>{profile.stats.matches}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Runs</Text>
                            <Text style={styles.statValue}>{profile.stats.runs}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Highest Score</Text>
                            <Text style={styles.statValue}>{profile.stats.highest}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Average</Text>
                            <Text style={styles.statValue}>{profile.stats.average}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Strike Rate</Text>
                            <Text style={styles.statValue}>{profile.stats.strikeRate}</Text>
                        </View>
                    </View>
                </View>

                {/* Bowling Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bowling Career</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Wickets</Text>
                            <Text style={styles.statValue}>{profile.stats.wickets}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Best</Text>
                            <Text style={styles.statValue}>{profile.stats.bestBowling}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Economy</Text>
                            <Text style={styles.statValue}>{profile.stats.economy}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.md,
        paddingTop: spacing.md,
        backgroundColor: colors.primary, // Dark blue header
        justifyContent: 'space-between',
    },
    backButton: {
        padding: spacing.sm,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    profileHeader: {
        flexDirection: 'row',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.border,
        marginRight: spacing.lg,
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        ...typography.presets.h2,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginRight: spacing.sm,
        flexShrink: 1,
    },
    proBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    proBadgeText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: typography.weights.bold,
    },
    role: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        marginBottom: spacing.md,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    followBtn: {
        backgroundColor: '#F97316',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
        marginRight: spacing.md,
    },
    followBtnText: {
        ...typography.presets.body,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    msgBtn: {
        padding: spacing.sm,
        backgroundColor: '#F0F5FF',
        borderRadius: radius.full,
    },
    section: {
        backgroundColor: colors.surface,
        marginTop: spacing.sm,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    bioText: {
        ...typography.presets.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.xs, // offset padding for grid
    },
    statBox: {
        width: '33%',
        padding: spacing.xs,
        marginBottom: spacing.md,
        alignItems: 'center',
    },
    statLabel: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginBottom: 4,
        textAlign: 'center',
    },
    statValue: {
        ...typography.presets.bodyLarge,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    }
});
