import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  FlatList, 
  Image, 
  TextInput,
  Platform 
} from 'react-native';
import { ArrowLeft, Search, MapPin, ExternalLink, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const MOCK_ASSOCIATIONS = [
  { 
    id: '1', 
    name: 'BCCI (Board of Control for Cricket in India)', 
    location: 'Mumbai, Maharashtra', 
    verified: true, 
    type: 'National Body',
    logo: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: '2', 
    name: 'DDCA (Delhi & District Cricket Association)', 
    location: 'New Delhi, Delhi', 
    verified: true, 
    type: 'State Association',
    logo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: '3', 
    name: 'MCA (Mumbai Cricket Association)', 
    location: 'Mumbai, Maharashtra', 
    verified: true, 
    type: 'State Association',
    logo: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: '4', 
    name: 'KSCA (Karnataka State Cricket Association)', 
    location: 'Bengaluru, Karnataka', 
    verified: true, 
    type: 'State Association',
    logo: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=200&auto=format&fit=crop'
  },
];

const AssociationsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const renderAssociation = ({ item }: any) => (
    <View style={styles.assocCard}>
      <View style={styles.assocHeader}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: item.logo }} style={styles.assocLogo} />
        </View>
        <View style={styles.assocInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.assocName}>{item.name}</Text>
            {item.verified && <ShieldCheck color="#4CAF50" size={16} fill="#4CAF50" />}
          </View>
          <Text style={styles.assocType}>{item.type}</Text>
          <View style={styles.locationRow}>
            <MapPin color="#64748B" size={12} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.visitBtn}>
        <Text style={styles.visitBtnText}>Visit Profile</Text>
        <ExternalLink color={Colors.maroon} size={14} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Associations</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color="#94A3B8" size={20} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search associations..." 
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList 
        data={MOCK_ASSOCIATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderAssociation}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.listTitle}>Official Cricket Bodies</Text>}
      />
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
  
  searchSection: { padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '600' },

  listContent: { padding: 16, paddingBottom: 30 },
  listTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
  
  assocCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  assocHeader: { flexDirection: 'row', gap: 16 },
  logoContainer: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#F8FAFC', overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  assocLogo: { width: '100%', height: '100%' },
  assocInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  assocName: { fontSize: 15, fontWeight: '800', color: '#1A237E' },
  assocType: { fontSize: 12, fontWeight: '700', color: Colors.maroon },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  
  visitBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    marginTop: 16, 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9' 
  },
  visitBtnText: { fontSize: 13, fontWeight: '800', color: Colors.maroon },
});

export default AssociationsScreen;
