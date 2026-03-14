import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export type LookingFilterTab = 'Opponent' | 'Team to Join' | 'Player';

interface LookingFilterTabsProps {
    activeTab: LookingFilterTab;
    onTabChange: (tab: LookingFilterTab) => void;
    locationName?: string;
}

export const LookingFilterTabs: React.FC<LookingFilterTabsProps> = ({
    activeTab,
    onTabChange,
    locationName = 'Bengaluru (Bangalore)'
}) => {
    const chips: LookingFilterTab[] = ['Opponent', 'Team to Join', 'Player'];

    return (
        <View style={styles.wrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
                {/* Location Tab */}
                <TouchableOpacity style={styles.locationTab} activeOpacity={0.7}>
                    <Text style={styles.locationText}>{locationName}</Text>
                </TouchableOpacity>

                {/* Vertical Divider */}
                <View style={styles.divider} />

                {/* Filter Chips */}
                {chips.map((chip, index) => {
                    const isActive = activeTab === chip;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.chip, isActive && styles.activeChip]}
                            onPress={() => onTabChange(chip)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.chipText, isActive && styles.activeChipText]}>{chip}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        flexDirection: 'row',
    },
    locationTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#F97316', // Orange underline
        paddingBottom: 4,
        marginRight: spacing.sm,
    },
    locationText: {
        color: '#F97316',
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E7EB', // lighter border
        marginHorizontal: spacing.sm,
    },
    chip: {
        borderWidth: 1,
        borderColor: '#F97316', // Orange border
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        marginHorizontal: 4,
    },
    activeChip: {
        backgroundColor: '#F97316',
    },
    chipText: {
        color: '#F97316',
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.medium,
    },
    activeChipText: {
        color: colors.text.inverse,
    },
});
