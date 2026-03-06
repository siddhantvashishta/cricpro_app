import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface MyCricketSubTabsProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string) => void;
}

export const MyCricketSubTabs: React.FC<MyCricketSubTabsProps> = ({ tabs, activeTab, onTabPress }) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.pill, isActive ? styles.activePill : styles.inactivePill]}
                            onPress={() => onTabPress(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.pillText, isActive ? styles.activePillText : styles.inactivePillText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.md,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    pill: {
        paddingHorizontal: spacing.xxl,
        paddingVertical: 8,
        borderRadius: radius.full,
    },
    activePill: {
        backgroundColor: '#F97316', // orange
    },
    inactivePill: {
        backgroundColor: '#F3F4F6', // light grey
    },
    pillText: {
        ...typography.presets.body,
        fontWeight: typography.weights.medium,
    },
    activePillText: {
        color: colors.text.inverse,
    },
    inactivePillText: {
        color: colors.text.secondary,
    }
});
