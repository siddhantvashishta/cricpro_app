import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { getTeamColor } from '../utils/teamColors';

interface LeaderboardModalProps {
    visible: boolean;
    onClose: () => void;
    tournamentName: string;
}

const TOP_SCORERS = [
    { id: '1', name: 'Manish P.', team: 'Gladiators', runs: 455, avg: 65.0, sr: 142.5, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100' },
    { id: '2', name: 'Rahul S.', team: 'Titans', runs: 412, avg: 51.5, sr: 135.2, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100' },
    { id: '3', name: 'Vikram A.', team: 'Men in Blue', runs: 388, avg: 48.5, sr: 128.8, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
];

const TOP_WICKET_TAKERS = [
    { id: '1', name: 'Aryan S.', team: 'Gladiators', wkts: 18, eco: 6.2, avg: 15.4, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
    { id: '2', name: 'Nitin K.', team: 'Eagles', wkts: 15, eco: 7.5, avg: 18.2, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100' },
    { id: '3', name: 'Sam V.', team: 'Titans', wkts: 14, eco: 6.8, avg: 16.5, image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ visible, onClose, tournamentName }) => {
    const [activeType, setActiveType] = useState<'Runs' | 'Wickets'>('Runs');

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.leaderboardCard}>
            <View style={styles.rankContainer}>
                <Text style={[styles.rankText, index === 0 && styles.topRankText]}>{index + 1}</Text>
                {index === 0 && <Ionicons name="trophy" size={14} color="#FBBF24" style={styles.trophyIcon} />}
            </View>

            <Image source={{ uri: item.image }} style={styles.playerImage} />

            <View style={styles.playerMeta}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={[styles.teamName, { color: getTeamColor(item.team) }]}>{item.team}</Text>
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.statValue}>{activeType === 'Runs' ? item.runs : item.wkts}</Text>
                <Text style={styles.statLabel}>{activeType === 'Runs' ? 'Runs' : 'Wkts'}</Text>
            </View>

            <View style={styles.secondaryStats}>
                <Text style={styles.secondaryVal}>
                    {activeType === 'Runs' ? `SR: ${item.sr}` : `Eco: ${item.eco}`}
                </Text>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Leaderboard</Text>
                            <Text style={styles.headerSubtitle}>{tournamentName || 'Tournament Top Performers'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeType === 'Runs' && styles.activeTab]}
                            onPress={() => setActiveType('Runs')}
                        >
                            <Text style={[styles.tabText, activeType === 'Runs' && styles.activeTabText]}>Top Scorers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeType === 'Wickets' && styles.activeTab]}
                            onPress={() => setActiveType('Wickets')}
                        >
                            <Text style={[styles.tabText, activeType === 'Wickets' && styles.activeTabText]}>Top Bowlers</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={activeType === 'Runs' ? TOP_SCORERS : TOP_WICKET_TAKERS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerNote}>Updated: Just moments ago</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        height: '75%',
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    headerSubtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: radius.md,
    },
    activeTab: {
        backgroundColor: colors.surface,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tabText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        fontWeight: typography.weights.medium,
    },
    activeTabText: {
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
    listContent: {
        padding: spacing.md,
    },
    leaderboardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
    },
    rankText: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.tertiary,
    },
    topRankText: {
        color: '#FBBF24',
    },
    trophyIcon: {
        marginTop: 2,
    },
    playerImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginHorizontal: spacing.md,
        backgroundColor: colors.surfaceHighlight,
    },
    playerMeta: {
        flex: 1,
    },
    playerName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    teamName: {
        fontSize: 11,
        color: colors.text.tertiary,
    },
    statsContainer: {
        alignItems: 'flex-end',
        marginHorizontal: spacing.md,
    },
    statValue: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: '#F97316',
    },
    statLabel: {
        fontSize: 10,
        color: colors.text.tertiary,
    },
    secondaryStats: {
        width: 50,
        alignItems: 'flex-end',
    },
    secondaryVal: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    footer: {
        padding: spacing.md,
        alignItems: 'center',
    },
    footerNote: {
        fontSize: 10,
        color: colors.text.tertiary,
        fontStyle: 'italic',
    },
});
