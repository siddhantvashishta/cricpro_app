import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, BookOpen, Share2, Clock, Newspaper, PlayCircle } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_NEWS = [
  {
    id: '1',
    title: 'The Art of the Leg-Spin: Master Class by Warne',
    category: 'TRAINING',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400&auto=format&fit=crop',
    time: '2h ago',
    type: 'article',
    readTime: '8 min read',
    isPro: true,
  },
  {
    id: '2',
    title: 'India vs Australia: Key Matchups to Watch',
    category: 'ECOSYSTEM',
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=400&auto=format&fit=crop',
    time: '5h ago',
    type: 'video',
    readTime: '12 min video',
    isPro: false,
  },
  {
    id: '3',
    title: 'New Fielding Drills to Improve Reaction Time',
    category: 'INSIGHTS',
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=400&auto=format&fit=crop',
    time: 'Yesterday',
    type: 'article',
    readTime: '5 min read',
    isPro: true,
  },
  {
    id: '4',
    title: 'Understanding the New LBW Rules: A Guide',
    category: 'RULES',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=400&auto=format&fit=crop',
    time: '2 days ago',
    type: 'article',
    readTime: '10 min read',
    isPro: false,
  },
];

const CricketNewsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const renderNewsCard = (news: typeof MOCK_NEWS[0]) => (
    <Pressable key={news.id} style={styles.newsCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: news.image }} style={styles.newsImage} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{news.category}</Text>
        </View>
        {news.isPro && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}
        {news.type === 'video' && (
          <View style={styles.videoOverlay}>
            <PlayCircle color="#FFFFFF" size={40} fill="rgba(0,0,0,0.3)" />
          </View>
        )}
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
        <View style={styles.newsFooter}>
          <View style={styles.metaInfo}>
            <Clock size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{news.time} • {news.readTime}</Text>
          </View>
          <Pressable style={styles.shareBtn}>
            <Share2 size={16} color="#64748B" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#1A202C" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Cricket Hub</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <View style={styles.heroSection}>
           <Text style={styles.heroTitle}>Stay Ahead of the Game 🏏</Text>
           <Text style={styles.heroSubtitle}>Latest insights, news, and expert tips from the world of cricket.</Text>
        </View>

        <View style={styles.sectionHeader}>
           <Text style={styles.sectionLabel}>LATEST UPDATES</Text>
           <Newspaper size={18} color={Colors.maroon} />
        </View>

        {MOCK_NEWS.map(renderNewsCard)}

        <View style={styles.upgradeBanner}>
           <BookOpen color="#FFFFFF" size={32} />
           <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>Unlock Pro Playbooks</Text>
              <Text style={styles.upgradeText}>Get exclusive access to training manuals used by domestic league captains.</Text>
              <Pressable style={styles.upgradeBtn} onPress={() => navigation.navigate('Subscription')}>
                 <Text style={styles.upgradeBtnText}>Explore Pro</Text>
              </Pressable>
           </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A202C',
  },
  headerRight: {
    width: 40,
  },
  scrollBody: {
    paddingTop: 24,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  newsCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.maroon,
    letterSpacing: 0.5,
  },
  proBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsContent: {
    padding: 20,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    lineHeight: 24,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  shareBtn: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  upgradeBanner: {
    margin: 20,
    marginTop: 8,
    backgroundColor: Colors.maroon,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: 16,
  },
  upgradeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  upgradeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.maroon,
  },
});

export default CricketNewsScreen;
