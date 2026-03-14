import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface MatchInsightsModalProps {
    visible: boolean;
    onClose: () => void;
    onFullMatchCentre?: () => void;
    matchData: any;
}

const { width } = Dimensions.get('window');

export const MatchInsightsModal: React.FC<MatchInsightsModalProps> = ({ visible, onClose, onFullMatchCentre, matchData }) => {
    if (!matchData) return null;

    const renderFormGuide = (team: string, form: string[]) => (
        <View style={styles.formContainer}>
            <Text style={styles.formLabel}>{team}</Text>
            <View style={styles.formDots}>
                {form.map((res, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.formDot,
                            { backgroundColor: res === 'W' ? '#10B981' : '#EF4444' }
                        ]}
                    >
                        <Text style={styles.formDotText}>{res}</Text>
                    </View>
                ))}
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
                            <Text style={styles.headerTitle}>Match Insights</Text>
                            <Text style={styles.headerSubtitle}>{matchData.team1} vs {matchData.team2}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Win Probability */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Win Probability</Text>
                            <View style={styles.probBar}>
                                <View style={[styles.probFill, { width: '55%', backgroundColor: '#F97316' }]}>
                                    <Text style={styles.probText}>55%</Text>
                                </View>
                                <View style={[styles.probFill, { width: '45%', backgroundColor: '#3B82F6' }]}>
                                    <Text style={styles.probText}>45%</Text>
                                </View>
                            </View>
                            <View style={styles.probLabels}>
                                <Text style={styles.teamLabel}>{matchData.team1}</Text>
                                <Text style={styles.teamLabel}>{matchData.team2}</Text>
                            </View>
                        </View>

                        {/* Form Guide */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Form Guide (Last 5)</Text>
                            {renderFormGuide(matchData.team1, ['W', 'W', 'L', 'W', 'W'])}
                            {renderFormGuide(matchData.team2, ['L', 'W', 'W', 'L', 'L'])}
                        </View>

                        {/* Venue Stats */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Venue Insights ({matchData.location})</Text>
                            <View style={styles.venueGrid}>
                                <View style={styles.venueItem}>
                                    <Text style={styles.venueVal}>168</Text>
                                    <Text style={styles.venueLabel}>Avg 1st Inn</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.venueItem}>
                                    <Text style={styles.venueVal}>60%</Text>
                                    <Text style={styles.venueLabel}>Batting 1st Wins</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.venueItem}>
                                    <Text style={styles.venueVal}>Batting</Text>
                                    <Text style={styles.venueLabel}>Pitch Type</Text>
                                </View>
                            </View>
                        </View>

                        {/* Key Matchup */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Key Player Matchup</Text>
                            <View style={styles.matchupCard}>
                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>Manish P.</Text>
                                    <Text style={styles.playerRole}>Top Batsman</Text>
                                </View>
                                <View style={styles.vsCircle}>
                                    <Text style={styles.vsText}>VS</Text>
                                </View>
                                <View style={styles.playerInfo}>
                                    <Text style={[styles.playerName, { textAlign: 'right' }]}>Aryan S.</Text>
                                    <Text style={[styles.playerRole, { textAlign: 'right' }]}>Strike Bowler</Text>
                                </View>
                            </View>
                            <View style={styles.matchupStats}>
                                <Text style={styles.matchupStatText}>Aryan has dismissed Manish 2 times in 4 innings</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                            onClose();
                            onFullMatchCentre?.();
                        }}
                    >
                        <Text style={styles.actionBtnText}>Full Match Centre</Text>
                    </TouchableOpacity>
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
    },
    closeBtn: {
        padding: spacing.xs,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    probBar: {
        height: 32,
        flexDirection: 'row',
        borderRadius: radius.full,
        overflow: 'hidden',
    },
    probFill: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    probText: {
        color: colors.text.inverse,
        fontSize: 12,
        fontWeight: 'bold',
    },
    probLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    teamLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    formContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    formLabel: {
        fontSize: 13,
        color: colors.text.secondary,
        flex: 1,
    },
    formDots: {
        flexDirection: 'row',
        gap: 6,
    },
    formDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formDotText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    venueGrid: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    venueItem: {
        alignItems: 'center',
    },
    venueVal: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    venueLabel: {
        fontSize: 10,
        color: colors.text.tertiary,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: colors.border,
    },
    matchupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    playerRole: {
        fontSize: 11,
        color: colors.text.tertiary,
    },
    vsCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.sm,
    },
    vsText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.secondary,
    },
    matchupStats: {
        marginTop: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    matchupStatText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontStyle: 'italic',
    },
    actionBtn: {
        backgroundColor: '#F97316',
        margin: spacing.lg,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    actionBtnText: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
});
