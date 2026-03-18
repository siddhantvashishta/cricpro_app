import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  ScrollView, 
  Platform 
} from 'react-native';
import { ArrowLeft, FileText, ShieldCheck, Lock } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const LegalScreen = ({ route, navigation }: any) => {
  const { title = 'Legal Document', type = 'privacy' } = route?.params || {};

  const getIcon = () => {
    if (type === 'privacy') return <ShieldCheck color={Colors.maroon} size={48} strokeWidth={1.5} />;
    if (type === 'terms') return <FileText color={Colors.maroon} size={48} strokeWidth={1.5} />;
    return <Lock color={Colors.maroon} size={48} strokeWidth={1.5} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          {getIcon()}
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSubtitle}>Last Updated: March 15, 2026</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.paragraph}>
            Welcome to CricPro. Your privacy and trust are paramount to us. This document outlines the terms and conditions governing your use of the CricPro application and services.
          </Text>
          
          <Text style={styles.subTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using CricPro, you agree to be bound by these terms. If you do not agree to all of these terms, do not use the application.
          </Text>

          <Text style={styles.subTitle}>2. Use of Service</Text>
          <Text style={styles.paragraph}>
            CricPro provides a platform for cricket enthusiasts to manage matches, track stats, and connect with the community. You are responsible for all activity that occurs under your account.
          </Text>

          <Text style={styles.subTitle}>3. Data Privacy</Text>
          <Text style={styles.paragraph}>
            We collect data to provide better services to all our users. We do not sell your personal information to third parties. Your data is encrypted and stored securely.
          </Text>

          <Text style={styles.subTitle}>4. Pro Subscription</Text>
          <Text style={styles.paragraph}>
            Pro features are available through a paid subscription. Terms for paid services are outlined in the Paid Service Terms section.
          </Text>

          <Text style={styles.subTitle}>5. Community Guidelines</Text>
          <Text style={styles.paragraph}>
            Users must respect other community members. Any form of harassment or inappropriate content will lead to immediate account suspension.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: Colors.maroon,
    paddingTop: Platform.OS === 'android' ? 40 : 16
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.white },
  
  scrollContent: { paddingBottom: 20 },
  heroSection: { padding: 32, alignItems: 'center', backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1A237E', marginTop: 16 },
  heroSubtitle: { fontSize: 13, color: '#94A3B8', fontWeight: '700', marginTop: 4 },

  contentSection: { padding: 24 },
  subTitle: { fontSize: 18, fontWeight: '800', color: '#1A237E', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 16 },
});

export default LegalScreen;
