import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const { width } = Dimensions.get('window');

interface ExtendedModalProps {
    visible: boolean;
    onClose: () => void;
    data?: any;
    title?: string;
}

// 1. StatsModal
export const StatsModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title || 'Performance Stats'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.statsCard}>
                        <Ionicons name="stats-chart" size={40} color={colors.primary} style={{ marginBottom: spacing.md }} />
                        <Text style={styles.statsTitle}>Deep Analytics for {data?.tournamentName || data?.team1 || 'Match'}</Text>

                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>145.2</Text>
                                <Text style={styles.statLabel}>Strike Rate</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>6.4</Text>
                                <Text style={styles.statLabel}>Economy</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>38.5</Text>
                                <Text style={styles.statLabel}>Average</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>42%</Text>
                                <Text style={styles.statLabel}>Dot Ball %</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 2. AchievementsModal
export const AchievementsModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title || 'Achievements'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {[
                        { icon: 'star', title: 'Man of the Match', desc: 'Awarded in IT Cup 2026 Finals' },
                        { icon: 'flame', title: 'Fastest 50', desc: 'Scored 50 off 22 balls in Weekend Smash' },
                        { icon: 'shield-checkmark', title: 'Best Fielder', desc: '5 catches in a single tournament' },
                    ].map((ach, idx) => (
                        <View key={idx} style={styles.achievementCard}>
                            <View style={styles.achIcon}>
                                <Ionicons name={ach.icon as any} size={32} color="#FBBF24" />
                            </View>
                            <View style={styles.achInfo}>
                                <Text style={styles.achTitle}>{ach.title}</Text>
                                <Text style={styles.achDesc}>{ach.desc}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 3. SocialModal
export const SocialModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my profile and updates on CricPro!`,
            });
        } catch (error) {
            console.error('Error sharing', error);
        }
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { height: 'auto', paddingBottom: spacing.xxl }]}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title || 'Social Profile'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.socialCard}>
                        <Ionicons name="people-circle" size={60} color={colors.primary} />
                        <Text style={styles.socialName}>Community Network</Text>
                        <Text style={styles.socialStats}>142 Connections • 45 Followers</Text>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                            <Ionicons name="share-social" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.actionBtnText}>Share Profile link</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// 4. AwardsModal
export const AwardsModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title || 'Trophy Cabinet'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.awardsGrid}>
                        {[
                            { name: 'Champions Cup', year: '2025' },
                            { name: 'Best Bowler', year: '2024' },
                            { name: 'League Winner', year: '2023' },
                            { name: 'MVP Season', year: '2026' }
                        ].map((award, i) => (
                            <View key={i} style={styles.awardBox}>
                                <Ionicons name="trophy" size={48} color="#FBBF24" />
                                <Text style={styles.awardName}>{award.name}</Text>
                                <Text style={styles.awardYear}>{award.year}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 5. JournalModal
export const JournalModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title || 'Cricket Journal'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.journalEntry}>
                        <Text style={styles.journalDate}>Monday, 10-Mar</Text>
                        <Text style={styles.journalText}>Noticed my footwork was slow against spin today. Need to spend 30 mins in the nets specifically practicing sweep shots and stepping out.</Text>
                    </View>
                    <View style={styles.journalEntry}>
                        <Text style={styles.journalDate}>Friday, 07-Mar</Text>
                        <Text style={styles.journalText}>Great match. The outswingers were landing perfectly. Caught the edge 4 times. Confidence is high for the upcoming finals.</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, height: '70%', paddingBottom: spacing.xxl },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.presets.h2, color: colors.text.primary },
    closeBtn: { padding: spacing.xs },
    scrollContent: { padding: spacing.xl },

    // Stats
    statsCard: { alignItems: 'center', paddingVertical: spacing.lg },
    statsTitle: { fontSize: 16, color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md, width: '100%' },
    statBox: { width: '48%', backgroundColor: colors.background, padding: spacing.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.text.secondary, marginTop: 4 },

    // Achievements
    achievementCard: { flexDirection: 'row', backgroundColor: colors.background, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    achIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.lg },
    achInfo: { flex: 1 },
    achTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 4 },
    achDesc: { fontSize: 13, color: colors.text.secondary, lineHeight: 18 },

    // Social
    socialCard: { alignItems: 'center', padding: spacing.xxl },
    socialName: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginTop: spacing.md },
    socialStats: { fontSize: 14, color: colors.text.secondary, marginTop: spacing.xs, marginBottom: spacing.xl },
    actionBtn: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: radius.full, alignItems: 'center' },
    actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Awards
    awardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.lg },
    awardBox: { width: '47%', backgroundColor: colors.background, padding: spacing.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    awardName: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary, marginTop: spacing.md, textAlign: 'center' },
    awardYear: { fontSize: 12, color: colors.text.tertiary, marginTop: 4 },

    // Journal
    journalEntry: { backgroundColor: colors.background, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.primary },
    journalDate: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
    journalText: { fontSize: 14, color: colors.text.secondary, lineHeight: 22 },
});
