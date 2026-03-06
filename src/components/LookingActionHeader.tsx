import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export const LookingActionHeader: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Looking for <Text style={styles.highlight}>Opponent?</Text>
            </Text>
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.btnPost}>
                    <Ionicons name="add-circle-outline" size={16} color={colors.text.inverse} style={styles.btnIcon} />
                    <Text style={styles.btnText}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnYou}>
                    <Ionicons name="person-circle-outline" size={16} color={colors.text.inverse} style={styles.btnIcon} />
                    <Text style={styles.btnText}>You</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
    },
    title: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    highlight: {
        color: '#F97316', // Orange from the design
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    btnPost: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F97316', // Orange
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: radius.full,
    },
    btnYou: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F97316', // Orange
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: radius.full,
    },
    btnIcon: {
        marginRight: 4,
    },
    btnText: {
        ...typography.presets.bodySmall,
        color: colors.text.inverse,
        fontWeight: typography.weights.medium,
    },
});
