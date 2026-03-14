import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';

const { width } = Dimensions.get('window');

const AWARDS = [
    { id: '1', title: 'Centurion', desc: 'Score 100+ runs in a single match.', icon: 'medal', color: '#F59E0B', earned: true },
    { id: '2', title: 'Five-fer Hunter', desc: 'Take 5 wickets in a single match.', icon: 'bowling', color: '#EF4444', earned: true },
    { id: '3', title: 'Finisher', desc: 'Win 10 matches by finishing in the last over.', icon: 'fist', color: '#10B981', earned: false },
    { id: '4', title: 'Iron Hands', desc: 'Take 50 catches in documented matches.', icon: 'hand-okay', color: '#3B82F6', earned: true },
    { id: '5', title: 'Rising Star', desc: 'Reach 1,000 runs in a calendar year.', icon: 'star', color: '#8B5CF6', earned: false },
    { id: '6', title: 'Team Player', desc: 'Provide 20+ assists or run-outs.', icon: 'account-group', color: '#EC4899', earned: true },
];

export const AwardsScreen: React.FC = () => {
    const earnedCount = AWARDS.filter(a => a.earned).length;

    const renderAward = ({ item }: { item: typeof AWARDS[0] }) => (
        <View style={[styles.awardCard, !item.earned && styles.lockedCard]}>
            <View style={[styles.iconBox, { backgroundColor: item.earned ? item.color + '15' : '#3F3F46' }]}>
                <MaterialCommunityIcons
                    name={item.icon as any}
                    size={32}
                    color={item.earned ? item.color : '#71717A'}
                />
            </View>
            <Text style={[styles.awardTitle, !item.earned && styles.lockedText]}>{item.title}</Text>
            <Text style={styles.awardDesc}>{item.desc}</Text>
            {!item.earned && (
                <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={10} color="#FFF" />
                    <Text style={styles.lockBadgeText}>LOCKED</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="CricPro Awards" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stats Summary Area */}
                <View style={styles.summaryArea}>
                    <View style={styles.progressCircle}>
                        <Text style={styles.progressNum}>{earnedCount}</Text>
                        <Text style={styles.progressLabel}>Awards Earned</Text>
                    </View>
                    <View style={styles.summaryText}>
                        <Text style={styles.summaryTitle}>Achievements Unlocked</Text>
                        <Text style={styles.summarySub}>Keep playing professionally to unlock elite badges and rewards.</Text>
                    </View>
                </View>

                {/* Awards Grid */}
                <View style={styles.gridSection}>
                    <Text style={styles.sectionTitle}>Your Milestones</Text>
                    <FlatList
                        data={AWARDS}
                        renderItem={renderAward}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                </View>

                {/* Pro Reward Placeholder */}
                <View style={styles.rewardCard}>
                    <Ionicons name="gift" size={40} color="#FBBF24" />
                    <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>Special Reward Waiting!</Text>
                        <Text style={styles.rewardDesc}>Unlock 10 awards to get a 20% discount coupon for CricPro Store.</Text>
                    </View>
                </View>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    summaryArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: '#2C2C2E',
        margin: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    progressCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        borderColor: '#005CE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.xl,
    },
    progressNum: {
        ...typography.presets.h2,
        color: '#FFF',
    },
    progressLabel: {
        fontSize: 8,
        color: '#A1A1AA',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    summaryText: {
        flex: 1,
    },
    summaryTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: 'bold',
        color: '#FFF',
    },
    summarySub: {
        ...typography.presets.caption,
        color: '#71717A',
        marginTop: 4,
    },
    gridSection: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: '#FFF',
        marginBottom: spacing.xl,
        paddingHorizontal: 4,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    awardCard: {
        width: (width - spacing.lg * 2 - spacing.lg) / 2,
        backgroundColor: '#2C2C2E',
        padding: spacing.xl,
        borderRadius: radius.xl,
        marginBottom: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    lockedCard: {
        opacity: 0.6,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    awardTitle: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    lockedText: {
        color: '#71717A',
    },
    awardDesc: {
        fontSize: 10,
        color: '#71717A',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 14,
    },
    lockBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3F3F46',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lockBadgeText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 4,
    },
    rewardCard: {
        margin: spacing.lg,
        padding: spacing.xl,
        backgroundColor: '#1E1B4B',
        borderRadius: radius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#312E81',
    },
    rewardInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    rewardTitle: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#FBBF24',
    },
    rewardDesc: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        marginTop: 2,
    },
});
