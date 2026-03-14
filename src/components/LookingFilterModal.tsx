import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

export const LookingFilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedDistance, setSelectedDistance] = useState('Any');

    const roles = ['All', 'Batter', 'Bowler', 'All-rounder', 'Wicket-keeper'];
    const distances = ['Any', '< 5 KM', '< 10 KM', '< 20 KM'];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filter Requirements</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        <Text style={styles.label}>Player Role</Text>
                        <View style={styles.chipContainer}>
                            {roles.map((role) => (
                                <TouchableOpacity
                                    key={role}
                                    style={[styles.chip, selectedRole === role && styles.activeChip]}
                                    onPress={() => setSelectedRole(role)}
                                >
                                    <Text style={[styles.chipText, selectedRole === role && styles.activeChipText]}>{role}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Distance</Text>
                        <View style={styles.chipContainer}>
                            {distances.map((dist) => (
                                <TouchableOpacity
                                    key={dist}
                                    style={[styles.chip, selectedDistance === dist && styles.activeChip]}
                                    onPress={() => setSelectedDistance(dist)}
                                >
                                    <Text style={[styles.chipText, selectedDistance === dist && styles.activeChipText]}>{dist}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelectedRole('All'); setSelectedDistance('Any'); }}>
                            <Text style={styles.resetText}>Reset All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => {
                                onApply({ role: selectedRole, distance: selectedDistance });
                                onClose();
                            }}
                        >
                            <Text style={styles.applyText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    body: {
        padding: spacing.lg,
    },
    label: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#F8FAFC',
    },
    activeChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    activeChipText: {
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: spacing.md,
    },
    resetBtn: {
        flex: 1,
        padding: spacing.md,
        alignItems: 'center',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    resetText: {
        ...typography.presets.body,
        color: colors.text.secondary,
    },
    applyBtn: {
        flex: 2,
        backgroundColor: '#F97316',
        padding: spacing.md,
        alignItems: 'center',
        borderRadius: radius.md,
    },
    applyText: {
        ...typography.presets.body,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
});
