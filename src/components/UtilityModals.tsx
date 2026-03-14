import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, FlatList, Image, Dimensions, Share, Platform, DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { getTeamColor } from '../utils/teamColors';

const { width } = Dimensions.get('window');

interface BasicModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
}

// 1. Team Members Modal
interface TeamMembersModalProps extends BasicModalProps {
    teamName: string;
}

const MOCK_ROSTER = [
    { name: 'Manish P.', role: 'Captain / All-Rounder', stats: '455 Runs, 8 Wkts', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100' },
    { name: 'Aryan S.', role: 'Strike Bowler', stats: '18 Wickets (Avg 15.4)', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100' },
    { name: 'Rahul S.', role: 'Wicket Keeper', stats: '412 Runs, 12 Dismissals', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
    { name: 'Vikram A.', role: 'Top Order Batsman', stats: '388 Runs (SR 142)', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
];

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({ visible, onClose, teamName, title }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>{title || 'Team Roster'}</Text>
                        <Text style={[styles.headerSubtitle, { color: getTeamColor(teamName) }]}>{teamName}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={MOCK_ROSTER}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <View style={styles.rosterCard}>
                            <Image source={{ uri: item.image }} style={styles.memberAvatar} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{item.name}</Text>
                                <Text style={styles.memberRole}>{item.role}</Text>
                                <Text style={styles.memberStats}>{item.stats}</Text>
                            </View>
                            <TouchableOpacity style={styles.profileIndicator}>
                                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={styles.scrollPadding}
                />
            </View>
        </View>
    </Modal>
);

// 2. Training Drills Modal
const MOCK_DRILLS = [
    { title: 'Perfect Cover Drive', coach: 'Rajesh K.', level: 'Advanced', thumb: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400' },
    { title: 'Death Over Bowling', coach: 'Aryan S.', level: 'Expert', thumb: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400' },
    { title: 'Fielder Reflexes', coach: 'Coach Nitin', level: 'Pro', thumb: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400' },
];

export const TrainingDrillsModal: React.FC<BasicModalProps> = ({ visible, onClose }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Training Center</Text>
                        <Text style={styles.headerSubtitle}>Master your skills</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollPadding}>
                    {MOCK_DRILLS.map((drill, idx) => (
                        <TouchableOpacity key={idx} style={styles.drillCard}>
                            <Image source={{ uri: drill.thumb }} style={styles.drillThumb} />
                            <View style={styles.drillOverlay}>
                                <View style={styles.levelBadge}>
                                    <Text style={styles.levelText}>{drill.level}</Text>
                                </View>
                                <Ionicons name="play-circle" size={48} color="white" />
                            </View>
                            <View style={styles.drillMeta}>
                                <Text style={styles.drillTitle}>{drill.title}</Text>
                                <Text style={styles.drillCoach}>with {drill.coach}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 3. Compare Stats Modal
export const CompareStatsModal: React.FC<BasicModalProps> = ({ visible, onClose }) => (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={[styles.modalContent, { height: '60%' }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Stat Comparison</Text>
                        <Text style={styles.headerSubtitle}>Manish P. vs Rahul S.</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.comparisonContainer}>
                    {[
                        { label: 'Batting Avg', val1: 65.4, val2: 51.2 },
                        { label: 'Strike Rate', val1: 142.5, val2: 135.2 },
                        { label: 'Fifties', val1: 4, val2: 3 },
                        { label: 'Sixes', val1: 12, val2: 15 },
                    ].map((stat, idx) => (
                        <View key={idx} style={styles.statComparisonRow}>
                            <Text style={styles.compLabel}>{stat.label}</Text>
                            <View style={styles.compBarWrapper}>
                                <View style={[styles.compBar, { width: `${(stat.val1 / (stat.val1 + stat.val2)) * 100}%` as DimensionValue, backgroundColor: colors.primary }]} />
                                <View style={[styles.compBar, { width: `${(stat.val2 / (stat.val1 + stat.val2)) * 100}%` as DimensionValue, backgroundColor: '#F97316' }]} />
                            </View>
                            <View style={styles.compValues}>
                                <Text style={[styles.compVal, { color: colors.primary }]}>{stat.val1}</Text>
                                <Text style={[styles.compVal, { color: '#F97316' }]}>{stat.val2}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    </Modal>
);

// 4. Share Modal
export const UniversalShareModal: React.FC<BasicModalProps> = ({ visible, onClose, title }) => {
    const onShare = async () => {
        try {
            await Share.share({
                message: `Check out this match on CricPro: ${title}! Join the action on the app.`,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.shareSheet}>
                    <View style={styles.shareHeader}>
                        <Text style={styles.shareTitle}>Share Performance</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewCard}>
                        <Text style={styles.previewTitle}>{title}</Text>
                        <View style={styles.previewVisual}>
                            <Ionicons name="trophy" size={40} color="#FBBF24" />
                            <Text style={styles.previewCaption}>Match Performance Card Generated</Text>
                        </View>
                    </View>

                    <View style={styles.shareButtons}>
                        <TouchableOpacity style={[styles.shareAction, { backgroundColor: '#25D366' }]} onPress={onShare}>
                            <Ionicons name="logo-whatsapp" size={28} color="white" />
                            <Text style={styles.shareActionText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.shareAction, { backgroundColor: '#E1306C' }]} onPress={onShare}>
                            <Ionicons name="logo-instagram" size={28} color="white" />
                            <Text style={styles.shareActionText}>Story</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.shareAction, { backgroundColor: colors.primary }]} onPress={onShare}>
                            <Ionicons name="paper-plane" size={28} color="white" />
                            <Text style={styles.shareActionText}>Network</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// 5. Match Video Modal
export const MatchVideoModal: React.FC<BasicModalProps> = ({ visible, onClose, subtitle }) => (
    <Modal animationType="fade" visible={visible} onRequestClose={onClose}>
        <View style={styles.videoPlayerContainer}>
            <View style={styles.videoTopHeader}>
                <TouchableOpacity onPress={onClose} style={styles.videoCloseBtn}>
                    <Ionicons name="chevron-down" size={32} color="white" />
                </TouchableOpacity>
                <Text style={styles.videoHeaderTitle}>{subtitle || 'Match Replay'}</Text>
                <TouchableOpacity style={styles.videoCloseBtn}>
                    <Ionicons name="tv-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.videoContent}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800' }}
                    style={styles.fullScreenVideoPlaceholder}
                />
                <View style={styles.videoCenterControls}>
                    <Ionicons name="play" size={80} color="rgba(255,255,255,0.8)" />
                </View>

                <View style={styles.videoBottomControls}>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                        <View style={styles.progressHandle} />
                    </View>
                    <View style={styles.controlRow}>
                        <View style={styles.leftControls}>
                            <Ionicons name="play-skip-back" size={24} color="white" />
                            <Ionicons name="pause" size={28} color="white" style={{ marginHorizontal: 20 }} />
                            <Ionicons name="play-skip-forward" size={24} color="white" />
                            <Text style={styles.videoTime}>02:45 / 15:00</Text>
                        </View>
                        <Ionicons name="expand" size={24} color="white" />
                    </View>
                </View>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        height: '80%',
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
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    scrollPadding: {
        padding: spacing.md,
    },
    // Roster Styles
    rosterCard: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceHighlight,
    },
    memberInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    memberName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    memberRole: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 2,
    },
    memberStats: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: 4,
    },
    profileIndicator: {
        padding: spacing.xs,
    },
    // Drill Styles
    drillCard: {
        backgroundColor: colors.background,
        borderRadius: radius.xl,
        overflow: 'hidden',
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
    },
    drillThumb: {
        width: '100%',
        height: 180,
    },
    drillOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    levelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    drillMeta: {
        padding: spacing.md,
    },
    drillTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    drillCoach: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    // Comparison Styles
    comparisonContainer: {
        padding: spacing.lg,
    },
    statComparisonRow: {
        marginBottom: spacing.xl,
    },
    compLabel: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginBottom: 8,
    },
    compBarWrapper: {
        height: 12,
        flexDirection: 'row',
        backgroundColor: colors.surfaceHighlight,
        borderRadius: 6,
        overflow: 'hidden',
    },
    compBar: {
        height: '100%',
    },
    compValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    compVal: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Share Sheet Styles
    shareSheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        padding: spacing.xl,
    },
    shareHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    shareTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    previewCard: {
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        marginBottom: spacing.xl,
    },
    previewTitle: {
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    previewVisual: {
        alignItems: 'center',
    },
    previewCaption: {
        fontSize: 11,
        color: colors.text.tertiary,
        marginTop: 10,
    },
    shareButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: spacing.lg,
    },
    shareAction: {
        width: (width - spacing.xl * 2) / 3.3,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    shareActionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
    },
    // Video Player Styles
    videoPlayerContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoTopHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        zIndex: 10,
    },
    videoCloseBtn: {
        padding: spacing.sm,
    },
    videoHeaderTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    videoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    fullScreenVideoPlaceholder: {
        width: '100%',
        height: 250,
        opacity: 0.6,
    },
    videoCenterControls: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -40,
        marginLeft: -40,
    },
    videoBottomControls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.lg,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 20,
        position: 'relative',
    },
    progressFill: {
        width: '35%',
        height: '100%',
        backgroundColor: colors.primary,
    },
    progressHandle: {
        position: 'absolute',
        left: '35%',
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: 'white',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    videoTime: {
        color: 'white',
        fontSize: 12,
        marginLeft: 20,
    }
});
