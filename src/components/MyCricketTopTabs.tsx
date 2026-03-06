import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface MyCricketTopTabsProps {
    tabs: string[];
    activeTab: string;
    onTabPress: (tab: string) => void;
}

export const MyCricketTopTabs: React.FC<MyCricketTopTabsProps> = ({ tabs, activeTab, onTabPress }) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabItem, isActive && styles.activeTabItem]}
                            onPress={() => onTabPress(tab)}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
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
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    scrollContent: {
        paddingHorizontal: spacing.sm,
    },
    tabItem: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: '#005CE6', // exact blue
    },
    tabText: {
        ...typography.presets.body,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    activeTabText: {
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
});
