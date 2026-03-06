import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

export const InstantScoringScreen: React.FC = () => {
    const navigation = useNavigation();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const [matchFormat, setMatchFormat] = useState('Generic');

    const handleStartScoring = () => {
        Alert.alert(
            'Scoring Initialized',
            `Starting a new ${matchFormat} style scoring session.`,
            [{ text: 'Lets Go', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Instant Scoring</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.splashContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="speedometer" size={48} color={colors.error} />
                    </View>
                    <Text style={styles.title}>Quick Track</Text>
                    <Text style={styles.subtitle}>
                        Start tracking a match immediately. No need to set up full squads or rosters beforehand.
                    </Text>
                </View>

                {/* Match Format Selector */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Select Format</Text>

                    <TouchableOpacity
                        style={[styles.formatCard, matchFormat === 'T20' && styles.formatCardActive]}
                        onPress={() => setMatchFormat('T20')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.formatHeader}>
                            <Text style={[styles.formatTitle, matchFormat === 'T20' && styles.formatTitleActive]}>T20 Format</Text>
                            {matchFormat === 'T20' && <Ionicons name="checkmark-circle" size={20} color={colors.error} />}
                        </View>
                        <Text style={styles.formatDesc}>20 Overs, Standard modern rules apply.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.formatCard, matchFormat === 'Test' && styles.formatCardActive]}
                        onPress={() => setMatchFormat('Test')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.formatHeader}>
                            <Text style={[styles.formatTitle, matchFormat === 'Test' && styles.formatTitleActive]}>Long Form / Test</Text>
                            {matchFormat === 'Test' && <Ionicons name="checkmark-circle" size={20} color={colors.error} />}
                        </View>
                        <Text style={styles.formatDesc}>Unlimited overs, multi-innings match.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.formatCard, matchFormat === 'Generic' && styles.formatCardActive]}
                        onPress={() => setMatchFormat('Generic')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.formatHeader}>
                            <Text style={[styles.formatTitle, matchFormat === 'Generic' && styles.formatTitleActive]}>Custom / Box Cricket</Text>
                            {matchFormat === 'Generic' && <Ionicons name="checkmark-circle" size={20} color={colors.error} />}
                        </View>
                        <Text style={styles.formatDesc}>Flexible overs, custom player limits.</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Sticky Bottom CTA */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleStartScoring}
                    activeOpacity={0.8}
                >
                    <Text style={styles.createButtonText}>Start Scoring Now</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.inverse} style={{ marginLeft: spacing.xs }} />
                </TouchableOpacity>
            </View>
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
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    splashContainer: {
        alignItems: 'center',
        marginVertical: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FEE2E2', // Light red for Instant Scoring
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.presets.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
        fontWeight: typography.weights.bold,
    },
    subtitle: {
        ...typography.presets.bodyLarge,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    formSection: {
        marginBottom: spacing.xl,
    },
    formatCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    formatCardActive: {
        borderColor: colors.error, // Red accent
        backgroundColor: '#FFF5F5',
    },
    formatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    formatTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    formatTitleActive: {
        color: colors.error,
    },
    formatDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: colors.error, // Red action button
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    }
});
