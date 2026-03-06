import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export const MyCricketActionBanner: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Want to start a match?</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...typography.presets.bodyLarge,
        color: colors.text.primary,
    },
    button: {
        backgroundColor: '#F97316', // Orange button
        paddingHorizontal: spacing.lg,
        paddingVertical: 8,
        borderRadius: radius.full,
    },
    buttonText: {
        color: colors.text.inverse,
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
    }
});
