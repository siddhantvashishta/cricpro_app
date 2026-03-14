import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';

const BENEFITS = [
    {
        id: '1',
        title: 'Advanced Analytics',
        desc: 'Deep dive into your batting and bowling performance with heatmaps and wagon wheels.',
        icon: 'chart-line',
        color: '#4F46E5'
    },
    {
        id: '2',
        title: 'Priority Support',
        desc: 'Get your questions answered faster by our dedicated support team.',
        icon: 'customer-service',
        color: '#10B981'
    },
    {
        id: '3',
        title: 'Pro Badge',
        desc: 'Stand out in the community with a verified PRO badge on your profile.',
        icon: 'shield-check',
        color: '#F97316'
    },
    {
        id: '4',
        title: 'Ad-Free Experience',
        desc: 'Enjoy CricPro without any interruptions or third-party advertisements.',
        icon: 'block-helper',
        color: '#EF4444'
    },
    {
        id: '5',
        title: 'Exclusive Content',
        desc: 'Access elite training drills and expert tips from professional coaches.',
        icon: 'star-circle',
        color: '#8B5CF6'
    }
];

export const ProPrivilegesScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="PRO Privileges" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Gradient Card */}
                <View style={styles.heroCard}>
                    <MaterialCommunityIcons name="shield-crown" size={80} color="#FBBF24" />
                    <Text style={styles.heroTitle}>Upgrade to CricPro PRO</Text>
                    <Text style={styles.heroSub}>Take your cricket game to the next level with elite features.</Text>
                </View>

                {/* Benefits List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Go PRO?</Text>
                    {BENEFITS.map((benefit) => (
                        <View key={benefit.id} style={styles.benefitItem}>
                            <View style={[styles.iconBox, { backgroundColor: benefit.color + '15' }]}>
                                <MaterialCommunityIcons name={benefit.icon as any} size={24} color={benefit.color} />
                            </View>
                            <View style={styles.benefitInfo}>
                                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pricing Placeholder */}
                <View style={styles.planCard}>
                    <View style={styles.planHeader}>
                        <Text style={styles.planName}>Annual Plan</Text>
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveBadgeText}>SAVE 40%</Text>
                        </View>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceSymbol}>₹</Text>
                        <Text style={styles.priceAmount}>999</Text>
                        <Text style={styles.pricePeriod}>/year</Text>
                    </View>
                    <Text style={styles.planSub}>Comprehensive access for the serious cricketer.</Text>

                    <TouchableOpacity style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Get PRO Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    heroCard: {
        padding: spacing.xxl,
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    heroTitle: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    heroSub: {
        ...typography.presets.body,
        color: '#A1A1AA',
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    section: {
        padding: spacing.lg,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        marginBottom: spacing.xl,
    },
    benefitItem: {
        flexDirection: 'row',
        marginBottom: spacing.xl,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    benefitInfo: {
        flex: 1,
    },
    benefitTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: 'bold',
        color: colors.text.inverse,
    },
    benefitDesc: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        marginTop: 4,
        lineHeight: 18,
    },
    planCard: {
        margin: spacing.lg,
        padding: spacing.xl,
        backgroundColor: '#005CE6',
        borderRadius: radius.xl,
        shadowColor: '#005CE6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        ...typography.presets.bodyLarge,
        color: '#FFF',
        fontWeight: 'bold',
    },
    saveBadge: {
        backgroundColor: '#FBBF24',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    saveBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#000',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: spacing.md,
    },
    priceSymbol: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    priceAmount: {
        fontSize: 48,
        color: '#FFF',
        fontWeight: '900',
    },
    pricePeriod: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
        marginLeft: 4,
    },
    planSub: {
        ...typography.presets.caption,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: spacing.xl,
    },
    ctaButton: {
        backgroundColor: '#FFF',
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    ctaButtonText: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#005CE6',
    },
});
