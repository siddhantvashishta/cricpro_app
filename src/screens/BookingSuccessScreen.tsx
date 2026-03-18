import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Image, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Calendar, Clock, MapPin, Receipt, Share2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const BookingSuccessScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { bookingData } = route.params || {};

  // Random booking ID
  const bookingId = React.useMemo(() => 'CP-' + Math.random().toString(36).substr(2, 8).toUpperCase(), []);

  // Pop animation
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, opacityAnim]);

  const handleShare = async () => {
    try {
      const message = `Check out my cricket ground booking at ${bookingData?.name || 'the stadium'}!\nDate: ${bookingData?.date || 'Today'}\nTime: ${bookingData?.slot || '18:00 - 19:00'}\nBooking ID: ${bookingId}\nBook your matches on CricPro!`;
      await Share.share({
        message,
        title: 'CricPro Booking Details',
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, alignItems: 'center' }}>
          <View style={styles.iconCircle}>
            <CheckCircle2 color={Colors.white} size={64} strokeWidth={2.5} />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSub}>Your slot has been successfully reserved.</Text>
        </Animated.View>

        <Animated.View style={[styles.ticketContainer, { opacity: opacityAnim, transform: [{ translateY: opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
          {/* Top Ticket Section */}
          <View style={styles.ticketTop}>
            <Text style={styles.groundName}>{bookingData?.name || 'M. Chinnaswamy Stadium'}</Text>
            <View style={styles.locationRow}>
              <MapPin color={Colors.textSecondary} size={14} />
              <Text style={styles.locationText}>Bengaluru, Karnataka</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoBlock}>
                <View style={styles.infoLabelRow}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.infoLabel}>Date</Text>
                </View>
                <Text style={styles.infoValue}>{bookingData?.date || 'Today'}</Text>
              </View>
              
              <View style={styles.infoBlock}>
                <View style={styles.infoLabelRow}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.infoLabel}>Time Slot</Text>
                </View>
                <Text style={styles.infoValue}>{bookingData?.slot || '18:00 - 19:00'}</Text>
              </View>
            </View>
          </View>

          {/* Ticket Tear Effect */}
          <View style={styles.tearRow}>
            <View style={styles.tearHoleLeft} />
            <View style={styles.tearDashLine} />
            <View style={styles.tearHoleRight} />
          </View>

          {/* Bottom Ticket Section */}
          <View style={styles.ticketBottom}>
            <View style={styles.paymentRow}>
              <View>
                <Text style={styles.infoLabel}>Booking ID</Text>
                <Text style={styles.bookingIdText}>{bookingId}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.infoLabel}>Total Paid</Text>
                <Text style={styles.priceValue}>{bookingData?.price || '₹2500'}</Text>
              </View>
            </View>

            <View style={styles.qrContainer}>
              <View style={styles.qrFrame}>
                <Image 
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}` }} 
                  style={styles.qrImage} 
                />
              </View>
              <Text style={styles.qrText}>Show this at the venue counter</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={handleShare}
          >
            <Share2 color={Colors.maroon} size={20} />
            <Text style={styles.secondaryBtnText}>Share Details</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E293B' }, // Dark slate background makes the ticket pop
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  successTitle: { fontSize: 28, fontWeight: '900', color: Colors.white, marginBottom: 8, letterSpacing: -0.5 },
  successSub: { fontSize: 16, color: '#94A3B8', marginBottom: 40 },

  ticketContainer: { 
    width: width - 40, 
    backgroundColor: Colors.white, 
    borderRadius: 24, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20
  },
  ticketTop: { padding: 24, backgroundColor: Colors.white },
  groundName: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBlock: { flex: 1 },
  infoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  tearRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white },
  tearHoleLeft: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1E293B', marginLeft: -15 },
  tearDashLine: { flex: 1, height: 2, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginHorizontal: 10 },
  tearHoleRight: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1E293B', marginRight: -15 },

  ticketBottom: { padding: 24, backgroundColor: '#F8FAFC' },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  bookingIdText: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 4, letterSpacing: 1 },
  priceValue: { fontSize: 20, fontWeight: '900', color: '#10B981', marginTop: 2 },

  qrContainer: { alignItems: 'center', marginTop: 12 },
  qrFrame: { backgroundColor: Colors.white, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  qrImage: { width: 120, height: 120 },
  qrText: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 12 },

  actionsContainer: { width: width - 40, marginTop: 40, gap: 16 },
  primaryBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  primaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  secondaryBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 18, borderRadius: 16 },
  secondaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
});

export default BookingSuccessScreen;
