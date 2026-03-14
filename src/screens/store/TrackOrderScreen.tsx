import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

type TrackOrderRouteProp = RouteProp<StoreStackParamList, 'TrackOrder'>;
type TrackOrderNavProp = NativeStackNavigationProp<StoreStackParamList, 'TrackOrder'>;

export const TrackOrderScreen: React.FC = () => {
    const route = useRoute<TrackOrderRouteProp>();
    const navigation = useNavigation<TrackOrderNavProp>();
    const { orderId } = route.params;
    const { orders, setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'Track Order',
                showBack: true,
                rightIcons: []
            });
        });
        return unsubscribe;
    }, [navigation]);

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={64} color={colors.text.secondary} />
                    <Text style={styles.emptyText}>Order not found</Text>
                    <TouchableOpacity
                        style={styles.backHomeBtn}
                        onPress={() => navigation.navigate('StoreHome')}
                    >
                        <Text style={styles.backHomeBtnText}>Back to Store</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Order Header Card */}
                <View style={styles.headerCard}>
                    <View>
                        <Text style={styles.orderLabel}>Order ID</Text>
                        <Text style={styles.orderIdText}>{order.id}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>{order.status}</Text>
                    </View>
                </View>

                {/* Delivery Estimate */}
                <View style={styles.deliveryCard}>
                    <View style={styles.deliveryInfo}>
                        <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#F97316" />
                        <View style={styles.deliveryTextContainer}>
                            <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                            <Text style={styles.deliveryDate}>{order.date} - Expected in 3 days</Text>
                        </View>
                    </View>
                </View>

                {/* Vertical Stepper Timeline */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Status</Text>
                    <View style={styles.timelineContainer}>
                        {order.timeline.map((item: any, index: number) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.timelineDot,
                                        item.completed && styles.dotCompleted,
                                        item.active && styles.dotActive
                                    ]}>
                                        {item.completed && <Ionicons name="checkmark" size={12} color="#FFF" />}
                                    </View>
                                    {index < order.timeline.length - 1 && (
                                        <View style={[
                                            styles.timelineLine,
                                            item.completed && styles.lineCompleted
                                        ]} />
                                    )}
                                </View>
                                <View style={styles.timelineRight}>
                                    <Text style={[styles.timelineTitle, item.active && styles.activeTitle]}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.timelineDesc}>{item.description}</Text>
                                    <Text style={styles.timelineTime}>{item.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Package Details</Text>
                    <View style={styles.packageCard}>
                        {order.items.map((item: any) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.itemMeta}>{item.brand} • Qty: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Paid</Text>
                            <Text style={styles.totalValue}>₹{order.totalAmount.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Help Section */}
                <TouchableOpacity style={styles.helpButton}>
                    <Ionicons name="help-circle-outline" size={20} color={colors.text.secondary} />
                    <Text style={styles.helpButtonText}>Need help with this order?</Text>
                </TouchableOpacity>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyText: {
        ...typography.presets.h3,
        color: colors.text.secondary,
        marginTop: spacing.md,
    },
    backHomeBtn: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        backgroundColor: '#000',
        borderRadius: radius.md,
    },
    backHomeBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    headerCard: {
        backgroundColor: '#FFF',
        padding: spacing.xl,
        borderRadius: radius.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    orderLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orderIdText: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radius.full,
    },
    statusBadgeText: {
        color: '#4F46E5',
        fontSize: 12,
        fontWeight: '800',
    },
    deliveryCard: {
        backgroundColor: '#FFF',
        padding: spacing.xl,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryTextContainer: {
        marginLeft: spacing.lg,
    },
    deliveryLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    deliveryDate: {
        ...typography.presets.body,
        fontWeight: '800',
        color: colors.text.primary,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        ...typography.presets.h3,
        marginBottom: spacing.lg,
        paddingHorizontal: 4,
    },
    timelineContainer: {
        backgroundColor: '#FFF',
        padding: spacing.xl,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 80,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 30,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#E2E8F0',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotCompleted: {
        backgroundColor: '#10B981',
    },
    dotActive: {
        backgroundColor: '#F97316',
        borderWidth: 3,
        borderColor: '#FFEDD5',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },
    lineCompleted: {
        backgroundColor: '#10B981',
    },
    timelineRight: {
        flex: 1,
        marginLeft: spacing.lg,
        paddingBottom: spacing.xl,
    },
    timelineTitle: {
        ...typography.presets.body,
        fontWeight: '700',
        color: colors.text.primary,
    },
    activeTitle: {
        color: '#F97316',
    },
    timelineDesc: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    timelineTime: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 4,
        fontWeight: '500',
    },
    packageCard: {
        backgroundColor: '#FFF',
        borderRadius: radius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: radius.md,
        backgroundColor: '#F3F4F6',
    },
    itemInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    itemName: {
        ...typography.presets.bodySmall,
        fontWeight: '700',
    },
    itemMeta: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    itemPrice: {
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: spacing.lg,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontWeight: '700',
        color: colors.text.secondary,
    },
    totalValue: {
        ...typography.presets.h3,
        color: '#000',
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        paddingVertical: spacing.md,
    },
    helpButtonText: {
        marginLeft: 8,
        color: colors.text.secondary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }
});
