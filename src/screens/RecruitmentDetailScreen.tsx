import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  CheckCircle,
  Timer,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const RecruitmentDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { team } = route.params || {};
  const [bookmarked, setBookmarked] = useState(false);

  // Build recruitment details from team data
  const detail = {
    name: team?.name || 'Elite Warriors Cricket Club',
    location: team?.location || 'Mumbai, IN',
    badge: team?.badge || '🛡️',
    bgColor: team?.bgColor || '#1A1A1A',
    verified: true,
    established: 2018,
    played: 145,
    won: 89,
    roleRequired: team?.looking?.[0] || 'Opening Batsman',
    experience: '3+ Years Professional',
    matchFormat: 'T20 (Night/Day)',
    description: `The ${team?.name || 'Elite Warriors'} are looking for a dynamic and aggressive ${team?.looking?.[0] || 'Opening Batsman'} to join our first-string T20 squad for the upcoming corporate league season. We need someone who can maximize the powerplay and maintain a high strike rate.`,
    requirements: [
      'Proven track record in high-stakes T20 matches.',
      'Availability for weekend matches and Thursday evening practice sessions.',
      'High fitness standards and excellent running between wickets.',
      'Team player with a positive attitude in the dressing room.',
    ],
    perks: `Selected players will receive professional kit sponsorship and performance-based match fees. Join one of ${team?.location?.split(',')[0] || 'Mumbai'}'s most prestigious amateur clubs.`,
  };

  const handleApply = () => {
    Alert.alert(
      'Submit Application',
      `Apply to join ${detail.name} as ${detail.roleRequired}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply Now',
          onPress: () =>
            Alert.alert('Application Sent! ✅', 'The team manager will contact you within 48 hours.'),
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', `Share recruitment for ${detail.name}`);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" translucent={true} />

      {/* Hero Image / Gradient Header */}
      <View style={[styles.heroArea, { paddingTop: insets.top }]}>
        <Image
          source={require('../assets/stadium_night.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        {/* Nav Row */}
        <View style={styles.heroNav}>
          <Pressable
            style={({ pressed }) => [styles.circleBtn, pressed ? { opacity: 0.7 } : null]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft color={Colors.white} size={20} />
          </Pressable>
          <Text style={styles.heroNavTitle}>Recruitment Details</Text>
          <Pressable
            style={({ pressed }) => [styles.circleBtn, pressed ? { opacity: 0.7 } : null]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share this recruitment post"
          >
            <Share2 color={Colors.white} size={20} />
          </Pressable>
        </View>

        {/* Team Info Card */}
        <View style={styles.teamInfoCard}>
          <View style={[styles.teamBadge, { backgroundColor: detail.bgColor }]}>
            <Text style={styles.teamBadgeEmoji}>{detail.badge}</Text>
          </View>
          <View style={styles.teamInfoText}>
            <Text style={styles.teamName}>{detail.name}</Text>
            <View style={styles.teamMeta}>
              {detail.verified && (
                <View style={styles.verifiedTag}>
                  <CheckCircle color={Colors.maroon} size={11} />
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              )}
              <Text style={styles.estText}>Est. {detail.established}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Body */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Briefcase color={Colors.maroon} size={18} />
            <Text style={styles.statText}>
              Played <Text style={styles.statHighlight}>{detail.played}</Text>
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Timer color={Colors.maroon} size={18} />
            <Text style={styles.statText}>
              Won <Text style={styles.statHighlight}>{detail.won}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.bodyPadding}>
          {/* Section: Recruitment Details */}
          <Text style={styles.sectionTitle}>Recruitment Details</Text>

          {/* Role Required */}
          <View style={styles.roleCard}>
            <Text style={styles.roleCardLabel}>ROLE REQUIRED</Text>
            <View style={styles.roleCardRow}>
              <Text style={styles.roleCardValue}>{detail.roleRequired}</Text>
              <Clock color={Colors.maroon} size={22} />
            </View>
          </View>

          {/* Detail Rows */}
          {[
            { icon: Briefcase, label: 'Experience', value: detail.experience },
            { icon: Timer, label: 'Match Format', value: detail.matchFormat },
            { icon: MapPin, label: 'Location', value: `${team?.location || 'Wankhede Stadium Area, Mumbai'}` },
          ].map(row => (
            <View key={row.label} style={styles.detailRow}>
              <View style={styles.detailIconCell}>
                <row.icon color={Colors.maroon} size={18} />
              </View>
              <View>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          ))}

          {/* Job Description */}
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{detail.description}</Text>

          {detail.requirements.map((req, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}

          <Text style={[styles.descriptionText, { marginTop: 12 }]}>{detail.perks}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.applyBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleApply}
          accessibilityRole="button"
          accessibilityLabel="Apply for this role"
        >
          <Text style={styles.applyBtnText}>Apply Now  ➜</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.bookmarkBtn, bookmarked ? styles.bookmarkBtnActive : null, pressed ? { opacity: 0.75 } : null]}
          onPress={() => setBookmarked(b => !b)}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark this recruitment post'}
        >
          <Bookmark color={bookmarked ? Colors.white : Colors.maroon} fill={bookmarked ? Colors.maroon : 'none'} size={22} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Hero
  heroArea: { height: 220, backgroundColor: '#1A1A1A', justifyContent: 'space-between' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  circleBtn: { width: 44, height: 44, justifyContent: 'center' },
  heroNavTitle: { fontSize: 16, fontWeight: '800', color: Colors.white },
  teamInfoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', margin: 12,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  teamBadge: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  teamBadgeEmoji: { fontSize: 28 },
  teamInfoText: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: '900', color: Colors.white, marginBottom: 6 },
  teamMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: Colors.maroon, letterSpacing: 0.5 },
  estText: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  // Stats
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statDivider: { width: 1, height: 24, backgroundColor: '#E0E0E0' },
  statText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  statHighlight: { fontWeight: '900', color: Colors.text },

  // Body
  bodyPadding: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 16, marginTop: 8 },

  // Role Card
  roleCard: { backgroundColor: Colors.peach, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F0C0C0' },
  roleCardLabel: { fontSize: 10, fontWeight: '800', color: Colors.maroon, letterSpacing: 0.8, marginBottom: 6 },
  roleCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleCardValue: { fontSize: 22, fontWeight: '900', color: Colors.maroon },

  // Detail Rows
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailIconCell: { width: 36, height: 36, backgroundColor: Colors.peach, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, marginBottom: 3 },
  detailValue: { fontSize: 15, fontWeight: '700', color: Colors.text },

  // Description
  descriptionText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  bullet: { fontSize: 16, color: Colors.maroon, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  // Bottom CTA
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  applyBtn: { flex: 1, backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56 },
  applyBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  bookmarkBtn: { width: 56, height: 56, borderRadius: 14, backgroundColor: Colors.peach, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#F0C0C0' },
  bookmarkBtnActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
});

export default RecruitmentDetailScreen;
