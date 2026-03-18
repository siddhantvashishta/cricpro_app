import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Navigation, Clock, ShieldCheck, Zap, Coffee, Car, Wifi, ShowerHead, Trophy, MessageSquare, Share2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import BookingModal from '../components/BookingModal';

const { width } = Dimensions.get('window');

const GroundDetailScreen = ({ route, navigation }: any) => {
  const { ground } = route.params;
  const insets = useSafeAreaInsets();
  const [showBooking, setShowBooking] = useState(false);

  const amenityMap: Record<string, any> = {
    Zap: { icon: Zap, label: 'Floodlights' },
    Coffee: { icon: Coffee, label: 'Cafe' },
    Car: { icon: Car, label: 'Parking' },
    Wifi: { icon: Wifi, label: 'Free Wifi' },
    ShowerHead: { icon: ShowerHead, label: 'Showers' },
  };

  const groundAmenities = ground.amenities?.map((key: string) => amenityMap[key]).filter(Boolean) || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Header */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: ground.image }} style={styles.heroImage} />
        <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
           <TouchableOpacity 
             style={styles.backBtn}
             onPress={() => navigation.goBack()}
           >
             <ArrowLeft color={Colors.white} size={24} />
           </TouchableOpacity>
           <View style={styles.rightActions}>
             <TouchableOpacity style={styles.actionBtn}>
               <Share2 color={Colors.white} size={20} />
             </TouchableOpacity>
           </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Basic Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.groundName}>{ground.name}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceLabel}>{ground.price}</Text>
            </View>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
               {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#F59E0B" fill={s <= Math.round(parseFloat(ground.rating)) ? "#F59E0B" : "transparent"} />)}
            </View>
            <Text style={styles.ratingText}>{ground.rating} ({ground.reviews} Reviews)</Text>
            <View style={styles.dot} />
            <Text style={styles.distanceText}>{ground.distance} away</Text>
          </View>

          <View style={styles.locationCard}>
             <MapPin color={Colors.maroon} size={18} />
             <Text style={styles.addressText} numberOfLines={2}>{ground.address}</Text>
             <TouchableOpacity style={styles.dirBtn}>
               <Navigation color={Colors.white} size={16} />
               <Text style={styles.dirText}>Directions</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
           <View style={styles.statBox}>
             <Trophy color={Colors.maroon} size={20} />
             <Text style={styles.statValue}>{ground.tournaments}</Text>
             <Text style={styles.statLabel}>Tournaments</Text>
           </View>
           <View style={styles.statBox}>
             <Clock color={Colors.maroon} size={20} />
             <Text style={styles.statValue}>{ground.openHours}</Text>
             <Text style={styles.statLabel}>Open Hours</Text>
           </View>
           <View style={styles.statBox}>
             <ShieldCheck color={Colors.maroon} size={20} />
             <Text style={styles.statValue}>{ground.certification}</Text>
             <Text style={styles.statLabel}>Certified</Text>
           </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.amenitiesScroll}>
            {groundAmenities.map((item: any, i: number) => (
              <View key={i} style={styles.amenityItem}>
                <View style={styles.amenityIcon}>
                  <item.icon color={Colors.maroon} size={20} />
                </View>
                <Text style={styles.amenityLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Details / Ground Specs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pitch Type</Text>
              <Text style={styles.detailValue}>{ground.pitchType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Boundary Size</Text>
              <Text style={styles.detailValue}>{ground.boundarySize}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Floodlights</Text>
              <Text style={styles.detailValue}>{ground.lights}</Text>
            </View>
          </View>
        </View>

        {/* Reviews Summary */}
        <View style={styles.section}>
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>User Opinions</Text>
             <TouchableOpacity>
               <Text style={styles.viewAllText}>View All</Text>
             </TouchableOpacity>
           </View>
           <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?u=1' }} style={styles.reviewerAvatar} />
                <View>
                  <Text style={styles.reviewerName}>Suresh Raina</Text>
                  <Text style={styles.reviewDate}>2 days ago</Text>
                </View>
                <View style={styles.reviewRating}>
                   <Star size={12} color="#F59E0B" fill="#F59E0B" />
                   <Text style={styles.reviewRatingText}>5.0</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>Amazing turf! The ball bounce is really consistent and the lights are professional grade. Highly recommended for night matches.</Text>
           </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.footerBar, { paddingBottom: insets.bottom + 10 }]}>
         <View>
           <Text style={styles.footerPrice}>{ground.price}</Text>
           <Text style={styles.footerSub}>per hour slot</Text>
         </View>
         <TouchableOpacity 
           style={styles.bookCTA}
           onPress={() => setShowBooking(true)}
         >
           <Text style={styles.bookCTAText}>Book Now</Text>
         </TouchableOpacity>
      </View>

      {/* Reusable Booking Modal */}
      <BookingModal 
        isVisible={showBooking}
        onClose={() => setShowBooking(false)}
        ground={ground}
        onConfirm={(data) => {
          setShowBooking(false);
          navigation.navigate('Checkout', { 
            mode: 'booking', 
            bookingData: data 
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  heroContainer: { width: '100%', height: 300, backgroundColor: '#000' },
  heroImage: { width: '100%', height: '100%', opacity: 0.85 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  rightActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingBottom: 120 },
  infoSection: { backgroundColor: Colors.white, padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  groundName: { flex: 1, fontSize: 24, fontWeight: '900', color: '#0F172A', marginRight: 15 },
  priceBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  priceLabel: { fontSize: 16, fontWeight: '900', color: Colors.maroon },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stars: { flexDirection: 'row', marginRight: 8 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
  distanceText: { fontSize: 13, fontWeight: '700', color: Colors.maroon },
  
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  addressText: { flex: 1, fontSize: 13, color: '#475569', fontWeight: '500', marginHorizontal: 10 },
  dirBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.maroon, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 6 },
  dirText: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 24 },
  statBox: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginTop: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 16 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: Colors.maroon },
  
  amenitiesScroll: { marginLeft: -5 },
  amenityItem: { width: 80, alignItems: 'center', gap: 8, marginRight: 15 },
  amenityIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  amenityLabel: { fontSize: 11, fontWeight: '700', color: '#475569', textAlign: 'center' },
  
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  
  reviewCard: { backgroundColor: Colors.white, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewerName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  reviewDate: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  reviewRating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBE6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reviewRatingText: { fontSize: 12, fontWeight: '900', color: '#B7791F' },
  reviewText: { fontSize: 13, color: '#475569', lineHeight: 20, fontWeight: '500' },
  
  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15 },
  footerPrice: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  footerSub: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  bookCTA: { backgroundColor: '#10B981', paddingHorizontal: 36, paddingVertical: 16, borderRadius: 20, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  bookCTAText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
});

export default GroundDetailScreen;
