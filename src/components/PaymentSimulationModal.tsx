import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    ActivityIndicator,
    Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export type PaymentMethod = 'UPI' | 'Card' | 'Coins';

interface PaymentSimulationModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (method: PaymentMethod) => void;
    amount: string;
    coinsRequired: number;
    userCoins: number;
    itemName: string;
}

export const PaymentSimulationModal: React.FC<PaymentSimulationModalProps> = ({
    visible,
    onClose,
    onSuccess,
    amount,
    coinsRequired,
    userCoins,
    itemName
}) => {
    const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            setStep('SELECT');
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const handlePayment = () => {
        setStep('PROCESSING');
        // Simulate network delay
        setTimeout(() => {
            setStep('SUCCESS');
            // Simulate another short delay for success view before calling onSuccess callback via parent closure after user closes
        }, 2000);
    };

    const handleFinalConfirm = () => {
        onSuccess(selectedMethod);
        onClose();
    };

    const renderHeader = () => {
        const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
        return (
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={onClose} disabled={step === 'PROCESSING'}>
                    <Ionicons name="close" size={28} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Secure Payment</Text>
                <View style={{ width: 28 }} />
            </View>
        );
    };

    const renderSelectStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Total Payable for {itemName}</Text>
                <Text style={styles.amountText}>{amount}</Text>
                <Text style={styles.coinAlt}>or {coinsRequired} CricPro Coins</Text>
            </View>

            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            {/* UPI */}
            <TouchableOpacity
                style={[styles.methodCard, selectedMethod === 'UPI' && styles.activeMethod]}
                onPress={() => setSelectedMethod('UPI')}
            >
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                    <MaterialCommunityIcons name="flash-outline" size={24} color="#0EA5E9" />
                </View>
                <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>UPI (GPay, PhonePe, Paytm)</Text>
                    <Text style={styles.methodSub}>Fast & Secure instant payment</Text>
                </View>
                <Ionicons
                    name={selectedMethod === 'UPI' ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={selectedMethod === 'UPI' ? colors.primary : colors.text.tertiary}
                />
            </TouchableOpacity>

            {/* CARD */}
            <TouchableOpacity
                style={[styles.methodCard, selectedMethod === 'Card' && styles.activeMethod]}
                onPress={() => setSelectedMethod('Card')}
            >
                <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="card-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                    <Text style={styles.methodSub}>Securely pay via card</Text>
                </View>
                <Ionicons
                    name={selectedMethod === 'Card' ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={selectedMethod === 'Card' ? colors.primary : colors.text.tertiary}
                />
            </TouchableOpacity>

            {/* COINS */}
            <TouchableOpacity
                style={[
                    styles.methodCard,
                    selectedMethod === 'Coins' && styles.activeMethod,
                    userCoins < coinsRequired && styles.disabledMethod
                ]}
                onPress={() => userCoins >= coinsRequired && setSelectedMethod('Coins')}
                disabled={userCoins < coinsRequired}
            >
                <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialCommunityIcons name="currency-usd" size={24} color="#F59E0B" />
                </View>
                <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>CricPro Coins</Text>
                    <Text style={styles.methodSub}>Balance: {userCoins} Coins</Text>
                </View>
                {userCoins < coinsRequired ? (
                    <Text style={styles.insufficient}>Insufficient</Text>
                ) : (
                    <Ionicons
                        name={selectedMethod === 'Coins' ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color={selectedMethod === 'Coins' ? colors.primary : colors.text.tertiary}
                    />
                )}
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
                <Text style={styles.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
        </View>
    );

    const renderProcessingStep = () => (
        <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.statusTitle}>Processing Payment...</Text>
            <Text style={styles.statusSub}>Please do not refresh or close the app</Text>

            <View style={styles.securitySeal}>
                <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                <Text style={styles.sealText}>SSL SECURED 256-BIT ENCRYPTION</Text>
            </View>
        </View>
    );

    const renderSuccessStep = () => (
        <View style={styles.statusContainer}>
            <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={48} color="white" />
            </View>
            <Text style={styles.statusTitle}>Payment Successful!</Text>
            <Text style={styles.statusSub}>Booking request for {itemName} confirmed</Text>

            <View style={styles.receiptCard}>
                <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction ID</Text>
                    <Text style={styles.receiptVal}>#TXN{Math.floor(Math.random() * 1000000)}</Text>
                </View>
                <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Method</Text>
                    <Text style={styles.receiptVal}>{selectedMethod}</Text>
                </View>
                <View style={[styles.receiptRow, { borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm }]}>
                    <Text style={[styles.receiptLabel, { fontWeight: 'bold' }]}>Amount Paid</Text>
                    <Text style={[styles.receiptVal, { color: colors.primary, fontWeight: 'bold' }]}>
                        {selectedMethod === 'Coins' ? `${coinsRequired} Coins` : amount}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={handleFinalConfirm}>
                <Text style={styles.doneBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={visible} animationType="fade" transparent={false}>
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                    {step === 'SELECT' && renderSelectStep()}
                    {step === 'PROCESSING' && renderProcessingStep()}
                    {step === 'SUCCESS' && renderSuccessStep()}
                </Animated.View>
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
    },
    headerTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    stepContainer: {
        flex: 1,
        padding: spacing.lg,
    },
    amountContainer: {
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingVertical: spacing.xl,
        borderRadius: radius.md,
        marginBottom: spacing.xl,
    },
    amountLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginBottom: 4,
    },
    amountText: {
        ...typography.presets.h1,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        fontSize: 32,
    },
    coinAlt: {
        ...typography.presets.caption,
        color: '#F59E0B',
        marginTop: 4,
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        marginBottom: spacing.md,
    },
    activeMethod: {
        borderColor: colors.primary,
        backgroundColor: '#F0F9FF',
    },
    disabledMethod: {
        opacity: 0.6,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    methodSub: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    insufficient: {
        ...typography.presets.caption,
        color: '#EF4444',
        fontWeight: 'bold',
    },
    payBtn: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    payBtnText: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: 'white',
    },
    statusContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    statusTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginTop: spacing.lg,
    },
    statusSub: {
        ...typography.presets.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
    },
    securitySeal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xl,
        padding: spacing.sm,
        backgroundColor: '#ECFDF5',
        borderRadius: 4,
    },
    sealText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#10B981',
        marginLeft: 4,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    receiptCard: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.lg,
        marginTop: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    receiptLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    receiptVal: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    doneBtn: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        width: '100%',
        borderRadius: radius.md,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    doneBtnText: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: 'white',
    },
});
