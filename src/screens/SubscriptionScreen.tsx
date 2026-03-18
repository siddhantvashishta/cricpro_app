import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const FEATURES = [
  'Advanced Analytics\n(Manhattan, Worm, Wagon Wheel)',
  'Talent Scout Access',
  'International Benchmarking',
  'Ad-Free Experience',
];

const PREMIUM_ICONS = [
  { emoji: '📊', label: 'DEEP ANALYTICS' },
  { emoji: '🕵️', label: 'SCOUT NETWORK' },
  { emoji: '🌐', label: 'GLOBAL STATS' },
  { emoji: '⛔', label: 'ZERO ADS' },
];

const SubscriptionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleStartTrial = () => {
    navigation.navigate('Checkout', { plan: billingCycle });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <X color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>CRICPRO Pro</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Choose plan headline */}
        <Text style={styles.headline}>Choose your plan</Text>
        <Text style={styles.subheadline}>
          Unlock premium cricket insights and{'\n'}advanced scouting tools
        </Text>

        {/* Billing toggle */}
        <View style={styles.toggle}>
          {(['monthly', 'annual'] as const).map(tab => (
            <Pressable
              key={tab}
              style={[styles.toggleTab, billingCycle === tab ? styles.toggleTabActive : null]}
              onPress={() => setBillingCycle(tab)}
              accessibilityRole="radio"
              accessibilityLabel={`${tab} billing`}
              accessibilityState={{ checked: billingCycle === tab }}
            >
              <Text style={[styles.toggleTabText, billingCycle === tab ? styles.toggleTabTextActive : null]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Monthly Plan */}
        <View style={[styles.planCard, billingCycle === 'monthly' ? styles.planCardSelected : null]}>
          <Text style={styles.planName}>Monthly Plan</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>$12.99</Text>
            <Text style={styles.pricePer}>/mo</Text>
          </View>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureCheck}><Check color="#2E7D32" size={14} strokeWidth={3} /></View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Best Value badge + Annual Plan */}
        <View style={styles.annualWrapper}>
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>BEST VALUE</Text>
          </View>
          <View style={[styles.planCard, styles.annualCard, billingCycle === 'annual' ? styles.planCardSelected : null]}>
            <Text style={[styles.planName, { color: Colors.maroon }]}>Annual Plan</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceAmount, { color: Colors.maroon }]}>$99.99</Text>
              <Text style={styles.pricePer}>/year</Text>
            </View>
            <Text style={styles.savingsText}>Save over 35% annually</Text>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={[styles.featureCheck, { backgroundColor: Colors.maroon }]}><Check color={Colors.white} size={14} strokeWidth={3} /></View>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.trialBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleStartTrial}
          accessibilityRole="button"
          accessibilityLabel="Start 7-day free trial"
        >
          <Text style={styles.trialBtnText}>START 7-DAY FREE TRIAL</Text>
        </Pressable>
        <Text style={styles.trialNote}>No commitment. Cancel anytime before trial ends.</Text>

        {/* Premium Cricket Insights */}
        <Text style={styles.insightsTitle}>Premium Cricket Insights</Text>
        <View style={styles.insightsGrid}>
          {PREMIUM_ICONS.map(item => (
            <View key={item.label} style={styles.insightCard}>
              <Text style={styles.insightEmoji}>{item.emoji}</Text>
              <Text style={styles.insightLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  closeBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  body: { padding: 20, paddingBottom: 40 },
  headline: { fontSize: 28, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subheadline: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  toggle: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 3, marginBottom: 20 },
  toggleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, minHeight: 44 },
  toggleTabActive: { backgroundColor: Colors.white, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 }, android: { elevation: 2 } }) },
  toggleTabText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  toggleTabTextActive: { color: Colors.maroon },

  planCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 4, borderWidth: 1.5, borderColor: '#E5E5E5' },
  planCardSelected: { borderColor: Colors.maroon },
  planName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  priceAmount: { fontSize: 36, fontWeight: '900', color: Colors.text },
  pricePer: { fontSize: 14, color: Colors.textSecondary, marginLeft: 4 },
  savingsText: { fontSize: 13, fontWeight: '700', color: '#2E7D32', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  featureCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  featureText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },

  annualWrapper: { marginBottom: 24 },
  bestValueBadge: { alignSelf: 'center', backgroundColor: Colors.maroon, paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20, marginBottom: -14, zIndex: 10 },
  bestValueText: { fontSize: 11, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  annualCard: { backgroundColor: Colors.peach, borderColor: Colors.maroon, borderWidth: 2, paddingTop: 28 },

  trialBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56, ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 6 } }) },
  trialBtnText: { fontSize: 15, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  trialNote: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, marginBottom: 30 },

  insightsTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 20 },
  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  insightCard: { flex: 1, minWidth: '40%', backgroundColor: '#F8F8F8', borderRadius: 16, paddingVertical: 20, alignItems: 'center', gap: 8 },
  insightEmoji: { fontSize: 32 },
  insightLabel: { fontSize: 11, fontWeight: '800', color: Colors.text, letterSpacing: 0.8, textAlign: 'center' },
});

export default SubscriptionScreen;
