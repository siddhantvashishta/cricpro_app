import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { AppHeader } from '../../components';

const { width } = Dimensions.get('window');

export const PerformanceScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="My Performance" showBack />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Stats Summary Tabs */}
                <View style={styles.summaryGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Batting Avg</Text>
                        <Text style={styles.statValue}>42.8</Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="trending-up" size={14} color="#10B981" />
                            <Text style={styles.trendText}>+2.4</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Bowling Avg</Text>
                        <Text style={styles.statValue}>18.5</Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="trending-down" size={14} color="#10B981" />
                            <Text style={styles.trendText}>-1.2</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Strike Rate</Text>
                        <Text style={styles.statValue}>142.6</Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="trending-up" size={14} color="#10B981" />
                            <Text style={styles.trendText}>+5.1</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Match Wins</Text>
                        <Text style={styles.statValue}>75%</Text>
                        <View style={styles.trendRow}>
                            <Ionicons name="remove" size={14} color="#71717A" />
                            <Text style={[styles.trendText, { color: '#71717A' }]}>Stable</Text>
                        </View>
                    </View>
                </View>

                {/* Analytical Chart Placeholder */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Runs in Last 5 Matches</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Full Analysis</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chartContainer}>
                        {/* Mock Bar Chart */}
                        <View style={styles.chartContent}>
                            {[45, 12, 88, 54, 32].map((val, i) => (
                                <View key={i} style={styles.barWrapper}>
                                    <View style={[styles.bar, { height: (val / 100) * 150 }]} />
                                    <Text style={styles.barLabel}>M{i + 1}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#005CE6' }]} />
                                <Text style={styles.legendText}>Runs Scored</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Recent Form Details */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Recent Performances</Text>
                    {[
                        { id: '1', match: 'vs Thunderbolts', result: '54(32)', extras: '1/24 (4)', date: 'Mar 05' },
                        { id: '2', match: 'vs Mighty Meteors', result: '12(8)', extras: '2/18 (4)', date: 'Feb 28' },
                        { id: '3', match: 'vs Super Kings', result: '88*(56)', extras: '0/32 (4)', date: 'Feb 21' },
                    ].map((item) => (
                        <View key={item.id} style={styles.performanceItem}>
                            <View style={styles.perfLeft}>
                                <Text style={styles.perfMatch}>{item.match}</Text>
                                <Text style={styles.perfDate}>{item.date}</Text>
                            </View>
                            <View style={styles.perfRight}>
                                <Text style={styles.perfResult}>{item.result}</Text>
                                <Text style={styles.perfExtras}>{item.extras}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pro CTA for Performance */}
                <TouchableOpacity style={styles.proCta}>
                    <MaterialCommunityIcons name="shield-crown" size={24} color="#FBBF24" />
                    <View style={styles.proCtaInfo}>
                        <Text style={styles.proCtaTitle}>Unlock PRO Insights</Text>
                        <Text style={styles.proCtaDesc}>Get wagon wheels and detailed pitch maps for every match.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#FBBF24" />
                </TouchableOpacity>

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
    scrollContent: {
        padding: spacing.lg,
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - spacing.lg * 2 - spacing.md) / 2,
        backgroundColor: '#2C2C2E',
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    statLabel: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        fontWeight: 'bold',
    },
    statValue: {
        ...typography.presets.h2,
        color: colors.text.inverse,
        marginTop: 4,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    trendText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
    },
    seeAll: {
        ...typography.presets.caption,
        color: '#005CE6',
        fontWeight: 'bold',
    },
    chartContainer: {
        backgroundColor: '#2C2C2E',
        borderRadius: radius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    chartContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 150,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
        paddingBottom: 4,
    },
    barWrapper: {
        alignItems: 'center',
        width: 30,
    },
    bar: {
        width: 14,
        backgroundColor: '#005CE6',
        borderRadius: 4,
    },
    barLabel: {
        fontSize: 10,
        color: '#71717A',
        marginTop: 8,
    },
    chartLegend: {
        marginTop: spacing.lg,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    legendText: {
        fontSize: 11,
        color: '#A1A1AA',
    },
    historySection: {
        marginTop: spacing.xxl,
    },
    performanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    perfLeft: {
        flex: 1,
    },
    perfMatch: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: colors.text.inverse,
    },
    perfDate: {
        ...typography.presets.caption,
        color: '#71717A',
        marginTop: 2,
    },
    perfRight: {
        alignItems: 'flex-end',
    },
    perfResult: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#10B981',
    },
    perfExtras: {
        ...typography.presets.caption,
        color: '#A1A1AA',
        marginTop: 2,
    },
    proCta: {
        marginTop: spacing.xxl,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        padding: spacing.lg,
        borderRadius: radius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    proCtaInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    proCtaTitle: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: '#FBBF24',
    },
    proCtaDesc: {
        fontSize: 11,
        color: '#D1D5DB',
        marginTop: 2,
    },
});
