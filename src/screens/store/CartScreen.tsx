import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { colors, spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { CartItem } from '../../components/store';

type CartNavProp = NativeStackNavigationProp<StoreStackParamList, 'Cart'>;

export const CartScreen: React.FC = () => {
    const navigation = useNavigation<CartNavProp>();
    const { cart, removeFromCart, updateCartQuantity, setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'Your Cart',
                showBack: true,
                rightIcons: []
            });
        });
        return unsubscribe;
    }, [navigation]);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 10000 ? 0 : 500;
    const discount = subtotal > 5000 ? subtotal * 0.05 : 0;
    const total = subtotal + shipping - discount;

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={100} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Looks like you haven't added any gear yet.</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('StoreHome')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.itemsSection}>
                    {cart.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={removeFromCart}
                            onUpdateQuantity={updateCartQuantity}
                        />
                    ))}
                </View>

                {/* Promo Code */}
                <TouchableOpacity style={styles.promoButton}>
                    <Ionicons name="pricetag-outline" size={20} color={colors.text.secondary} />
                    <Text style={styles.promoText}>Have a promo code?</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                </TouchableOpacity>

                {/* Summary */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</Text>
                    </View>

                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Store Discount (5%)</Text>
                            <Text style={[styles.summaryValue, { color: '#10B981' }]}>-₹{discount.toLocaleString()}</Text>
                        </View>
                    )}

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate('Checkout')}
                >
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
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
    itemsSection: {
        marginBottom: spacing.xl,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 20,
    },
    emptySubtitle: {
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    shopButton: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: radius.lg,
    },
    shopButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    promoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        marginBottom: spacing.xl,
    },
    promoText: {
        flex: 1,
        marginLeft: spacing.md,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    summarySection: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xl,
    },
    summaryTitle: {
        ...typography.presets.h3,
        marginBottom: spacing.xl,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    summaryLabel: {
        color: colors.text.secondary,
        fontWeight: '500',
    },
    summaryValue: {
        color: colors.text.primary,
        fontWeight: '700',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: spacing.xl,
        marginTop: spacing.md,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#F97316',
    },
    bottomBar: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    checkoutButton: {
        height: 56,
        backgroundColor: '#000',
        borderRadius: radius.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
        marginRight: 8,
    }
});
