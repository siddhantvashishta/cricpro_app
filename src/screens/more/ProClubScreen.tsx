import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated, Easing, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { spacing, radius, typography } from '../../theme';

export const ProClubScreen: React.FC = () => {
    const navigation = useNavigation();
    const { colors, isDark } = useTheme();
    const { isProMember, toggleProMembership } = useAppStore();

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
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            height: Platform.OS === 'android' ? 60 : 50,
        },
        backButton: {
            padding: spacing.xs,
        },
        headerTitle: {
            ...typography.presets.h3,
            color: isDark ? colors.text.primary : '#000',
        },
        scrollContent: {
            paddingBottom: spacing.xxl * 2,
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
            backgroundColor: isProMember ? 'rgba(245, 158, 11, 0.1)' : (isDark ? '#0F172A' : '#FFF'),
            borderRadius: radius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: isProMember ? '#F59E0B' : (isDark ? '#1E293B' : '#E2E8F0'),
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
        actionContainer: {
            padding: spacing.xl,
            marginTop: spacing.md,
        },
        proButton: {
            backgroundColor: '#F59E0B', // Solid Gold
            paddingVertical: 18,
            borderRadius: radius.full,
            alignItems: 'center',
            shadowColor: '#F59E0B',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        proButtonText: {
            color: '#FFF',
            ...typography.presets.bodyLarge,
            fontWeight: '900',
            letterSpacing: 1,
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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Custom Header for Premium Feel */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? colors.text.primary : '#000'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}></Text>
                <View style={{ width: 32 }} />
            </View>

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

                    <View style={styles.statusCard}>
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

                    <View style={styles.actionContainer}>
                        {!isProMember ? (
                            <TouchableOpacity style={styles.proButton} activeOpacity={0.8} onPress={toggleProMembership}>
                                <Ionicons name="flash" size={20} color="#FFF" />
                                <Text style={styles.proButtonText}>UPGRADE TO ELITE - ₹999/YR</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <View style={[styles.proButton, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0', shadowOpacity: 0, elevation: 0 }]}>
                                    <Ionicons name="star" size={20} color="#F59E0B" />
                                    <Text style={[styles.proButtonText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>ELITE ACTIVE</Text>
                                </View>
                                <TouchableOpacity style={styles.cancelButton} onPress={toggleProMembership}>
                                    <Text style={styles.cancelText}>Cancel Subscription</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};
