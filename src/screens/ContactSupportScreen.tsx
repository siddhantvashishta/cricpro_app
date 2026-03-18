import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  LayoutAnimation, 
  Platform 
} from 'react-native';
import { ArrowLeft, Mail, Phone, ChevronDown, MessageSquare, ShieldCheck, LifeBuoy } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const FAQS = [
  { question: 'How do I upgrade to Pro?', answer: 'You can upgrade by tapping the "Upgrade to Pro" icon in the header or visiting the Subscription section in the More menu.' },
  { question: 'How to create a new match?', answer: 'Go to the Matches tab and tap the "+" icon at the top right to start the match setup process.' },
  { question: 'Can I add custom players?', answer: 'Yes! During the Playing XI selection phase, you can use the "Recruit" button to add custom players to any team.' },
  { question: 'Is my data secure?', answer: 'Absolutely. We use industry-standard encryption to ensure your profile and match data are always safe and private.' },
];

const ContactSupportScreen = ({ navigation }: any) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <LifeBuoy color={Colors.maroon} size={48} strokeWidth={1.5} />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>Browse our FAQs or reach out to our team directly.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => (
              <Pressable key={index} style={styles.faqItem} onPress={() => toggleExpand(index)}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <ChevronDown 
                    color="#64748B" 
                    size={20} 
                    style={{ transform: [{ rotate: expandedIndex === index ? '180deg' : '0deg' }] }} 
                  />
                </View>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reach Out to Us</Text>
          <View style={styles.contactCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput style={styles.input} placeholder="e.g. Account issue" placeholderTextColor="#94A3B8" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Message</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Tell us more about your query..." 
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={5}
              />
            </View>
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickContact}>
          <Text style={styles.sectionTitle}>Direct Channels</Text>
          <View style={styles.directRow}>
            <Pressable style={styles.directBtn}>
              <Mail color={Colors.maroon} size={20} />
              <Text style={styles.directBtnText}>Email Support</Text>
            </Pressable>
            <Pressable style={styles.directBtn}>
              <MessageSquare color={Colors.maroon} size={20} />
              <Text style={styles.directBtnText}>Live Chat</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  heroSection: { padding: 32, alignItems: 'center', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1A237E', marginTop: 16 },
  heroSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A237E', marginBottom: 16, letterSpacing: 0.5 },
  
  faqList: { gap: 8 },
  faqItem: { backgroundColor: Colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '700', color: '#334155', flex: 1, paddingRight: 12 },
  faqAnswer: { fontSize: 13, color: '#64748B', marginTop: 12, lineHeight: 20 },

  contactCard: { backgroundColor: Colors.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', gap: 16 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#1A237E' },
  input: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, fontSize: 14, borderWidth: 1, borderColor: '#F1F5F9', color: '#1A237E' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: Colors.maroon, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800' },

  quickContact: { padding: 20, paddingTop: 0 },
  directRow: { flexDirection: 'row', gap: 12 },
  directBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  directBtnText: { fontSize: 13, fontWeight: '700', color: '#334155' },
});

export default ContactSupportScreen;
