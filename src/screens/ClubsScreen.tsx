import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  FlatList, 
  Image, 
  ScrollView,
  Platform 
} from 'react-native';
import { ArrowLeft, Users, Star, MapPin, ChevronRight, Trophy } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const MOCK_CLUBS = [
  { 
    id: '1', 
    name: 'Royal Challengers Cricket Academy', 
    location: 'Bengaluru, KA', 
    rating: 4.9, 
    reviews: 1240, 
    members: '5.2K',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400&auto=format&fit=crop',
    tags: ['Verified', 'ELITE']
  },
  { 
    id: '2', 
    name: 'MCC (Mumbai Cricket Club)', 
    location: 'Mumbai, MH', 
    rating: 4.8, 
    reviews: 856, 
    members: '3.1K',
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=400&auto=format&fit=crop',
    tags: ['Verified']
  },
  { 
    id: '3', 
    name: 'Skyline Sports Hub', 
    location: 'New Delhi, DL', 
    rating: 4.6, 
    reviews: 432, 
    members: '1.8K',
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=400&auto=format&fit=crop',
    tags: ['Trending']
  },
];

const ClubsScreen = ({ navigation }: any) => {
  const renderClub = ({ item }: any) => (
    <Pressable style={styles.clubCard}>
      <Image source={{ uri: item.image }} style={styles.clubImage} />
      <View style={styles.clubOverlay}>
        <View style={styles.tagRow}>
          {item.tags.map((tag: string) => (
            <View key={tag} style={[styles.tag, tag === 'ELITE' && { backgroundColor: '#FFD700' }]}>
              <Text style={[styles.tagText, tag === 'ELITE' && { color: '#B45309' }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.clubInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.clubName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBox}>
            <Star color="#FFD700" size={14} fill="#FFD700" />
            <Text style={styles.ratingValue}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin color="#64748B" size={14} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Users color="#64748B" size={14} />
            <Text style={styles.metaText}>{item.members} Members</Text>
          </View>
        </View>

        <Pressable style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>Explore Club</Text>
          <ChevronRight color={Colors.white} size={16} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Cricket Clubs</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Trophy color={Colors.maroon} size={40} strokeWidth={1.5} />
          <Text style={styles.heroTitle}>Join the Elite</Text>
          <Text style={styles.heroSubtitle}>Find and join top-rated cricket clubs to compete in official tournaments.</Text>
        </View>

        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Clubs</Text>
            <Pressable><Text style={styles.seeAll}>See All</Text></Pressable>
          </View>
          
          <FlatList 
            data={MOCK_CLUBS}
            keyExtractor={(item) => item.id}
            renderItem={renderClub}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
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
  
  heroSection: { padding: 32, alignItems: 'center', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1A237E', marginTop: 16 },
  heroSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  listSection: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A237E' },
  seeAll: { fontSize: 14, fontWeight: '700', color: Colors.maroon },

  listContent: { gap: 16 },
  clubCard: { backgroundColor: Colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  clubImage: { width: '100%', height: 180 },
  clubOverlay: { position: 'absolute', top: 16, left: 16 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: Colors.white, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  clubInfo: { padding: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  clubName: { flex: 1, fontSize: 18, fontWeight: '900', color: '#1A237E' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF8E1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingValue: { fontSize: 12, fontWeight: '800', color: '#B45309' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDivider: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },
  metaText: { fontSize: 13, fontWeight: '600', color: '#64748B' },

  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.maroon, marginTop: 16, paddingVertical: 14, borderRadius: 12 },
  joinBtnText: { color: Colors.white, fontSize: 15, fontWeight: '800' },
});

export default ClubsScreen;
