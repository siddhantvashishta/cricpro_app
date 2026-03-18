import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions, StatusBar, TextInput, Alert, Modal, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { ArrowLeft, MapPin, Search, Filter, Star, Navigation, Zap, Trophy, CircleDot, Moon, ChevronRight, Calendar, ChevronLeft, Target, CloudSun } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import InstantMatchSummary from '../components/InstantMatchSummary';
import { mapService, Ground, Match } from '../services/mapService';
import WeatherWidget from '../components/WeatherWidget';
import PulsatingMarker from '../components/PulsatingMarker';
import BookingModal from '../components/BookingModal';

const { width } = Dimensions.get('window');

// Mock data moved to mapService.ts


const LocalCricketMapScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const mapRef = React.useRef<MapView>(null);
  const [isListView, setIsListView] = React.useState(false);
  const [grounds, setGrounds] = React.useState<Ground[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Filter & UI State
  const [activeFilter, setActiveFilter] = React.useState('All Grounds');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [bookingGround, setBookingGround] = React.useState<any>(null);
  
  // Modal advanced filters
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [distanceFilter, setDistanceFilter] = React.useState('Anywhere');
  const [pitchFilter, setPitchFilter] = React.useState('Any');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [g, m, w] = await Promise.all([
        mapService.getNearbyGrounds(),
        mapService.getActiveMatches(),
        mapService.getWeather(12.9716, 77.5946)
      ]);
      setGrounds(g);
      setMatches(m);
      setWeather(w);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMatches = React.useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const query = searchQuery.toLowerCase();
    return matches.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.teams.toLowerCase().includes(query) ||
      m.location.toLowerCase().includes(query)
    );
  }, [searchQuery, matches]);

  const filteredGrounds = React.useMemo(() => {
    return grounds.filter(ground => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!ground.name.toLowerCase().includes(query) && !ground.type.toLowerCase().includes(query)) {
          return false;
        }
      }

      let passChip = true;
      if (activeFilter === 'Live Matches') passChip = ground.isLive;
      if (activeFilter === 'Turf Wickets') passChip = ground.type.includes('Turf');
      if (activeFilter === 'Free to Play') passChip = ground.price === 'Free';
      if (activeFilter === 'Night Matches') passChip = ground.isNight;
      
      let passDistance = true;
      const distMatch = ground.distance.match(/\d+(\.\d+)?/);
      const distanceVal = distMatch ? parseFloat(distMatch[0]) : 99;
      if (distanceFilter === 'Within 3km') passDistance = distanceVal <= 3.0;
      if (distanceFilter === 'Within 5km') passDistance = distanceVal <= 5.0;

      let passPitch = true;
      if (pitchFilter !== 'Any') {
        passPitch = ground.type.includes(pitchFilter);
      }

      return passChip && passDistance && passPitch;
    });
  }, [searchQuery, activeFilter, distanceFilter, pitchFilter]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Absolute Map Background (Real Interactive Map) */}
      <View style={styles.mapBackground}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
          customMapStyle={mapStyle}
        >
          {filteredGrounds.map((ground) => {
            let Icon = MapPin;
            let bgColor = Colors.maroon;

            if (ground.isLive) {
              Icon = Zap;
              bgColor = '#FF3B30';
            } else if (ground.price === 'Free') {
              Icon = Star;
              bgColor = '#F59E0B';
            } else if (ground.type.includes('Stadium')) {
              Icon = Trophy;
              bgColor = '#3B82F6';
            } else if (ground.type.includes('Turf')) {
              Icon = CircleDot;
              bgColor = '#10B981';
            } else if (ground.isLive) {
               // repeat for clarity or special logic
            } else if (ground.isNight) {
              Icon = Moon;
              bgColor = '#8B5CF6';
            }

            return (
              <PulsatingMarker
                key={ground.id}
                coordinate={{ latitude: ground.lat, longitude: ground.lng }}
                title={ground.name}
                description={`${ground.rating}⭐ • ${ground.price}`}
                bgColor={bgColor}
                icon={Icon}
                label={ground.shortName || ground.name}
                isLive={ground.isLive}
              />
            );
          })}
        </MapView>
      </View>



      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>
        <View style={styles.searchRow}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={Colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}>
              <Search color={Colors.textSecondary} size={20} />
              <TextInput 
                placeholder="Search grounds, matches..."
                placeholderTextColor="#9ca3af"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {weather && (
              <View style={styles.compactWeather}>
                <View style={styles.weatherDivider} />
                <CloudSun color={Colors.maroon} size={18} />
                <Text style={styles.compactTemp}>{weather.temp}°</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
            <Filter color={Colors.text} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Quick Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilters}>
          {[
            { label: 'All Grounds', icon: Target },
            { label: 'Live Matches', icon: Zap },
            { label: 'Turf Wickets', icon: CircleDot },
            { label: 'Free to Play', icon: Star },
            { label: 'Night Matches', icon: Moon }
          ].map((f) => (
            <TouchableOpacity 
              key={f.label} 
              style={[styles.filterChip, activeFilter === f.label && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.label)}
            >
              <f.icon color={activeFilter === f.label ? Colors.white : '#64748B'} size={14} style={{ marginRight: 6 }} />
              <Text style={[styles.filterChipText, activeFilter === f.label && styles.filterChipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Floating Action Button for Map Recentering */}
      <TouchableOpacity 
        style={[styles.fabReCenter, { bottom: Dimensions.get('window').height > 800 ? 380 : 340 }]}
        onPress={() => {
          mapRef.current?.animateToRegion({
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }, 1000);
        }}
      >
        <Navigation color={Colors.maroon} size={20} />
      </TouchableOpacity>

      {/* Bottom Sheet UI */}
      <View style={[styles.bottomSheet, { height: isListView ? '85%' : '45%' }]}>
        <View style={styles.sheetHandle} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Action</Text>
            <TouchableOpacity onPress={() => setIsListView(!isListView)}>
              <Text style={styles.viewAllText}>{isListView ? 'Map View' : 'List View'}</Text>
            </TouchableOpacity>
          </View>

          {/* Active Matches Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesCarousel}>
            {filteredMatches.map(match => (
            <TouchableOpacity 
              key={match.id} 
              style={styles.liveMatchCard}
              onPress={() => navigation.navigate('LiveMatchDetail', { match })}
            >
              <View style={styles.liveBadgeRow}>
                <View style={[styles.liveDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={[styles.liveMatchTime, { color: '#FF3B30' }]}>{match.time}</Text>
              </View>
              <Text style={styles.liveMatchTitle}>{match.title}</Text>
              <Text style={styles.liveMatchTeams}>{match.teams}</Text>
              <View style={styles.matchLocationRow}>
                <MapPin color={Colors.textSecondary} size={12} />
                <Text style={styles.matchLocationText}>{match.location} • {match.distance}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: Colors.maroon, fontWeight: '700', marginRight: 2 }}>View Details</Text>
                <ChevronRight color={Colors.maroon} size={14} />
              </View>
            </TouchableOpacity>
          ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20, marginBottom: 12 }]}>Top Grounds Around You</Text>
          
          {/* Venues List */}
          <View style={styles.venuesContainer}>
            {filteredGrounds.map(ground => (
              <TouchableOpacity 
                key={ground.id} 
                style={styles.groundCard}
                onPress={() => navigation.navigate('GroundDetail', { ground })}
              >
                <Image source={{ uri: ground.image }} style={styles.groundImage} />
                <View style={styles.groundInfo}>
                  <View style={styles.groundTitleRow}>
                    <Text style={styles.groundName} numberOfLines={1}>{ground.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Star size={10} color="#B7791F" fill="#B7791F" />
                      <Text style={styles.ratingText}>{ground.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.groundDistance}>{ground.distance} away • {ground.type}</Text>
                  
                  <View style={styles.groundFooter}>
                    <Text style={styles.groundPrice}>{ground.price}</Text>
                    <TouchableOpacity 
                      style={styles.bookBtn}
                      onPress={() => setBookingGround(ground)}
                    >
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* Advanced Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Distance</Text>
            <View style={styles.filterOptionsRow}>
              {['Anywhere', 'Within 3km', 'Within 5km'].map(opt => (
                <TouchableOpacity 
                  key={opt}
                  style={[styles.modalFilterChip, distanceFilter === opt && styles.modalFilterChipActive]}
                  onPress={() => setDistanceFilter(opt)}
                >
                  <Text style={[styles.modalFilterChipText, distanceFilter === opt && styles.modalFilterChipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Pitch Type</Text>
            <View style={styles.filterOptionsRow}>
              {['Any', 'Turf', 'Matting', 'Open'].map(opt => (
                <TouchableOpacity 
                  key={opt}
                  style={[styles.modalFilterChip, pitchFilter === opt && styles.modalFilterChipActive]}
                  onPress={() => setPitchFilter(opt)}
                >
                  <Text style={[styles.modalFilterChipText, pitchFilter === opt && styles.modalFilterChipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity 
                style={styles.resetBtn}
                onPress={() => {
                  setDistanceFilter('Anywhere');
                  setPitchFilter('Any');
                  setActiveFilter('All Grounds');
                }}
              >
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyBtnText}>Apply ({filteredGrounds.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reusable Booking Modal */}
      <BookingModal 
        isVisible={!!bookingGround}
        onClose={() => setBookingGround(null)}
        ground={bookingGround}
        onConfirm={(data) => {
          setBookingGround(null);
          navigation.navigate('Checkout', { 
            mode: 'booking', 
            bookingData: data
          });
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.maroon} size="large" />
          <Text style={styles.loadingText}>Fetching Live Grounds...</Text>
        </View>
      )}

    </View>
  );
};

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Base map color
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
    height: '60%', 
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: -8,
    width: 130, // explicitly fixed width ensures 100% reliable Android Map renders
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  pinText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.text,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    height: '100%',
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  quickFilters: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
      android: { elevation: 2 },
    }),
  },
  filterChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  compactWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
  },
  weatherDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 4,
  },
  compactTemp: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  fabReCenter: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.maroon,
  },
  matchesCarousel: {
    paddingHorizontal: 20,
    gap: 12,
  },
  liveMatchCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: width * 0.65,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  liveMatchTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF3B30',
  },
  liveMatchTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  liveMatchTeams: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  matchLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchLocationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  venuesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  groundCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  groundImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  groundInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  groundTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  groundName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B7791F',
  },
  groundDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  groundFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groundPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text,
  },
  bookBtn: {
    backgroundColor: Colors.peach,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.maroon,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterModalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  closeModalText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  filterSectionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  filterOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  modalFilterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  modalFilterChipActive: { backgroundColor: '#FFF1F2', borderColor: Colors.maroon },
  modalFilterChipText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  modalFilterChipTextActive: { color: Colors.maroon },
  modalFooterActions: { flexDirection: 'row', gap: 16, marginTop: 10 },
  resetBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#F1F5F9' },
  resetBtnText: { fontSize: 16, fontWeight: '800', color: '#475569' },
  applyBtn: { flex: 2, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.maroon },
  applyBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },

  bookingModalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%' },
  bookingGroundName: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  bookingDetailsRow: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  bookingDetailPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  bookingDetailText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  calendarIconBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: Colors.maroon, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  dateChip: { paddingHorizontal: 16, paddingVertical: 12, height: 44, justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  dateChipActive: { backgroundColor: '#FFF1F2', borderColor: Colors.maroon },
  dateChipText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  dateChipTextActive: { color: Colors.maroon },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  slotChip: { width: (width - 48 - 20) / 3, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  slotChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  slotChipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  slotChipTextActive: { color: Colors.white },
  priceBreakdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', marginBottom: 16 },
  priceLabel: { fontSize: 14, fontWeight: '700', color: '#475569' },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  payBtn: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  payBtnText: { color: Colors.white, fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  centeredModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  calendarContent: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 16 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthNavBtn: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 8 },
  calendarMonthText: { fontSize: 16, fontWeight: '800', color: Colors.text },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  weekdayText: { width: '14%', textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '2%' },
  dayBox: { width: '12%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderRadius: 8 },
  dayBoxActive: { backgroundColor: Colors.maroon },
  dayText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  dayTextActive: { color: Colors.white },
  cancelBtn: { marginTop: 10, paddingVertical: 14, backgroundColor: '#F0F0F0', borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '800', color: Colors.text },

  timeModalContent: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, width: '90%', maxWidth: 360, alignItems: 'center' },
  timeModalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  timePickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginVertical: 30 },
  timeCol: { height: 160, width: 60, overflow: 'hidden' },
  timeUnit: { height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  timeUnitActive: { backgroundColor: '#FFF1F2' },
  timeUnitText: { fontSize: 24, fontWeight: '600', color: '#94A3B8' },
  timeUnitTextActive: { fontSize: 28, fontWeight: '900', color: Colors.maroon },
  timeSep: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  timeSaveBtn: { backgroundColor: Colors.maroon, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
  timeSaveBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 100 
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.maroon,
  },
});

export default LocalCricketMapScreen;
