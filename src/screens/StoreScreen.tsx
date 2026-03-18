import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  FlatList, 
  Image, 
  Dimensions,
  Platform 
} from 'react-native';
import { ArrowLeft, ShoppingBag, Star, Filter } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const MOCK_PRODUCTS = [
  { 
    id: '1', 
    name: 'Pro Grade Willow Bat', 
    price: '₹12,499', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400&auto=format&fit=crop',
    category: 'Bats'
  },
  { 
    id: '2', 
    name: 'Elite Leather Ball (Set of 6)', 
    price: '₹2,199', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=400&auto=format&fit=crop',
    category: 'Balls'
  },
  { 
    id: '3', 
    name: 'CricPro Team Jersey', 
    price: '₹999', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=400&auto=format&fit=crop',
    category: 'Apparel'
  },
  { 
    id: '4', 
    name: 'Professional Batting Pads', 
    price: '₹3,499', 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=400&auto=format&fit=crop',
    category: 'Protective'
  },
];

const CATEGORIES = ['All', 'Bats', 'Balls', 'Apparel', 'Protective'];

const StoreScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const renderProduct = ({ item }: any) => (
    <Pressable style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.ratingBadge}>
          <Star color="#FFD700" size={12} fill="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.categoryLabel}>{item.category}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color={Colors.white} size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Cricpro Store</Text>
        </View>
        <Pressable style={styles.filterBtn}>
          <Filter color={Colors.white} size={20} />
        </Pressable>
      </View>

      <View style={styles.categoryScroll}>
        <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable 
              style={[styles.categoryBtn, activeCategory === item && styles.categoryBtnActive]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>{item}</Text>
            </Pressable>
          )}
          contentContainerStyle={styles.categoryContent}
        />
      </View>

      <FlatList 
        data={MOCK_PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    backgroundColor: Colors.maroon,
    paddingTop: Platform.OS === 'android' ? 40 : 16
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.white },
  filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  categoryScroll: { backgroundColor: Colors.white, paddingVertical: 12 },
  categoryContent: { paddingHorizontal: 16 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  categoryBtnActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  categoryText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  categoryTextActive: { color: Colors.white },

  listContent: { padding: 16, paddingBottom: 30 },
  productCard: { 
    width: COLUMN_WIDTH, 
    backgroundColor: Colors.white, 
    borderRadius: 20, 
    marginBottom: 16, 
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden'
  },
  imageContainer: { width: '100%', height: 160, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  ratingBadge: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  ratingText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  productInfo: { padding: 12 },
  categoryLabel: { fontSize: 10, fontWeight: '800', color: Colors.maroon, textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: '900', color: '#1A237E', marginBottom: 6 },
  productPrice: { fontSize: 16, fontWeight: '900', color: Colors.maroon },
});

export default StoreScreen;
