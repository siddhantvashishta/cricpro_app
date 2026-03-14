import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { colors, spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { AddressEditModal } from '../../components/store';

type CheckoutNavProp = NativeStackNavigationProp<StoreStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC = () => {
    const navigation = useNavigation<CheckoutNavProp>();
    const { cart, clearCart, shippingAddress, updateShippingAddress, setHeaderConfig } = useAppStore();
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'Checkout',
                showBack: true,
                rightIcons: []
            });
        });
        return unsubscribe;
    }, [navigation]);

    const handleConfirmOrder = () => {
        const { addOrder } = useAppStore.getState();

        Alert.alert(
            "Confirm Order",
            "Are you sure you want to place this order?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: () => {
                        const orderId = `CP${Math.floor(Math.random() * 900000) + 100000}`;

                        // Create professional order snapshot
                        const newOrder = {
                            id: orderId,
                            date: new Date().toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }),
                            totalAmount: total,
                            paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery',
                            status: 'Order Placed',
                            items: cart.map(item => ({ ...item })),
                            shippingAddress: shippingAddress,
                            timeline: [
                                { title: 'Order Placed', description: 'We have received your order', time: 'Just now', completed: true, active: true },
                                { title: 'Processing', description: 'Your gear is being prepared', time: 'Upcoming', completed: false, active: false },
                                { title: 'Shipped', description: 'Handed over to our courier partner', time: 'Upcoming', completed: false, active: false },
                                { title: 'Delivered', description: 'Enjoy your new cricket gear!', time: 'Upcoming', completed: false, active: false },
                            ]
                        };

                        addOrder(newOrder);
                        clearCart();
                        navigation.navigate('OrderSuccess', { orderId });
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Shipping Section */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
                            <Text style={styles.editLink}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    {shippingAddress ? (
                        <View style={styles.addressCard}>
                            <Ionicons name="location" size={24} color={colors.primary} />
                            <View style={styles.addressInfo}>
                                <Text style={styles.addressName}>{shippingAddress.name}</Text>
                                <Text style={styles.addressText}>
                                    {shippingAddress.street}{'\n'}
                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}
                                </Text>
                                <Text style={styles.addressPhone}>{shippingAddress.phone}</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={styles.addAddressPlaceholder}
                            onPress={() => setAddressModalVisible(true)}
                        >
                            <Ionicons name="add-circle-outline" size={24} color={colors.text.secondary} />
                            <Text style={styles.addAddressText}>Add Delivery Address</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <AddressEditModal 
                    visible={addressModalVisible} 
                    onClose={() => setAddressModalVisible(false)}
                    currentAddress={shippingAddress}
                    onSave={updateShippingAddress}
                />

                {/* Payment Methods */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {[
                        { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: 'flash-outline' },
                        { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
                        { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
                    ].map(method => (
                        <TouchableOpacity
                            key={method.id}
                            style={[styles.paymentOption, paymentMethod === method.id && styles.activePayment]}
                            onPress={() => setPaymentMethod(method.id)}
                        >
                            <Ionicons
                                name={method.icon as any}
                                size={22}
                                color={paymentMethod === method.id ? '#F97316' : colors.text.secondary}
                            />
                            <Text style={[styles.paymentLabel, paymentMethod === method.id && styles.activePaymentLabel]}>
                                {method.label}
                            </Text>
                            <View style={styles.radio}>
                                {paymentMethod === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {cart.map(item => (
                        <View key={item.id} style={styles.miniItem}>
                            <Text style={styles.miniItemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.miniItemQty}>x{item.quantity}</Text>
                            <Text style={styles.miniItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmOrder}
                >
                    <Text style={styles.confirmButtonText}>Confirm Order</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
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
    section: {
        marginBottom: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xl,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.presets.h3,
    },
    editLink: {
        color: '#F97316',
        fontWeight: 'bold',
        fontSize: 12,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressInfo: {
        marginLeft: spacing.lg,
    },
    addressName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    addressText: {
        color: colors.text.secondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 8,
    },
    addressPhone: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: '600',
    },
    addAddressPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        borderRadius: radius.md,
        backgroundColor: '#F8FAFC',
    },
    addAddressText: {
        marginLeft: spacing.sm,
        fontSize: 14,
        fontWeight: '700',
        color: colors.text.secondary,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    activePayment: {
        // Optional
    },
    paymentLabel: {
        flex: 1,
        marginLeft: spacing.lg,
        color: colors.text.primary,
        fontWeight: '500',
    },
    activePaymentLabel: {
        color: '#F97316',
        fontWeight: '700',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F97316',
    },
    miniItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    miniItemName: {
        flex: 1,
        color: colors.text.secondary,
    },
    miniItemQty: {
        width: 40,
        textAlign: 'center',
        color: colors.text.secondary,
    },
    miniItemPrice: {
        fontWeight: '700',
        width: 80,
        textAlign: 'right',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 12,
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#F97316',
    },
    bottomBar: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    confirmButton: {
        height: 56,
        backgroundColor: '#000',
        borderRadius: radius.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
        marginRight: 8,
    }
});
