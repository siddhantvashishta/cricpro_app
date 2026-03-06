import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

const CHIPS = ['Opponent', 'Team to Join', 'Player'];

export const LookingFilterTabs: React.FC = () => {
    return (
        <View style={styles.wrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
                {/* Location Tab */}
                <TouchableOpacity style={styles.locationTab}>
                    <Text style={styles.locationText}>Bengaluru (Bangalore)</Text>
                </TouchableOpacity>

                {/* Vertical Divider */}
                <View style={styles.divider} />

                {/* Filter Chips */}
                {CHIPS.map((chip, index) => (
                    <TouchableOpacity key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                ))}
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
    chipText: {
        color: '#F97316',
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.medium,
    },
});
