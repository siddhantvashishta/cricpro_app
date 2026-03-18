import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const MOCK_BOOKINGS = [
  {
    id: 'CP-X8K9M2LP',
    groundName: 'M. Chinnaswamy Stadium',
    location: 'Bengaluru, Karnataka',
    date: 'Fri, 20 Mar',
    slot: '18:00 - 19:00',
    price: '₹2500',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'CP-B3N1Z7QD',
    groundName: 'PlayArena Sarjapur',
    location: 'Bengaluru, Karnataka',
    date: 'Sat, 21 Mar',
    slot: '09:00 - 11:00',
    price: '₹1400',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'CP-A9V4C2WX',
    groundName: 'Let\'s Play Turf',
    location: 'Bengaluru, Karnataka',
    date: 'Sun, 15 Mar',
    slot: '20:00 - 21:00',
    price: '₹1000',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=400'
  }
];

const MyBookingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1A237E" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {MOCK_BOOKINGS.map(booking => (
          <TouchableOpacity 
            key={booking.id} 
            style={[styles.bookingCard, booking.status === 'Completed' && styles.bookingCardPast]}
            onPress={() => navigation.navigate('BookingSuccess', { bookingData: { name: booking.groundName, date: booking.date, slot: booking.slot, price: booking.price } })}
            activeOpacity={0.9}
          >
            <View style={styles.cardTop}>
              <Image source={{ uri: booking.image }} style={[styles.groundImage, booking.status === 'Completed' && { opacity: 0.7 }]} />
              <View style={styles.groundInfo}>
                <View style={styles.statusRow}>
                  <Text style={[styles.groundName, booking.status === 'Completed' && { color: '#64748B' }]} numberOfLines={1}>{booking.groundName}</Text>
                </View>
                <View style={styles.locationRow}>
                  <MapPin color={Colors.textSecondary} size={12} />
                  <Text style={styles.locationText}>{booking.location}</Text>
                </View>
                <View style={styles.badgeWrapper}>
                  <View style={[styles.statusBadge, booking.status === 'Completed' && styles.statusBadgePast]}>
                    <Text style={[styles.statusText, booking.status === 'Completed' && styles.statusTextPast]}>{booking.status}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardBottom}>
              <View style={styles.detailBlock}>
                <Calendar color="#64748B" size={14} />
                <Text style={styles.detailText}>{booking.date}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Clock color="#64748B" size={14} />
                <Text style={styles.detailText}>{booking.slot}</Text>
              </View>
              <View style={[styles.detailBlock, { flex: 1, justifyContent: 'flex-end' }]}>
                <Text style={[styles.priceText, booking.status === 'Completed' && { color: '#64748B' }]}>{booking.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A237E' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  
  listContainer: { padding: 16, gap: 16 },
  bookingCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  bookingCardPast: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  
  cardTop: { flexDirection: 'row', gap: 12 },
  groundImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#E2E8F0' },
  groundInfo: { flex: 1, justifyContent: 'space-between', paddingVertical: 2 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  groundName: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1, marginRight: 8 },
  badgeWrapper: { alignItems: 'flex-start', marginTop: 4 },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusBadgePast: { backgroundColor: '#E2E8F0' },
  statusTextPast: { color: '#64748B' },
  
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  detailBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  priceText: { fontSize: 15, fontWeight: '900', color: Colors.maroon },
});

export default MyBookingsScreen;
