import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface TabSwitchProps {
    tabs?: string[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

// Exactly matching the screenshot text
const DUMMY_TABS = ['For you', 'PRO Club'];

export const TabSwitch: React.FC<TabSwitchProps> = ({
    tabs = DUMMY_TABS,
    activeTab = 'For you',
    onTabChange = () => { }
}) => {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, isActive && styles.activeTab]}
                        onPress={() => onTabChange(tab)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.tabContent}>
                            {/* Handling the PRO badge for the PRO Club tab */}
                            {tab === 'PRO Club' && (
                                <View style={styles.proBadge}>
                                    <Text style={styles.proBadgeText}>PRO</Text>
                                </View>
                            )}
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab === 'PRO Club' ? 'Club' : tab}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#005CE6', // exact blue indicator
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        ...typography.presets.body,
        fontWeight: typography.weights.semibold,
        color: colors.text.secondary,
    },
    activeTabText: {
        color: colors.text.primary,
    },
    proBadge: {
        backgroundColor: '#00A389', // teal badge matching screenshot
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
    },
    proBadgeText: {
        color: colors.text.inverse,
        fontSize: 12,
        fontWeight: 'bold',
    }
});
