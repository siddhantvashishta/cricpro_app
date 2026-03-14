import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export interface DirectoryFilters {
    priceRange: [number, number];
    minRating: number;
    minMatches: number;
    tier: string[];
    verifiedOnly: boolean;
}

interface ProfessionalFilterModalProps {
    visible: boolean;
    onClose: () => void;
    currentFilters: DirectoryFilters;
    onApply: (filters: DirectoryFilters) => void;
    category: string | null;
}

export const ProfessionalFilterModal: React.FC<ProfessionalFilterModalProps> = ({
    visible,
    onClose,
    currentFilters,
    onApply,
    category
}) => {
    const [tempFilters, setTempFilters] = useState<DirectoryFilters>(currentFilters);
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const toggleTier = (tier: string) => {
        setTempFilters(prev => ({
            ...prev,
            tier: prev.tier.includes(tier)
                ? prev.tier.filter(t => t !== tier)
                : [...prev.tier, tier]
        }));
    };

    const resetFilters = () => {
        setTempFilters({
            priceRange: [0, 1000000],
            minRating: 0,
            minMatches: 0,
            tier: [],
            verifiedOnly: false
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Filter {category}</Text>
                    <TouchableOpacity onPress={resetFilters}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* TIER SECTION */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Talent Tier</Text>
                        <View style={styles.chipRow}>
                            {['Elite', 'Pro', 'Rising'].map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.chip,
                                        tempFilters.tier.includes(t) && styles.activeChip
                                    ]}
                                    onPress={() => toggleTier(t)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        tempFilters.tier.includes(t) && styles.activeChipText
                                    ]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* PRICE PRESETS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Budget (Max Price)</Text>
                        <View style={styles.chipRow}>
                            {[500, 1000, 5000, 10000, 25000].map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.chip,
                                        tempFilters.priceRange[1] === p && styles.activeChip
                                    ]}
                                    onPress={() => setTempFilters(prev => ({ ...prev, priceRange: [0, p] }))}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        tempFilters.priceRange[1] === p && styles.activeChipText
                                    ]}>Up to ₹{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* MIN RATING */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Minimum Rating</Text>
                        <View style={styles.chipRow}>
                            {[3, 4, 4.5, 4.8].map(r => (
                                <TouchableOpacity
                                    key={r}
                                    style={[
                                        styles.chip,
                                        tempFilters.minRating === r && styles.activeChip
                                    ]}
                                    onPress={() => setTempFilters(prev => ({ ...prev, minRating: r }))}
                                >
                                    <Ionicons name="star" size={14} color={tempFilters.minRating === r ? 'white' : colors.primary} />
                                    <Text style={[
                                        styles.chipText,
                                        tempFilters.minRating === r && styles.activeChipText,
                                        { marginLeft: 4 }
                                    ]}>{r}+</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* EXPERIENCE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience (Matches)</Text>
                        <View style={styles.chipRow}>
                            {[10, 50, 100, 250, 500].map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={[
                                        styles.chip,
                                        tempFilters.minMatches === m && styles.activeChip
                                    ]}
                                    onPress={() => setTempFilters(prev => ({ ...prev, minMatches: m }))}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        tempFilters.minMatches === m && styles.activeChipText
                                    ]}>{m}+ Matches</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* VERIFIED ONLY */}
                    <TouchableOpacity
                        style={styles.toggleRow}
                        onPress={() => setTempFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                    >
                        <View>
                            <Text style={styles.toggleTitle}>Verified Professionals Only</Text>
                            <Text style={styles.toggleSub}>Show only trusted and verified experts</Text>
                        </View>
                        <Ionicons
                            name={tempFilters.verifiedOnly ? "checkbox" : "square-outline"}
                            size={28}
                            color={tempFilters.verifiedOnly ? colors.primary : colors.text.tertiary}
                        />
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(tempFilters)}>
                        <Text style={styles.applyBtnText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
    resetText: {
        ...typography.presets.body,
        color: colors.primary,
        fontWeight: typography.weights.bold,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    activeChipText: {
        color: 'white',
        fontWeight: typography.weights.bold,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    toggleTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    toggleSub: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    applyBtn: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
    },
    applyBtnText: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: 'white',
    },
});
