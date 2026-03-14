import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

export const ProPaymentScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { colors, isDark } = useTheme();
    const { toggleProMembership } = useAppStore();

    const { plan, priceLabel } = route.params || { plan: 'yearly', priceLabel: '₹1199/YR' };
    const [selectedGateway, setSelectedGateway] = useState<'upi' | 'card' | 'wallet'>('upi');

    const handlePayment = () => {
        // Mock payment processing then upgrade
        setTimeout(() => {
            toggleProMembership();
            navigation.goBack();
        }, 1500);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F8FAFC',
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            height: Platform.OS === 'android' ? 60 : 50,
        },
        backButton: {
            padding: spacing.xs,
        },
        headerTitle: {
            ...typography.presets.h3,
            color: isDark ? colors.text.primary : '#000',
        },
        content: {
            paddingTop: spacing.lg,
            paddingHorizontal: spacing.xl,
        },
        summaryCard: {
            backgroundColor: isDark ? '#0F172A' : '#FFF',
            borderRadius: radius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: isDark ? '#1E293B' : '#E2E8F0',
            marginBottom: spacing.xxl,
            alignItems: 'center',
            shadowColor: '#F59E0B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
        },
        planSubTitle: {
            ...typography.presets.caption,
            color: '#F59E0B',
            fontWeight: 'bold',
            letterSpacing: 2,
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
        },
        planTitle: {
            ...typography.presets.h1,
            color: isDark ? '#F8FAFC' : '#0F172A',
            marginBottom: spacing.xs,
        },
        planDesc: {
            ...typography.presets.bodySmall,
            color: isDark ? '#94A3B8' : '#64748B',
            textAlign: 'center',
        },
        sectionTitle: {
            ...typography.presets.h3,
            color: isDark ? '#e2e8f0' : '#1e293b',
            marginBottom: spacing.md,
        },
        gatewayOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.md,
            borderWidth: 2,
            borderColor: isDark ? '#1E293B' : '#E2E8F0',
            borderRadius: radius.md,
            marginBottom: spacing.md,
            backgroundColor: isDark ? '#0F172A' : '#FFF',
        },
        gatewayActive: {
            borderColor: '#F59E0B',
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.05)' : '#FFFBEB',
        },
        gatewayIconBox: {
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.md,
        },
        gatewayText: {
            ...typography.presets.bodyLarge,
            color: isDark ? '#F8FAFC' : '#0F172A',
            fontWeight: '600',
            flex: 1,
        },
        radioContainer: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#CBD5E1',
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioActive: {
            borderColor: '#F59E0B',
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#F59E0B',
        },
        payBtnContainer: {
            marginTop: spacing.xl,
            marginBottom: spacing.xxl * 2,
        },
        payBtn: {
            backgroundColor: '#F59E0B',
            paddingVertical: 18,
            borderRadius: radius.full,
            alignItems: 'center',
            shadowColor: '#F59E0B',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        payBtnText: {
            color: '#FFF',
            ...typography.presets.bodyLarge,
            fontWeight: '900',
            letterSpacing: 1,
            marginLeft: 8,
        },
        secureNote: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.sm,
        },
        secureText: {
            ...typography.presets.caption,
            color: isDark ? '#64748B' : '#94A3B8',
            marginLeft: 4,
        }
    });

    const gateways = [
        { id: 'upi', title: 'UPI (GPay, PhonePe, Paytm)', icon: 'qr-code' },
        { id: 'card', title: 'Credit / Debit Card', icon: 'card' },
        { id: 'wallet', title: 'Wallets', icon: 'wallet' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? colors.text.primary : '#000'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SECURE CHECKOUT</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <View style={styles.summaryCard}>
                    <Ionicons name="shield-checkmark" size={32} color="#F59E0B" style={{ marginBottom: spacing.sm }} />
                    <Text style={styles.planSubTitle}>CRICPRO ELITE</Text>
                    <Text style={styles.planTitle}>{priceLabel}</Text>
                    <Text style={styles.planDesc}>You're about to unlock advanced matchmaking, insights, and zero fees.</Text>
                </View>

                <Text style={styles.sectionTitle}>Payment Method</Text>

                {gateways.map((g) => (
                    <TouchableOpacity
                        key={g.id}
                        style={[styles.gatewayOption, selectedGateway === g.id && styles.gatewayActive]}
                        onPress={() => setSelectedGateway(g.id as any)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.gatewayIconBox}>
                            <Ionicons name={g.icon as any} size={24} color={selectedGateway === g.id ? "#F59E0B" : (isDark ? "#94A3B8" : "#64748B")} />
                        </View>
                        <Text style={styles.gatewayText}>{g.title}</Text>
                        <View style={[styles.radioContainer, selectedGateway === g.id && styles.radioActive]}>
                            {selectedGateway === g.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.payBtnContainer}>
                    <TouchableOpacity style={styles.payBtn} activeOpacity={0.8} onPress={handlePayment}>
                        <Ionicons name="lock-closed" size={18} color="#FFF" />
                        <Text style={styles.payBtnText}>PAY {priceLabel.split('/')[0]}</Text>
                    </TouchableOpacity>
                    <View style={styles.secureNote}>
                        <Ionicons name="shield" size={12} color={isDark ? '#64748B' : '#94A3B8'} />
                        <Text style={styles.secureText}>100% Secure & Encrypted Payment</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};
