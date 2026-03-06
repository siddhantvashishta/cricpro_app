import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const PRO_FEATURES = [
    { id: '1', title: 'Ad-Free Experience', description: 'Enjoy CricPro without any interruptions.', icon: 'flash' },
    { id: '2', title: 'Advanced Analytics', description: 'Deep dive into player stats, wagon wheels, and pitch maps.', icon: 'pie-chart' },
    { id: '3', title: 'Live Streaming', description: 'Stream your local matches live in HD quality.', icon: 'videocam' },
    { id: '4', title: 'Priority Support', description: '24/7 dedicated support for pro members.', icon: 'headset' },
];

export const ProClubContent: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Premium Hero Section */}
                <View style={styles.heroSection}>
                    <Ionicons name="shield-checkmark" size={60} color="#FBBF24" style={styles.heroIcon} />
                    <Text style={styles.heroTitle}>Unlock <Text style={styles.highlightText}>PRO</Text> Privileges</Text>
                    <Text style={styles.heroSubtitle}>Elevate your cricketing journey with exclusive features designed for serious players and organizers.</Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>Why go Pro?</Text>
                    {PRO_FEATURES.map((feature) => (
                        <View key={feature.id} style={styles.featureItem}>
                            <View style={styles.featureIconContainer}>
                                <Ionicons name={feature.icon as any} size={24} color="#F97316" />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pricing Plans */}
                <View style={styles.pricingSection}>
                    <Text style={styles.sectionTitle}>Choose your plan</Text>

                    <View style={styles.plansContainer}>
                        {/* Monthly Plan */}
                        <TouchableOpacity
                            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}
                            onPress={() => setSelectedPlan('monthly')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.planHeader}>
                                <Text style={[styles.planName, selectedPlan === 'monthly' && styles.planNameActive]}>Monthly</Text>
                                {selectedPlan === 'monthly' && <Ionicons name="checkmark-circle" size={20} color="#F97316" />}
                            </View>
                            <Text style={styles.planPrice}>₹199<Text style={styles.planDuration}>/mo</Text></Text>
                        </TouchableOpacity>

                        {/* Yearly Plan */}
                        <TouchableOpacity
                            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardActive, styles.yearlyPlanCard]}
                            onPress={() => setSelectedPlan('yearly')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.savingsBadge}>
                                <Text style={styles.savingsText}>SAVE 50%</Text>
                            </View>
                            <View style={styles.planHeader}>
                                <Text style={[styles.planName, selectedPlan === 'yearly' && styles.planNameActive]}>Yearly</Text>
                                {selectedPlan === 'yearly' && <Ionicons name="checkmark-circle" size={20} color="#F97316" />}
                            </View>
                            <Text style={styles.planPrice}>₹1199<Text style={styles.planDuration}>/yr</Text></Text>
                            <Text style={styles.planEquivalent}>Equivalent to ₹99/mo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Checkout CTA */}
            <View style={styles.ctaContainer}>
                <TouchableOpacity style={styles.upgradeBtn}>
                    <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.termsText}>By continuing, you agree to our Terms & Conditions</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl * 2 + spacing.xl,
    },
    heroSection: {
        backgroundColor: '#005CE6', // Exact blue header
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        paddingTop: spacing.lg,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroIcon: {
        marginBottom: spacing.md,
    },
    heroTitle: {
        ...typography.presets.h1,
        color: colors.text.inverse,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    highlightText: {
        color: '#FBBF24', // Yellow gold
    },
    heroSubtitle: {
        ...typography.presets.body,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 22,
    },
    sectionTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    featuresSection: {
        paddingTop: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    featureIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF0E6', // Light orange
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 4,
    },
    featureDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    pricingSection: {
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    plansContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    planCard: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    planCardActive: {
        borderColor: '#F97316',
        backgroundColor: '#FFFaf0',
    },
    yearlyPlanCard: {
        position: 'relative',
        paddingTop: spacing.lg + spacing.xs,
    },
    savingsBadge: {
        position: 'absolute',
        top: -12,
        left: '50%',
        transform: [{ translateX: -40 }],
        backgroundColor: '#10B981', // green
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    savingsText: {
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    planName: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.secondary,
    },
    planNameActive: {
        color: '#F97316',
    },
    planPrice: {
        ...typography.presets.h1,
        color: colors.text.primary,
    },
    planDuration: {
        ...typography.presets.body,
        color: colors.text.secondary,
    },
    planEquivalent: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    upgradeBtn: {
        backgroundColor: '#F97316',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: radius.full,
        marginBottom: spacing.sm,
    },
    upgradeBtnText: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
        marginRight: spacing.sm,
    },
    termsText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        textAlign: 'center',
    }
});
