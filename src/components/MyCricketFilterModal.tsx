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

export const MyCricketFilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
    const [selectedType, setSelectedType] = useState('All');
    const [selectedTime, setSelectedTime] = useState('Anytime');

    const types = ['All', 'T20', 'ODI', 'Test', 'Friendly'];
    const timeframes = ['Anytime', 'Last 7 Days', 'Last 30 Days', 'This Year'];

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
                        <Text style={styles.headerTitle}>Filter My Cricket</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.body}>
                        <Text style={styles.label}>Match Type</Text>
                        <View style={styles.chipContainer}>
                            {types.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.chip, selectedType === t && styles.activeChip]}
                                    onPress={() => setSelectedType(t)}
                                >
                                    <Text style={[styles.chipText, selectedType === t && styles.activeChipText]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Timeframe</Text>
                        <View style={styles.chipContainer}>
                            {timeframes.map((tf) => (
                                <TouchableOpacity
                                    key={tf}
                                    style={[styles.chip, selectedTime === tf && styles.activeChip]}
                                    onPress={() => setSelectedTime(tf)}
                                >
                                    <Text style={[styles.chipText, selectedTime === tf && styles.activeChipText]}>{tf}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => { setSelectedType('All'); setSelectedTime('Anytime'); }}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => {
                                onApply({ type: selectedType, time: selectedTime });
                                onClose();
                            }}
                        >
                            <Text style={styles.applyText}>Apply filters</Text>
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
        maxHeight: '60%',
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
        backgroundColor: '#F3F4F6',
    },
    activeChip: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
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
