import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  FlatList,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Trophy, Heart, MessageCircle, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const HALF = (width - 48 - 8) / 2;

// Countdown: ends in 2h 14m 45s
const INITIAL_SECS = 2 * 3600 + 14 * 60 + 45;

const entries = [
  { id: 'e1', image: require('../assets/cricket_catch.png'), views: '1.2k', likes: 432, span: 'tall' },
  { id: 'e2', image: require('../assets/cricket_catch.png'), views: '856', likes: 120 },
  { id: 'e3', image: require('../assets/cricket_catch.png'), views: '244', likes: 897 },
  { id: 'e4', image: null, views: '', likes: 0 },
];

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return { h, m, s };
}

const WeeklyChallengeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const timer = useCountdown(INITIAL_SECS);
  const [submission, setSubmission] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSubmission({
        uri: result.assets[0].uri,
        type: result.assets[0].type === 'video' ? 'video' : 'image'
      });
      Alert.alert('Success', 'Your entry has been selected! Click Publish to enter the challenge.');
    }
  };

  const handleSubmit = () => {
    if (submission) {
      Alert.alert('Confirmed', 'Your entry has been submitted to the Weekly Challenge!', [
        { text: 'Great!', onPress: () => navigation.goBack() }
      ]);
      return;
    }

    Alert.alert('Submit Entry', 'Capture or upload a video or photo of your catch to enter!', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pick from Gallery', onPress: pickMedia },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" translucent={true} />

      {/* Hero Banner */}
      <View style={[styles.heroBanner, { paddingTop: insets.top + 12 }]}>
        <View style={styles.heroNav}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft color={Colors.white} size={22} />
          </Pressable>
          <Text style={styles.heroNavTitle}>Weekly Challenge</Text>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
            onPress={() => Alert.alert('Share Challenge')}
            accessibilityRole="button"
            accessibilityLabel="Share this challenge"
          >
            <Share2 color={Colors.white} size={20} />
          </Pressable>
        </View>

        <View style={styles.heroBody}>
          <View style={styles.moduleTag}>
            <Text style={styles.moduleTagText}>MODULE 073</Text>
          </View>
          <View style={styles.heroTrophyRow}>
            <View>
              <Text style={styles.heroTitle}>Best Catch of{'\n'}the Week</Text>
              <Text style={styles.heroSubtitle}>Show us your diving skills on the field!</Text>
            </View>
            <Trophy color="rgba(255,255,255,0.3)" size={60} />
          </View>

          {/* Countdown */}
          <View style={styles.countdown}>
            <Text style={styles.endsLabel}>⏰ Ends in</Text>
            <View style={styles.timerRow}>
              {[{ value: timer.h, label: 'HRS' }, { value: timer.m, label: 'HOURS' }, { value: timer.s, label: 'MINS' }].map((t, i) => (
                <View key={i} style={styles.timerBlock}>
                  <Text style={styles.timerValue}>{t.value}</Text>
                  <Text style={styles.timerLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Trending Entries */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Entries</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="See all entries">
            <Text style={styles.seeAllBtn}>See All ›</Text>
          </Pressable>
        </View>

        <View style={styles.entriesGrid}>
          {/* Left column: tall first entry */}
          <View style={styles.leftCol}>
            <Pressable
              style={({ pressed }) => [styles.entryCard, styles.entryCardTall, pressed ? { opacity: 0.9 } : null]}
              onPress={() => Alert.alert('Entry', `${entries[0].views} views · ${entries[0].likes} likes`)}
              accessibilityRole="button"
              accessibilityLabel={`Entry with ${entries[0].likes} likes`}
            >
              <Image source={entries[0].image} style={styles.entryImageFull} resizeMode="cover" />
              <View style={styles.entryStats}>
                <Text style={styles.entryStat}>▶ {entries[0].views}</Text>
                <Text style={styles.entryStat}>♥ {entries[0].likes}</Text>
              </View>
            </Pressable>
          </View>

          {/* Right column: two stacked */}
          <View style={styles.rightCol}>
            {entries.slice(1, 3).map((entry, i) => (
              <Pressable
                key={entry.id}
                style={({ pressed }) => [styles.entryCard, pressed ? { opacity: 0.9 } : null]}
                onPress={() => Alert.alert('Entry', `${entry.views} views · ${entry.likes} likes`)}
                accessibilityRole="button"
                accessibilityLabel={`Entry with ${entry.likes} likes`}
              >
                <Image source={entry.image} style={styles.entryImageFull} resizeMode="cover" />
                <View style={styles.entryStats}>
                  <Text style={styles.entryStat}>▶ {entry.views}</Text>
                  <Text style={styles.entryStat}>♥ {entry.likes}</Text>
                </View>
              </Pressable>
            ))}
            {/* 4th empty slot */}
            <View style={[styles.entryCard, styles.entryCardEmpty]}>
              <Text style={styles.entryCardEmptyText}>🔒</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Entry FAB */}
      <View style={[styles.submitRow, { bottom: insets.bottom + 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.submitBtn, submission ? { backgroundColor: '#2E7D32' } : null, pressed ? { opacity: 0.85 } : null]}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit your entry to the challenge"
        >
          <Plus color={Colors.white} size={18} strokeWidth={2.5} />
          <Text style={styles.submitBtnText}>{submission ? 'Confirm & Submit' : 'Submit Your Entry'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const CARD_H = 140;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  heroBanner: { backgroundColor: Colors.maroon, paddingHorizontal: 16, paddingBottom: 24 },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  heroNavTitle: { fontSize: 16, fontWeight: '800', color: Colors.white },
  heroBody: { gap: 16 },
  moduleTag: { backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  moduleTagText: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  heroTrophyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroTitle: { fontSize: 26, fontWeight: '900', color: Colors.white, lineHeight: 32 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 },

  countdown: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12 },
  endsLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  timerRow: { flexDirection: 'row', gap: 16 },
  timerBlock: { alignItems: 'center' },
  timerValue: { fontSize: 28, fontWeight: '900', color: Colors.white },
  timerLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  seeAllBtn: { fontSize: 14, fontWeight: '700', color: Colors.maroon },

  entriesGrid: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  leftCol: { flex: 1 },
  rightCol: { flex: 1, gap: 8 },
  entryCard: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#E0E0E0', height: CARD_H },
  entryCardTall: { height: CARD_H * 2 + 8 },
  entryCardEmpty: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#D0B0B8' },
  entryCardEmptyText: { fontSize: 28 },
  entryImageFull: { position: 'absolute', width: '100%', height: '100%' },
  entryStats: {
    position: 'absolute', bottom: 8, left: 8, right: 8,
    flexDirection: 'row', gap: 10,
  },
  entryStat: { fontSize: 11, fontWeight: '800', color: Colors.white, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },

  submitRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.maroon,
    paddingHorizontal: 28, paddingVertical: 16,
    borderRadius: 28, minHeight: 56,
    ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 }, android: { elevation: 6 } }),
  },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: Colors.white },
});

export default WeeklyChallengeScreen;
