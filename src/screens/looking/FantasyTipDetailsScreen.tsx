import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../components';
import { colors, spacing, typography, radius } from '../../theme';
import { FANTASY_TIPS_MOCK } from '../../data/mockTips';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    FantasyTipDetails: { tipId: string };
};

export const FantasyTipDetailsScreen: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'FantasyTipDetails'>>();
    const navigation = useNavigation();
    const { tipId } = route.params;

    const tip = FANTASY_TIPS_MOCK.find(t => t.id === tipId);

    if (!tip) {
        return (
            <View style={styles.errorContainer}>
                <Text>Tip not found!</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: colors.primary, marginTop: spacing.md }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Expert Analysis" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: tip.imageUrl }} style={styles.heroImage} />

                <View style={styles.content}>
                    <Text style={styles.date}>{tip.date}</Text>
                    <Text style={styles.title}>{tip.title}</Text>

                    <View style={styles.expertCard}>
                        <View style={styles.expertInfo}>
                            <View style={styles.expertAvatar}>
                                <Ionicons name="person" size={24} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.expertLabel}>Fantasy Expert</Text>
                                <Text style={styles.expertName}>{tip.expert}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Overview</Text>
                        </View>
                        <Text style={styles.sectionBody}>{tip.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="analytics-outline" size={20} color="#D97706" />
                            <Text style={styles.sectionTitle}>Pitch Report</Text>
                        </View>
                        <View style={styles.analysisBox}>
                            <Text style={styles.sectionBody}>{tip.pitchReport}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="star-outline" size={20} color="#EAB308" />
                            <Text style={styles.sectionTitle}>Top Picks for your Team</Text>
                        </View>
                        <View style={styles.picksContainer}>
                            {tip.topPicks.map((pick, index) => (
                                <View key={index} style={styles.pickItem}>
                                    <View style={styles.pickDot} />
                                    <Text style={styles.pickText}>{pick}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="ribbon-outline" size={20} color="#10B981" />
                            <Text style={styles.sectionTitle}>Captaincy Advice</Text>
                        </View>
                        <View style={styles.adviceBox}>
                            <Text style={styles.sectionBody}>{tip.captaincyAdvice}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => Alert.alert('Follow', `You are now following ${tip.expert}!`)}
                    >
                        <Ionicons name="person-add" size={20} color="#FFF" style={{ marginRight: spacing.sm }} />
                        <Text style={styles.ctaText}>Follow {tip.expert}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: spacing.lg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        backgroundColor: colors.surface,
    },
    date: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginBottom: spacing.xs,
    },
    title: {
        ...typography.presets.h2,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.lg,
    },
    expertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.lg,
    },
    expertInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expertAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    expertLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    expertName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    followButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 20,
    },
    followText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    sectionBody: {
        ...typography.presets.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    analysisBox: {
        backgroundColor: '#FFF7ED',
        padding: spacing.md,
        borderRadius: radius.md,
        borderLeftWidth: 4,
        borderLeftColor: '#F97316',
    },
    picksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.xs,
    },
    pickItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
    },
    pickDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EAB308',
        marginRight: spacing.sm,
    },
    pickText: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.medium,
        color: colors.text.primary,
    },
    adviceBox: {
        backgroundColor: '#F0FDF4',
        padding: spacing.md,
        borderRadius: radius.md,
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    ctaButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    ctaText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: spacing.sm,
    }
});
