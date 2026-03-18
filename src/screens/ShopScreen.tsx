import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { ShoppingCart, Search, Star, Tag, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SHOP_CATEGORIES = [
  { id: '1', name: 'Bats', icon: '🏏' },
  { id: '2', name: 'Balls', icon: '⚾' },
  { id: '3', name: 'Shoes', icon: '👟' },
  { id: '4', name: 'Kits', icon: '🎒' },
  { id: '5', name: 'Apparel', icon: '👕' },
];

const FEATURED_PRODUCTS = [
  { id: 'p1', name: 'Pro Master Willow Bat', price: '₹4,999', rating: '4.8', image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=400' },
  { id: 'p2', name: 'Premium Leather Ball (Box of 6)', price: '₹1,299', rating: '4.9', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400' },
  { id: 'p3', name: 'Elite Spikes Pro 2.0', price: '₹3,499', rating: '4.6', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 'p4', name: 'Complete Kit Bag', price: '₹8,999', rating: '4.7', image: 'https://images.unsplash.com/photo-1593341646654-2c77f0985c72?auto=format&fit=crop&q=80&w=400' },
];

const ShopScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CricPro Shop</Text>
          <Text style={styles.headerSubtitle}>Official Gear & Equipment</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <ShoppingCart color={Colors.text} size={24} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search color={Colors.textSecondary} size={20} />
            <Text style={styles.searchText}>Search bats, balls, gear...</Text>
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoTag}>
              <Tag color={Colors.white} size={12} />
              <Text style={styles.promoTagText}>SEASON SALE</Text>
            </View>
            <Text style={styles.promoTitle}>Up to 40% Off</Text>
            <Text style={styles.promoSubtitle}>On all English Willow Bats</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
            {SHOP_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryIconCell}>
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Gear</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {FEATURED_PRODUCTS.map(product => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <View style={styles.ratingBadge}>
                      <Star color="#FFD700" size={10} fill="#FFD700" />
                      <Text style={styles.ratingText}>{product.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.addToCartBtn}>
                  <Text style={styles.addToCartText}>Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A237E', // Deep Navy
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cartBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: -4,
    backgroundColor: Colors.maroon,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
  },
  searchText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
  },
  promoContent: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.maroon,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 12,
  },
  promoTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  promoBtn: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.maroon,
  },
  categoriesList: {
    paddingRight: 20,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconCell: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  productCard: {
    width: (width - 40 - 16) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  productInfo: {
    gap: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    minHeight: 36,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.maroon,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B7791F',
  },
  addToCartBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});

export default ShopScreen;
