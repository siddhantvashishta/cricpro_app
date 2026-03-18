import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Lock, HelpCircle, ShieldCheck, Apple, SmartphoneNfc, Chrome } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useProStore } from '../store/useProStore';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', iconType: 'lucide' },
  { id: 'apple', label: 'Apple Pay', iconType: 'logo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/256px-Apple_Pay_logo.svg.png' },
  { id: 'google', label: 'Google Pay', iconType: 'logo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/256px-Google_Pay_Logo_%282020%29.svg.png' },
  { id: 'upi', label: 'UPI / BHIM', iconType: 'logo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/256px-UPI-Logo-vector.svg.png' },
];

const formatCardNumber = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const CheckoutScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { upgradeToPro } = useProStore();
  
  const mode = route?.params?.mode || 'pro';
  const bookingData = route?.params?.bookingData;
  const plan: 'monthly' | 'annual' = route?.params?.plan || 'annual';
  
  const price = mode === 'pro' 
    ? (plan === 'annual' ? '19.99' : '12.99')
    : bookingData?.price?.replace(/[^0-9.]/g, '') || '1500';

  const planLabel = mode === 'pro' 
    ? (plan === 'annual' ? 'CRICPRO Pro Annual' : 'CRICPRO Pro Monthly')
    : `Booking: ${bookingData?.name || 'Cricket Ground'}`;

  const planDesc = mode === 'pro' 
    ? (plan === 'annual' ? 'Full access to live matches & stats' : 'Monthly premium access')
    : `${bookingData?.date || 'Today'} | ${bookingData?.slot || 'Full Day'}`;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [showGPayModal, setShowGPayModal] = useState(false);
  const [showApplePayModal, setShowApplePayModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
        return;
      }
      if (expiry.length < 5) {
        Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cvv.length < 3) {
        return;
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. user@bank).');
        return;
      }
    }

    if (paymentMethod === 'google') {
      setShowGPayModal(true);
      return;
    }

    if (paymentMethod === 'apple') {
      setShowApplePayModal(true);
      return;
    }

    processPayment();
  };

  const processPayment = () => {
    setProcessing(true);
    setShowGPayModal(false);
    setShowApplePayModal(false);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      if (mode === 'pro') {
        upgradeToPro(plan);
        navigation.navigate('SubscriptionSuccess', { plan });
      } else {
        navigation.navigate('BookingSuccess', { bookingData });
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ShieldCheck color={Colors.maroon} size={18} />
          <Text style={styles.headerTitle}>Secure Checkout</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Order Summary */}
        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
        <View style={styles.orderCard}>
          <View style={styles.orderIcon}>
            <Text style={{ fontSize: 22 }}>🏆</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{planLabel}</Text>
            <Text style={styles.orderDesc}>{planDesc}</Text>
          </View>
          <View>
            <Text style={styles.orderPrice}>{mode === 'pro' ? '$' : '₹'}{price}</Text>
            {mode === 'pro' ? (
              <Text style={styles.orderPer}>per {plan === 'annual' ? 'year' : 'month'}</Text>
            ) : (
              <Text style={styles.orderPer}>total</Text>
            )}
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
        <View style={styles.paymentGrid}>
          {PAYMENT_METHODS.map(m => (
            <Pressable
              key={m.id}
              style={({ pressed }) => [
                styles.paymentCard,
                paymentMethod === m.id ? styles.paymentCardActive : null,
                pressed ? { opacity: 0.8 } : null,
              ]}
              onPress={() => setPaymentMethod(m.id)}
              accessibilityRole="radio"
              accessibilityLabel={`Pay with ${m.label}`}
              accessibilityState={{ checked: paymentMethod === m.id }}
            >
              <View style={[styles.paymentIconBox, paymentMethod === m.id && { backgroundColor: Colors.white, borderColor: Colors.maroon }]}>
                {m.iconType === 'lucide' ? (
                  <CreditCard color={paymentMethod === m.id ? Colors.maroon : '#94A3B8'} size={28} />
                ) : (
                  <Image 
                    source={{ uri: m.logo }} 
                    style={[
                      styles.brandLogo, 
                      m.id === 'apple' && { height: 18, width: 44 }, // Apple is wide/short
                      m.id === 'google' && { height: 20, width: 50 },
                      m.id === 'upi' && { height: 22, width: 48 }
                    ]} 
                    resizeMode="contain" 
                  />
                )}
              </View>
              <Text style={[styles.paymentLabel, paymentMethod === m.id ? styles.paymentLabelActive : null]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* UPI ID Input (visible only when 'upi' is selected) */}
        {paymentMethod === 'upi' && (
          <View style={styles.cardForm}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Enter UPI ID</Text>
              <View style={styles.fieldBox}>
                <SmartphoneNfc color={Colors.textSecondary} size={18} />
                <TextInput
                  style={styles.fieldInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="username@bankid"
                  placeholderTextColor="#C0C0C0"
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.fieldHint}>Ensure your UPI app (GPay, PhonePe, Paytm) is installed.</Text>
            </View>
          </View>
        )}

        {/* Card Form (visible only when 'card' is selected) */}
        {paymentMethod === 'card' && (
          <View style={styles.cardForm}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Card Number</Text>
              <View style={styles.fieldBox}>
                <CreditCard color={Colors.textSecondary} size={18} />
                <TextInput
                  style={styles.fieldInput}
                  value={cardNumber}
                  onChangeText={t => setCardNumber(formatCardNumber(t))}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#C0C0C0"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldBlock, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Expiry Date</Text>
                <View style={styles.fieldBox}>
                  <TextInput
                    style={styles.fieldInput}
                    value={expiry}
                    onChangeText={t => setExpiry(formatExpiry(t))}
                    placeholder="MM/YY"
                    placeholderTextColor="#C0C0C0"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              <View style={[styles.fieldBlock, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <View style={styles.fieldBox}>
                  <TextInput
                    style={styles.fieldInput}
                    value={cvv}
                    onChangeText={t => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                    placeholder="***"
                    placeholderTextColor="#C0C0C0"
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                  />
                  <HelpCircle color={Colors.textSecondary} size={18} />
                </View>
              </View>
            </View>

            <Pressable
              style={styles.saveCardRow}
              onPress={() => setSaveCard(s => !s)}
              accessibilityRole="checkbox"
              accessibilityLabel="Save card for future payments"
              accessibilityState={{ checked: saveCard }}
            >
              <View style={[styles.checkbox, saveCard ? styles.checkboxChecked : null]}>
                {saveCard && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.saveCardText}>Save card for future payments</Text>
            </Pressable>
          </View>
        )}

        {/* Pay CTA */}
        <Pressable
          style={({ pressed }) => [styles.payBtn, processing ? styles.payBtnLoading : null, pressed ? { opacity: 0.85 } : null]}
          onPress={handlePay}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel={`Pay securely $${price}`}
        >
          <Lock color={Colors.white} size={18} />
          <Text style={styles.payBtnText}>{processing ? 'Processing...' : `Pay Securely $${price}`}</Text>
        </Pressable>

        <Text style={styles.termsText}>
          By clicking "Pay Securely", you agree to our Terms of Service. Your subscription will automatically renew at the end of each period.
        </Text>

        {/* Security badges */}
        <View style={styles.securityRow}>
          {['SSL SECURE', 'PCI COMPLIANT', 'ENCRYPTED'].map(badge => (
            <View key={badge} style={styles.securityBadge}>
              <ShieldCheck color={Colors.textSecondary} size={14} />
              <Text style={styles.securityBadgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Simulated GPay Modal */}
      <Modal visible={showGPayModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.gpaySheet}>
            <View style={styles.gpayHeader}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/256px-Google_Pay_Logo_%282020%29.svg.png' }}
                style={{ height: 24, width: 60 }}
                resizeMode="contain"
              />
              <Text style={styles.gpayAmount}>{mode === 'pro' ? '$' : '₹'}{price}</Text>
            </View>
            <View style={styles.gpayLine} />
            <View style={styles.gpayRow}>
              <Text style={styles.gpayLabel}>Pay To</Text>
              <Text style={styles.gpayVal}>CricPro Arena</Text>
            </View>
            <View style={styles.gpayRow}>
              <Text style={styles.gpayLabel}>Account</Text>
              <Text style={styles.gpayVal}>HDFC Bank •••• 1234</Text>
            </View>
            <Pressable style={styles.gpayConfirmBtn} onPress={processPayment}>
              <Text style={styles.gpayConfirmText}>Confirm & Pay</Text>
            </Pressable>
            <Pressable style={styles.gpayCancelBtn} onPress={() => setShowGPayModal(false)}>
              <Text style={styles.gpayCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Simulated Apple Pay Sheet */}
      <Modal visible={showApplePayModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.appleSheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.appleHandle} />
            <View style={styles.appleHeader}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/256px-Apple_Pay_logo.svg.png' }}
                style={{ height: 26, width: 60 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.appleItem}>
              <Text style={styles.appleLabel}>MERCHANT</Text>
              <Text style={styles.appleVal}>CricPro Services</Text>
            </View>
            <View style={styles.appleItem}>
              <Text style={styles.appleLabel}>PAYMENT</Text>
              <Text style={styles.appleVal}>Apple Card •••• 5678</Text>
            </View>
            <View style={styles.appleTotalRow}>
              <Text style={styles.appleTotalLabel}>TOTAL</Text>
              <Text style={styles.appleTotalVal}>{mode === 'pro' ? '$' : '₹'}{price}</Text>
            </View>
            <Pressable style={styles.applePayBtn} onPress={processPayment}>
              <Lock color="#FFF" size={20} />
              <Text style={styles.applePayBtnText}>Pay with Touch ID</Text>
            </Pressable>
            <Pressable style={{ marginTop: 16, alignSelf: 'center' }} onPress={() => setShowApplePayModal(false)}>
              <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  body: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 10, marginTop: 16 },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.peach, borderRadius: 14, padding: 14, gap: 12, borderWidth: 1, borderColor: '#F0C0C0' },
  orderIcon: { width: 44, height: 44, backgroundColor: Colors.maroon, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  orderInfo: { flex: 1 },
  orderTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  orderDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  orderPrice: { fontSize: 18, fontWeight: '900', color: Colors.maroon },
  orderPer: { fontSize: 11, color: Colors.textSecondary, textAlign: 'right' },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paymentCard: { flex: 1, minWidth: '45%', backgroundColor: '#F8F8F8', borderRadius: 12, paddingVertical: 16, alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#EBEBEB', minHeight: 80 },
  paymentCardActive: { backgroundColor: Colors.peach, borderColor: Colors.maroon },
  paymentEmoji: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  paymentIconBox: { width: 64, height: 44, backgroundColor: '#F1F5F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  brandLogo: { width: 40, height: 20 },
  paymentLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  paymentLabelActive: { color: Colors.maroon },
  cardForm: { marginTop: 6, gap: 14 },
  fieldBlock: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E5E5', minHeight: 50, gap: 8 },
  fieldInput: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  saveCardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 2, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  checkboxTick: { fontSize: 13, color: Colors.white, fontWeight: '900' },
  saveCardText: { fontSize: 14, color: Colors.text },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, minHeight: 56, marginTop: 24, ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 6 } }) },
  payBtnLoading: { backgroundColor: '#A0A0A0' },
  payBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
  termsText: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 16 },
  securityRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20 },
  securityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  securityBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  fieldHint: { fontSize: 11, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  
  // GPay Sheet
  gpaySheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  gpayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  gpayAmount: { fontSize: 24, fontWeight: '800', color: '#000' },
  gpayLine: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
  gpayRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gpayLabel: { fontSize: 14, color: '#64748B' },
  gpayVal: { fontSize: 14, fontWeight: '700', color: '#000' },
  gpayConfirmBtn: { backgroundColor: '#1A73E8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  gpayConfirmText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  gpayCancelBtn: { marginTop: 16, alignItems: 'center' },
  gpayCancelText: { color: '#64748B', fontSize: 14, fontWeight: '600' },

  // Apple Sheet
  appleSheet: { backgroundColor: '#F2F2F7', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  appleHandle: { width: 40, height: 5, backgroundColor: '#D1D1D6', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  appleHeader: { alignItems: 'center', marginBottom: 30 },
  appleItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  appleLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '800' },
  appleVal: { fontSize: 15, color: '#000', fontWeight: '500' },
  appleTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  appleTotalLabel: { fontSize: 15, fontWeight: '800', color: '#000' },
  appleTotalVal: { fontSize: 28, fontWeight: '300', color: '#000' },
  applePayBtn: { backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 16, borderRadius: 12 },
  applePayBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

export default CheckoutScreen;
