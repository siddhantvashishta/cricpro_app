import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    StatusBar,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../../theme';

// Hardcoded colors to exactly match the dark theme screenshot requested
const THEME = {
    bg: '#121212',
    surface: '#1E1E1E',
    teal: '#00A896', // the bright teal color for active states
    red: '#E11D48',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    border: '#27272A',
};

const PRIVILEGES = [
    { id: '1', title: 'CricInsights', icon: 'bar-chart', color: '#F59E0B' },
    { id: '2', title: 'Your Stats', icon: 'stats-chart', color: '#FFFFFF' },
    { id: '3', title: 'Points Table', icon: 'list', color: '#FFFFFF' },
    { id: '4', title: 'Leaderboard', icon: 'podium', color: '#FFFFFF' },
    { id: '5', title: 'No Full Screen Ads', icon: 'close-circle', color: '#EF4444' }, // closest generic icon
    { id: '6', title: 'Store Discount', icon: 'bag', color: '#FBBF24' },
    { id: '7', title: 'PRO Club', icon: 'shield-checkmark', color: THEME.teal },
    { id: '8', title: 'Themes', icon: 'color-palette', color: '#10B981' },
];

export const RenewProScreen: React.FC = () => {
    const navigation = useNavigation();
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Default to the 1 Year plan as active
    const [selectedPlan, setSelectedPlan] = useState<'1Year' | 'Lifetime'>('1Year');

    const handleCheckout = () => {
        Alert.alert('Checkout Initiated', `Proceeding with the ${selectedPlan} PRO Plan.`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={THEME.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Choose your PRO plan</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* PRO Privileges Section Title */}
                <View style={styles.sectionHeaderContainer}>
                    <View style={styles.dividerLine} />
                    <View style={styles.pillContainer}>
                        <View style={styles.proPill}>
                            <Text style={styles.proPillText}>PRO</Text>
                        </View>
                        <Text style={styles.sectionTitleText}>Privileges</Text>
                    </View>
                    <View style={styles.dividerLine} />
                </View>

                {/* Main Content Split: Image (Left) + List (Right) */}
                <View style={styles.privilegesLayout}>
                    {/* Phone Preview Side */}
                    <View style={styles.previewContainer}>
                        {/* Using a placeholder image that resembles a phone theme showcase */}
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Features List Side */}
                    <View style={styles.featureListContainer}>
                        {PRIVILEGES.map((item) => (
                            <View key={item.id} style={styles.featureItem}>
                                <Ionicons name={item.icon as any} size={20} color={item.color} style={styles.featureIcon} />
                                <Text style={styles.featureText}>{item.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Plan Selection Cards */}
                <View style={styles.plansContainer}>
                    {/* 1 Year Plan (Active) */}
                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === '1Year' && styles.planCardActive]}
                        onPress={() => setSelectedPlan('1Year')}
                        activeOpacity={0.9}
                    >
                        {/* Badge */}
                        <View style={styles.badgeLabelContainer}>
                            <Text style={styles.badgeLabelText}>Renew</Text>
                        </View>

                        {/* Checkmark mark */}
                        {selectedPlan === '1Year' && (
                            <View style={styles.planCheckmark}>
                                <Ionicons name="checkmark" size={16} color={THEME.bg} />
                            </View>
                        )}

                        <Text style={[styles.planTitle, selectedPlan === '1Year' && styles.planTitleActive]}>1 Year</Text>
                        <Text style={[styles.planSubtitle, selectedPlan === '1Year' && styles.planSubtitleActive]}>Annum</Text>
                        <Text style={[styles.planPrice, selectedPlan === '1Year' && styles.planPriceActive]}>₹399</Text>
                    </TouchableOpacity>

                    {/* Lifetime Plan */}
                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === 'Lifetime' && styles.planCardActive]}
                        onPress={() => setSelectedPlan('Lifetime')}
                        activeOpacity={0.9}
                    >
                        {/* Badge */}
                        <View style={styles.badgeLabelContainer}>
                            <Text style={styles.badgeLabelText}>Upgrade</Text>
                        </View>

                        {/* Checkmark mark */}
                        {selectedPlan === 'Lifetime' && (
                            <View style={styles.planCheckmark}>
                                <Ionicons name="checkmark" size={16} color={THEME.bg} />
                            </View>
                        )}

                        <Text style={[styles.planTitle, selectedPlan === 'Lifetime' && styles.planTitleActive]}>Lifetime</Text>
                        <Text style={[styles.planSubtitle, selectedPlan === 'Lifetime' && styles.planSubtitleActive]}>Infinity</Text>
                        <Text style={[styles.planPrice, selectedPlan === 'Lifetime' && styles.planPriceActive]}>₹3,999</Text>
                    </TouchableOpacity>
                </View>

                {/* Terms Footer */}
                <Text style={styles.termsText}>
                    By continuing, you accept all{' '}
                    <Text style={styles.termsLink}>terms & conditions</Text> and{' '}
                    <Text style={styles.termsLink}>privacy policy</Text>.
                </Text>

            </ScrollView>

            {/* Sticky Bottom CTA */}
            <View style={styles.footerCTAContainer}>
                <TouchableOpacity style={styles.footerCTAButton} onPress={handleCheckout} activeOpacity={0.9}>
                    <Text style={styles.footerCTAMainText}>
                        {selectedPlan === '1Year' ? 'Renew PRO at ₹399/1 Year' : 'Upgrade PRO at ₹3,999/Life'}
                    </Text>
                    <Text style={styles.footerCTASubText}>(Starts after current plan ends)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.md,
        paddingTop: spacing.md,
    },
    backButton: {
        padding: spacing.sm,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: THEME.textPrimary,
        fontWeight: typography.weights.bold,
        marginLeft: spacing.xs,
    },
    scrollContent: {
        paddingTop: spacing.lg,
        paddingBottom: 100, // Space for sticky footer
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.md,
    },
    proPill: {
        backgroundColor: THEME.teal,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: spacing.sm,
    },
    proPillText: {
        color: THEME.textPrimary,
        fontSize: 10,
        fontWeight: typography.weights.bold,
    },
    sectionTitleText: {
        ...typography.presets.bodyLarge,
        color: THEME.textSecondary,
    },
    privilegesLayout: {
        flexDirection: 'row',
        paddingHorizontal: spacing.screenPadding,
        marginBottom: spacing.xxl,
    },
    previewContainer: {
        flex: 0.45, // 45% width
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: '100%',
        height: 320,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#404040',
    },
    featureListContainer: {
        flex: 0.55, // 55% width
        paddingLeft: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.surface,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    featureIcon: {
        marginRight: spacing.sm,
    },
    featureText: {
        ...typography.presets.bodySmall,
        color: THEME.textPrimary,
        fontWeight: typography.weights.medium,
        flexShrink: 1,
    },
    plansContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.lg,
        marginBottom: spacing.xxl,
    },
    planCard: {
        flex: 1,
        maxWidth: 160,
        backgroundColor: '#27272A',
        borderRadius: 12,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: '#3F3F46',
        position: 'relative',
    },
    planCardActive: {
        backgroundColor: THEME.teal,
        borderColor: THEME.teal,
    },
    badgeLabelContainer: {
        position: 'absolute',
        top: -10,
        alignSelf: 'center',
        backgroundColor: THEME.red,
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 12,
        zIndex: 10,
    },
    badgeLabelText: {
        color: THEME.textPrimary,
        fontSize: 10,
        fontWeight: typography.weights.bold,
    },
    planCheckmark: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#10B981', // light green tick circle
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: THEME.bg,
    },
    planTitle: {
        ...typography.presets.h3,
        color: THEME.textPrimary,
        fontWeight: typography.weights.bold,
        marginBottom: 2,
        marginTop: spacing.sm,
    },
    planTitleActive: {
        color: THEME.textPrimary, // Stays white
    },
    planSubtitle: {
        ...typography.presets.bodySmall,
        color: THEME.textSecondary,
        marginBottom: spacing.lg,
    },
    planSubtitleActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    planPrice: {
        ...typography.presets.h2,
        color: THEME.textPrimary,
        fontWeight: typography.weights.bold,
    },
    planPriceActive: {
        color: THEME.textPrimary,
    },
    termsText: {
        ...typography.presets.caption,
        color: '#71717A',
        textAlign: 'center',
        paddingHorizontal: spacing.xxl,
    },
    termsLink: {
        color: THEME.teal,
        textDecorationLine: 'underline',
    },
    footerCTAContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        backgroundColor: THEME.bg,
    },
    footerCTAButton: {
        backgroundColor: THEME.teal,
        borderRadius: 8,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerCTAMainText: {
        ...typography.presets.bodyLarge,
        color: THEME.textPrimary,
        fontWeight: typography.weights.bold,
    },
    footerCTASubText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
        fontStyle: 'italic',
    }
});
