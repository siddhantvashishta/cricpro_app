import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/useAppStore';
import { spacing, radius, typography } from '../theme';

export const ProClubContent: React.FC = () => {
    const { colors, isDark } = useTheme();
    const { isProMember, toggleProMembership } = useAppStore();
    const navigation = useNavigation<any>();
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | '6month' | 'yearly'>('yearly');

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideUpAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous subtle pulse for the main badge
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Entrance animation
        Animated.parallel([
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const features = [
        { icon: 'analytics', title: 'Advanced Match Insights', desc: 'Predictive analytics, wagon wheels & peer percentiles' },
        { icon: 'flash', title: 'Ad-Free Experience', desc: 'Zero interruptions across news and matches' },
        { icon: 'megaphone', title: 'Unlimited & Boosted Posts', desc: 'Pin recruitment posts and bypass connection requests' },
        { icon: 'ribbon', title: 'Verified "Pro" Badge', desc: 'Stand out in the community and top of search results' },
        { icon: 'cash', title: 'Zero Platform Fees', desc: 'Hire professionals instantly without convenience fees' }
    ];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F8FAFC', // Onyx Black or Light Base
        },
        scrollContent: {
            paddingBottom: spacing.xxl * 3,
        },
        heroSection: {
            alignItems: 'center',
            paddingHorizontal: spacing.xxl,
            paddingTop: spacing.xl,
            paddingBottom: spacing.xxl,
        },
        badgeContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: isDark ? '#0F172A' : '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#F59E0B',
            shadowColor: '#F59E0B',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
            marginBottom: spacing.xl,
        },
        heroTitle: {
            ...typography.presets.h1,
            color: isDark ? '#F8FAFC' : '#0F172A',
            textAlign: 'center',
            fontSize: 36,
            marginBottom: spacing.sm,
        },
        heroHighlight: {
            color: '#F59E0B', // Premium Amber
        },
        heroSub: {
            ...typography.presets.body,
            color: isDark ? '#94A3B8' : '#64748B',
            textAlign: 'center',
            lineHeight: 24,
        },
        statusCard: {
            marginHorizontal: spacing.lg,
            borderRadius: radius.lg,
            padding: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.xl,
        },
        statusTitle: {
            ...typography.presets.h3,
            color: isProMember ? '#F59E0B' : (isDark ? '#F8FAFC' : '#0F172A'),
            marginBottom: 4,
        },
        statusSub: {
            ...typography.presets.caption,
            color: isDark ? '#94A3B8' : '#64748B',
        },
        featuresList: {
            paddingHorizontal: spacing.xl,
        },
        featuresHeader: {
            ...typography.presets.h3,
            color: isDark ? '#F8FAFC' : '#0F172A',
            marginBottom: spacing.lg,
        },
        featureItem: {
            flexDirection: 'row',
            marginBottom: spacing.lg,
            alignItems: 'flex-start',
        },
        featureIconBox: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.md,
        },
        featureTitle: {
            ...typography.presets.bodyLarge,
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontWeight: 'bold',
            marginBottom: 4,
        },
        featureDesc: {
            ...typography.presets.bodySmall,
            color: isDark ? '#94A3B8' : '#64748B',
            lineHeight: 20,
            flexShrink: 1,
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
            borderColor: '#E2E8F0',
            borderRadius: radius.lg,
            padding: spacing.md,
            backgroundColor: isDark ? '#0F172A' : '#FFF',
        },
        planCardActive: {
            borderColor: '#F97316',
            backgroundColor: 'transparent',
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
            color: '#FFF',
            fontSize: 10,
            fontWeight: 'bold',
        },
        planHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.sm,
            flexWrap: 'wrap',
        },
        planName: {
            ...typography.presets.bodyLarge,
            fontWeight: 'bold',
            color: isDark ? '#94A3B8' : colors.text.secondary,
        },
        planNameActive: {
            color: '#F97316',
        },
        planPrice: {
            ...typography.presets.h2,
            color: isDark ? '#F8FAFC' : colors.text.primary,
        },
        planDuration: {
            ...typography.presets.caption,
            color: isDark ? '#94A3B8' : colors.text.secondary,
        },
        planEquivalent: {
            ...typography.presets.caption,
            fontSize: 10,
            color: isDark ? '#94A3B8' : colors.text.secondary,
            marginTop: spacing.xs,
            fontStyle: 'italic',
        },
        actionContainer: {
            padding: spacing.xl,
            marginTop: spacing.md,
        },
        proButton: {
            width: '100%',
            height: 56,
        },
        proButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 8,
        },
        cancelButton: {
            marginTop: spacing.lg,
            alignItems: 'center',
        },
        cancelText: {
            ...typography.presets.bodySmall,
            color: isDark ? '#ef4444' : '#dc2626',
            fontWeight: '600'
        }
    });

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View style={{
                    transform: [{ translateY: slideUpAnim }],
                    opacity: fadeAnim
                }}>
                    <View style={styles.heroSection}>
                        <Animated.View style={[styles.badgeContainer, { transform: [{ scale: pulseAnim }] }]}>
                            <Ionicons name="shield-checkmark" size={60} color="#F59E0B" />
                        </Animated.View>
                        <Text style={styles.heroTitle}>CRICPRO <Text style={styles.heroHighlight}>ELITE</Text></Text>
                        <Text style={styles.heroSub}>
                            Unlock the ultimate playing, organizing, and recruiting experience.
                        </Text>
                    </View>

                    <View style={[styles.statusCard, { backgroundColor: isDark ? '#0F172A' : '#FFF', borderWidth: 1, borderColor: '#E2E8F0' }]}>
                        <View>
                            <Text style={styles.statusTitle}>
                                {isProMember ? 'Active Elite Member' : 'Free Basic Member'}
                            </Text>
                            <Text style={styles.statusSub}>
                                {isProMember ? 'All premium features unlocked.' : 'Upgrade to dominate the field.'}
                            </Text>
                        </View>
                        {isProMember ? (
                            <Ionicons name="checkmark-circle" size={32} color="#F59E0B" />
                        ) : (
                            <Ionicons name="lock-closed" size={28} color={isDark ? '#475569' : '#94A3B8'} />
                        )}
                    </View>

                    <View style={styles.featuresList}>
                        <Text style={styles.featuresHeader}>Exclusive Benefits</Text>

                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.featureIconBox}>
                                    <Ionicons name={feature.icon as any} size={24} color="#F59E0B" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.pricingSection}>
                        <Text style={styles.featuresHeader}>Choose your plan</Text>

                        <View style={styles.plansContainer}>
                            {/* Monthly Plan */}
                            <TouchableOpacity
                                onPress={() => setSelectedPlan('monthly')}
                                activeOpacity={0.8}
                                style={{ flex: 1 }}
                            >
                                <View style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}>
                                    <View style={styles.planHeader}>
                                        <Text style={[styles.planName, selectedPlan === 'monthly' && styles.planNameActive]}>1 Month</Text>
                                        {selectedPlan === 'monthly' ? <Ionicons name="checkmark-circle" size={16} color="#F97316" /> : <View style={{ width: 16, height: 16 }} />}
                                    </View>
                                    <Text style={styles.planPrice}>₹199<Text style={styles.planDuration}>/mo</Text></Text>
                                </View>
                            </TouchableOpacity>

                            {/* 6-Month Plan */}
                            <TouchableOpacity
                                onPress={() => setSelectedPlan('6month')}
                                activeOpacity={0.8}
                                style={{ flex: 1 }}
                            >
                                <View style={[styles.planCard, selectedPlan === '6month' && styles.planCardActive, styles.yearlyPlanCard]}>
                                    <View style={styles.savingsBadge}>
                                        <Text style={styles.savingsText}>SAVE 25%</Text>
                                    </View>
                                    <View style={styles.planHeader}>
                                        <Text style={[styles.planName, selectedPlan === '6month' && styles.planNameActive]}>6 Months</Text>
                                        {selectedPlan === '6month' ? <Ionicons name="checkmark-circle" size={16} color="#F97316" /> : <View style={{ width: 16, height: 16 }} />}
                                    </View>
                                    <Text style={styles.planPrice}>₹899<Text style={styles.planDuration}>/6mo</Text></Text>
                                    <Text style={styles.planEquivalent}>Eq. ₹149/mo</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Yearly Plan */}
                            <TouchableOpacity
                                onPress={() => setSelectedPlan('yearly')}
                                activeOpacity={0.8}
                                style={{ flex: 1 }}
                            >
                                <View style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardActive, styles.yearlyPlanCard]}>
                                    <View style={styles.savingsBadge}>
                                        <Text style={styles.savingsText}>SAVE 50%</Text>
                                    </View>
                                    <View style={styles.planHeader}>
                                        <Text style={[styles.planName, selectedPlan === 'yearly' && styles.planNameActive]}>Yearly</Text>
                                        {selectedPlan === 'yearly' ? <Ionicons name="checkmark-circle" size={16} color="#F97316" /> : <View style={{ width: 16, height: 16 }} />}
                                    </View>
                                    <Text style={styles.planPrice}>₹1199<Text style={styles.planDuration}>/yr</Text></Text>
                                    <Text style={styles.planEquivalent}>Eq. ₹99/mo</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.actionContainer}>
                        {!isProMember ? (
                            <TouchableOpacity
                                style={[styles.proButton, { backgroundColor: '#F59E0B', borderRadius: radius.full, justifyContent: 'center', alignItems: 'center' }]}
                                onPress={() => {
                                    let priceLabel = '₹1199/YR';
                                    if (selectedPlan === 'monthly') priceLabel = '₹199/MO';
                                    if (selectedPlan === '6month') priceLabel = '₹899/6MO';
                                    navigation.navigate('ProPayment', { plan: selectedPlan, priceLabel });
                                }}
                            >
                                <Text style={[styles.proButtonText, { color: '#FFF' }]}>
                                    {`UPGRADE TO ELITE - ${selectedPlan === 'yearly' ? '₹1199/YR' : selectedPlan === '6month' ? '₹899/6MO' : '₹199/MO'}`}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <View style={[styles.proButton, { backgroundColor: isDark ? '#1E293B' : '#334155', borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Ionicons name="star" size={20} color="#F59E0B" />
                                    <Text style={[styles.proButtonText, { color: '#F8FAFC' }]}>ELITE ACTIVE</Text>
                                </View>
                                <TouchableOpacity style={styles.cancelButton} onPress={toggleProMembership}>
                                    <Text style={styles.cancelText}>Cancel Subscription</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};
