import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';

export const GoLiveScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Go Live" showBack />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Visual Header */}
                <View style={styles.liveBanner}>
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>READY FOR ACTION</Text>
                    </View>
                    <Text style={styles.bannerTitle}>Broadcast Your Game</Text>
                    <Text style={styles.bannerSub}>Share real-time moments with the CricPro community.</Text>
                </View>

                {/* Action Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>CHOOSE BROADCAST TYPE</Text>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialCommunityIcons name="scoreboard" size={32} color="#EF4444" />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Live Scoreboard</Text>
                            <Text style={styles.cardDesc}>Broadcast ball-by-ball updates of your local match.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#52525B" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                            <MaterialCommunityIcons name="video-wireless" size={32} color="#0EA5E9" />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Live Stream</Text>
                            <Text style={styles.cardDesc}>Stream high-quality video directly from your phone.</Text>
                        </View>
                        <View style={styles.comingSoon}>
                            <Text style={styles.comingSoonText}>SOON</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Previous Broadcasts Placeholder */}
                <View style={styles.historySection}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Recent Sessions</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.emptyHistory}>
                        <Ionicons name="videocam-off-outline" size={48} color="#52525B" />
                        <Text style={styles.emptyHistoryText}>No recent live sessions found.</Text>
                        <Text style={styles.emptyHistorySub}>Your previous broadcasts will appear here.</Text>
                    </View>
                </View>

                <View style={styles.tipsBox}>
                    <View style={styles.tipsHeader}>
                        <Ionicons name="bulb-outline" size={20} color="#FBBF24" />
                        <Text style={styles.tipsTitle}>Pro Tips for Streaming</Text>
                    </View>
                    <Text style={styles.tipsDesc}>
                        • Ensure a stable internet connection for high-quality video.{"\n"}
                        • Use a tripod to keep the scoreboard steady.{"\n"}
                        • Engage with your viewers in the live chat!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    liveBanner: {
        padding: spacing.xl,
        backgroundColor: '#2C2C2E',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        alignItems: 'center',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        marginBottom: spacing.md,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    liveText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10B981',
        letterSpacing: 1,
    },
    bannerTitle: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        textAlign: 'center',
    },
    bannerSub: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        textAlign: 'center',
        marginTop: 4,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionLabel: {
        ...typography.presets.caption,
        color: '#71717A',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: spacing.md,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: 'bold',
        color: colors.text.inverse,
    },
    cardDesc: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        marginTop: 2,
    },
    comingSoon: {
        backgroundColor: '#3F3F46',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    comingSoonText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#A1A1AA',
    },
    historySection: {
        marginTop: spacing.xl,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    historyTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
    },
    seeAll: {
        ...typography.presets.caption,
        color: '#005CE6',
        fontWeight: 'bold',
    },
    emptyHistory: {
        backgroundColor: '#2C2C2E',
        padding: spacing.xl,
        borderRadius: radius.lg,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    emptyHistoryText: {
        ...typography.presets.body,
        color: colors.text.inverse,
        marginTop: spacing.md,
        fontWeight: 'bold',
    },
    emptyHistorySub: {
        ...typography.presets.caption,
        color: '#71717A',
        marginTop: 4,
    },
    tipsBox: {
        marginTop: spacing.xxl,
        padding: spacing.lg,
        backgroundColor: '#3A3A3C',
        borderRadius: radius.md,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    tipsTitle: {
        ...typography.presets.bodySmall,
        fontWeight: 'bold',
        color: '#FBBF24',
        marginLeft: 8,
    },
    tipsDesc: {
        ...typography.presets.caption,
        color: '#D1D5DB',
        lineHeight: 18,
    },
});
