import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Search, Star, Navigation, Phone, Calendar, ArrowLeft, Wifi, Car, Coffee, Zap, Shield } from 'lucide-react-native';
import { Image } from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_GROUNDS = [
  {
    id: '1',
    name: 'MCC Cricket Ground',
    location: 'Gurgaon, Sector 56',
    rating: 4.8,
    reviews: 124,
    price: '₹1200/hr',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
    tags: ['Nets', 'Floodlights', 'Pavilion'],
    amenities: ['wifi', 'car', 'coffee', 'zap'],
  },
  {
    id: '2',
    name: 'Starlight Sports Complex',
    location: 'New Delhi, Dwarka',
    rating: 4.5,
    reviews: 89,
    price: '₹1500/hr',
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=600&auto=format&fit=crop',
    tags: ['Turf', 'Nets', 'Parking'],
    amenities: ['wifi', 'car', 'shield'],
  },
  {
    id: '3',
    name: 'The Cricket Hub',
    location: 'Noida, Sector 62',
    rating: 4.2,
    reviews: 56,
    price: '₹1000/hr',
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=600&auto=format&fit=crop',
    tags: ['Nets', 'Coaching'],
    amenities: ['coffee', 'zap'],
  },
];

const AMENITIES = [
  { id: 'wifi', label: 'Wifi', icon: 'wifi' },
  { id: 'car', label: 'Parking', icon: 'car' },
  { id: 'coffee', label: 'Cafe', icon: 'coffee' },
  { id: 'zap', label: 'Lights', icon: 'zap' },
  { id: 'shield', label: 'Security', icon: 'shield' },
];

const GroundFinderScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const renderGroundCard = (ground: typeof MOCK_GROUNDS[0]) => (
    <Pressable key={ground.id} style={styles.groundCard}>
      <View style={styles.groundImageContainer}>
        <Image source={{ uri: ground.image }} style={styles.groundImage} />
        <View style={styles.ratingBadge}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{ground.rating}</Text>
        </View>
        <View style={styles.amenityStrip}>
           {ground.amenities.includes('wifi') && <Wifi size={14} color="#FFFFFF" style={styles.amenityIcon} />}
           {ground.amenities.includes('car') && <Car size={14} color="#FFFFFF" style={styles.amenityIcon} />}
           {ground.amenities.includes('coffee') && <Coffee size={14} color="#FFFFFF" style={styles.amenityIcon} />}
           {ground.amenities.includes('zap') && <Zap size={14} color="#FFFFFF" style={styles.amenityIcon} />}
        </View>
      </View>
      <View style={styles.groundInfo}>
        <View style={styles.infoTop}>
          <Text style={styles.groundName}>{ground.name}</Text>
          <Text style={styles.priceText}>{ground.price}</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.locationText}>{ground.location}</Text>
        </View>
        <View style={styles.tagRow}>
          {ground.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.actionRow}>
           <Pressable style={styles.secondaryAction}>
             <Phone size={16} color={Colors.maroon} />
             <Text style={styles.secondaryActionText}>Call</Text>
           </Pressable>
           <Pressable style={styles.primaryAction} onPress={() => navigation.navigate('Matches')}>
             <Calendar size={16} color="#FFFFFF" />
             <Text style={styles.primaryActionText}>Book Now</Text>
           </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#1A202C" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Find Grounds</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.searchBar}>
          <Search color="#94A3B8" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search grounds, nets..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          <Pressable style={styles.mapToggle}>
             <Navigation size={18} color={Colors.maroon} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Grounds Near You</Text>
           <Text style={styles.sectionSubtitle}>Discover and book top-rated nets and fields.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amenityFilterRow}>
           {AMENITIES.map(amenity => (
             <Pressable key={amenity.id} style={styles.amenityChip}>
               <Text style={styles.amenityChipText}>{amenity.label}</Text>
             </Pressable>
           ))}
        </ScrollView>

        {MOCK_GROUNDS.map(renderGroundCard)}

        <View style={styles.infoBanner}>
           <View style={styles.bannerIconBg}>
              <Zap color="#FFFFFF" size={24} />
           </View>
           <View style={{ flex: 1 }}>
              <Text style={styles.bannerText}>Register your ground with CricPro to manage bookings effortlessly.</Text>
              <Pressable style={styles.bannerBtn}>
                 <Text style={styles.bannerBtnText}>Register Now</Text>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
  },
  headerRight: {
    width: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  mapToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    paddingTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  groundCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  groundImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  groundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  amenityStrip: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amenityIcon: {
    opacity: 0.9,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A202C',
  },
  groundInfo: {
    padding: 20,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groundName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.maroon,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    width: 60,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.maroon,
  },
  primaryAction: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.maroon,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  amenityFilterRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  amenityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amenityChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  infoBanner: {
    margin: 20,
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bannerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
});

export default GroundFinderScreen;
