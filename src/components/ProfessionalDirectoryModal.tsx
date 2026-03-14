import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
    Platform,
    StatusBar,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { MOCK_PROFESSIONALS, Professional } from '../data/mockProfessionals';
import { useAppStore } from '../store/useAppStore';
import { ProfessionalFilterModal, DirectoryFilters } from './ProfessionalFilterModal';
import { PaymentSimulationModal, PaymentMethod } from './PaymentSimulationModal';

interface ProfessionalDirectoryModalProps {
    visible: boolean;
    onClose: () => void;
    category: string | null;
}

const DEFAULT_FILTERS: DirectoryFilters = {
    priceRange: [0, 1000000],
    minRating: 0,
    minMatches: 0,
    tier: [],
    verifiedOnly: false
};

export const ProfessionalDirectoryModal: React.FC<ProfessionalDirectoryModalProps> = ({ visible, onClose, category }) => {
    const { activeBookings, addBooking, user, deductCoins } = useAppStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState<DirectoryFilters>(DEFAULT_FILTERS);

    const [paymentVisible, setPaymentVisible] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

    // Filter local data based on category and active filters
    const data = MOCK_PROFESSIONALS.filter(p => {
        if (p.category !== category) return false;

        // Price Filter
        if (p.priceVal > activeFilters.priceRange[1]) return false;

        // Rating Filter
        if (p.rating < activeFilters.minRating) return false;

        // Experience (Matches) Filter
        if (p.matches < activeFilters.minMatches) return false;

        // Tier Filter
        if (activeFilters.tier.length > 0 && !activeFilters.tier.includes(p.tier)) return false;

        // Verified Only Filter
        if (activeFilters.verifiedOnly && !p.verified) return false;

        return true;
    });

    const isFilterApplied = JSON.stringify(activeFilters) !== JSON.stringify(DEFAULT_FILTERS);
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const handleBooking = (item: Professional) => {
        const isBooked = activeBookings[item.id];
        if (isBooked) {
            Alert.alert('Already Booked', `You have already requested ${item.name}. They will contact you shortly.`);
            return;
        }
        setSelectedProfessional(item);
        setPaymentVisible(true);
    };

    const finalizeBooking = (method: PaymentMethod) => {
        if (!selectedProfessional) return;

        if (method === 'Coins') {
            const coinsNeeded = Math.floor(selectedProfessional.priceVal / 10);
            const success = deductCoins(coinsNeeded);
            if (!success) {
                Alert.alert('Error', 'Insufficient coins for this booking.');
                return;
            }
        }

        addBooking(selectedProfessional.id);
        Alert.alert('Booking Confirmed!', `Your request for ${selectedProfessional.name} has been secured via ${method}. Check Activity for details.`);
    };

    const renderItem = ({ item }: { item: Professional }) => {
        const isExpanded = expandedId === item.id;
        const isBooked = activeBookings[item.id];

        return (
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.cardHeader}
                    activeOpacity={0.7}
                    onPress={() => setExpandedId(isExpanded ? null : item.id)}
                >
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
                        {item.verified && <View style={styles.verifiedBadge}><Ionicons name="checkmark-circle" size={12} color="white" /></View>}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#FBBF24" />
                            <Text style={styles.ratingText}>{item.rating} • {item.matches} Matches</Text>
                        </View>
                    </View>
                    <Text style={styles.price}>{item.price}</Text>
                </TouchableOpacity>

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="ribbon-outline" size={14} color={colors.primary} />
                        <Text style={styles.detailText}>{item.specialty}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
                        <Text style={styles.detailText}>{item.location}</Text>
                    </View>
                </View>

                {isExpanded && (
                    <View style={styles.bioContainer}>
                        <Text style={styles.bioLabel}>Experience & Bio</Text>
                        <Text style={styles.bioText}>
                            Professional {category} with over {item.matches} matches of experience in high-pressure tournaments.
                            Specialized in {item.specialty} with a focus on accuracy and player satisfaction.
                            Available for local matches in {item.location} and nearby areas.
                        </Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>98%</Text>
                                <Text style={styles.statLab}>Punctuality</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>4.9/5</Text>
                                <Text style={styles.statLab}>Communication</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>Pro</Text>
                                <Text style={styles.statLab}>Equipment</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.secondaryBtn, isExpanded && { backgroundColor: colors.surfaceHighlight }]}
                        onPress={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                        <Text style={styles.secondaryBtnText}>{isExpanded ? 'Hide Bio' : 'View Bio'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            { backgroundColor: isBooked ? '#10B981' : colors.primary }
                        ]}
                        onPress={() => handleBooking(item)}
                    >
                        <Text style={styles.primaryBtnText}>
                            {isBooked ? 'Request Sent' : (category === 'Grounds' ? 'Rent Now' : 'Book Session')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Available {category}</Text>
                    <TouchableOpacity onPress={() => setFilterVisible(true)}>
                        <View>
                            <Ionicons name="options-outline" size={24} color={isFilterApplied ? colors.primary : colors.text.primary} />
                            {isFilterApplied && <View style={styles.filterBadge} />}
                        </View>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={64} color={colors.text.tertiary} />
                            <Text style={styles.emptyTitle}>No {category} nearby</Text>
                            <Text style={styles.emptySub}>Try expanding your search radius</Text>
                        </View>
                    }
                />
                <ProfessionalFilterModal
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    currentFilters={activeFilters}
                    category={category}
                    onApply={(filters) => {
                        setActiveFilters(filters);
                        setFilterVisible(false);
                    }}
                />

                {selectedProfessional && (
                    <PaymentSimulationModal
                        visible={paymentVisible}
                        onClose={() => setPaymentVisible(false)}
                        itemName={selectedProfessional.name}
                        amount={selectedProfessional.price}
                        coinsRequired={Math.floor(selectedProfessional.priceVal / 10)}
                        userCoins={user?.coins || 0}
                        onSuccess={(method) => {
                            finalizeBooking(method);
                        }}
                    />
                )}
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
    listContent: {
        padding: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#38BDF8',
        borderRadius: 10,
        padding: 2,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginLeft: 4,
    },
    price: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.primary,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    primaryBtn: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
        alignItems: 'center',
    },
    primaryBtnText: {
        ...typography.presets.bodySmall,
        color: 'white',
        fontWeight: typography.weights.bold,
    },
    secondaryBtn: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    secondaryBtnText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    emptySub: {
        ...typography.presets.body,
        color: colors.text.tertiary,
    },
    bioContainer: {
        backgroundColor: '#F8FAFC',
        padding: spacing.md,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
    },
    bioLabel: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bioText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    statBox: {
        alignItems: 'center',
    },
    statVal: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: colors.primary,
    },
    statLab: {
        ...typography.presets.caption,
        fontSize: 10,
        color: colors.text.tertiary,
    },
    filterBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.background,
    },
});
