import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { colors, spacing, radius, typography } from '../../theme';
import { ProductCard, CategoryBadge, AddressEditModal } from '../../components/store';
import { AppHeader } from '../../components';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

type StoreNavProp = NativeStackNavigationProp<StoreStackParamList, 'StoreHome'>;

export const StoreHomeScreen: React.FC = () => {
    const navigation = useNavigation<StoreNavProp>();
    const { products, categories, shippingAddress, updateShippingAddress } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const { setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'CricStore',
                rightIcons: [
                    { name: 'heart-outline', onPress: () => navigation.navigate('Wishlist') },
                    { name: 'cart-outline', onPress: () => navigation.navigate('Cart') }
                ],
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation]);

    const trendingProducts = products.filter(p => p.isTrending);
    const flashSaleProducts = products.filter(p => p.isFlashSale);

    const renderHeroSlider = () => (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.heroSlider}
        >
            <View style={[styles.heroSlide, { backgroundColor: '#F97316' }]}>
                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>SEASON SALE</Text>
                    <Text style={styles.heroTitle}>Elite Gear{'\n'}Up to 40% Off</Text>
                    <TouchableOpacity
                        style={styles.heroButton}
                        onPress={() => navigation.navigate('ProductList', { categoryId: 'bats' })}
                    >
                        <Text style={styles.heroButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
                <Ionicons name="flash" size={120} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
            </View>
            <View style={[styles.heroSlide, { backgroundColor: '#005CE6' }]}>
                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>NEW ARRIVALS</Text>
                    <Text style={styles.heroTitle}>Official Match{'\n'}Jerseys 2024</Text>
                    <TouchableOpacity
                        style={styles.heroButton}
                        onPress={() => navigation.navigate('ProductList', { categoryId: 'jerseys' })}
                    >
                        <Text style={[styles.heroButtonText, { color: '#005CE6' }]}>Explore</Text>
                    </TouchableOpacity>
                </View>
                <Ionicons name="shirt" size={120} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
            >
                {/* Fixed Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color={colors.text.secondary} />
                        <TextInput
                            placeholder="Search CricStore / Order ID..."
                            placeholderTextColor={colors.text.tertiary}
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => navigation.navigate('ProductList', { search: searchQuery })}
                        />
                        <TouchableOpacity style={styles.voiceBtn}>
                            <Ionicons name="mic-outline" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Address Selector Bar */}
                    <TouchableOpacity 
                        style={styles.addressBar}
                        onPress={() => setAddressModalVisible(true)}
                    >
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={styles.addressBarText} numberOfLines={1}>
                            Deliver to {shippingAddress?.name || 'Set Address'} - {shippingAddress?.city || ''} {shippingAddress?.zip || ''}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={colors.text.secondary} />
                    </TouchableOpacity>
                </View>

                <AddressEditModal 
                    visible={addressModalVisible}
                    onClose={() => setAddressModalVisible(false)}
                    currentAddress={shippingAddress}
                    onSave={updateShippingAddress}
                />

                {/* Categories - "Flipkart Style" Circle Nav */}
                <View style={styles.categoryContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryList}
                    >
                        {categories.map(cat => (
                            <CategoryBadge
                                key={cat.id}
                                id={cat.id}
                                name={cat.name}
                                icon={cat.icon}
                                isActive={false}
                                onPress={(id) => navigation.navigate('ProductList', { categoryId: id })}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Hero Slider - High Fidelity */}
                {renderHeroSlider()}

                {/* Flash Sale Banner - Amazon Style "Deal of the Day" */}
                {flashSaleProducts.length > 0 && (
                    <TouchableOpacity
                        style={styles.dealOfTheDay}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('ProductList', {})}
                    >
                        <View style={styles.dealHeader}>
                            <View style={styles.dealTitleRow}>
                                <Text style={styles.dealTitle}>Deal of the Day</Text>
                                <View style={styles.timerBadge}>
                                    <Ionicons name="time-outline" size={14} color="#FFF" />
                                    <Text style={styles.timerText}> Ends in 04h 22m</Text>
                                </View>
                            </View>
                            <Text style={styles.seeAllDeal}>View All Deals</Text>
                        </View>
                        
                        <View style={styles.dealGrid}>
                            {flashSaleProducts.slice(0, 4).map(product => (
                                <TouchableOpacity 
                                    key={product.id} 
                                    style={styles.smallProductCard}
                                    onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                                >
                                    <Image source={{ uri: product.image }} style={styles.smallProductImage} />
                                    <Text style={styles.smallProductPrice}>₹{product.price.toLocaleString()}</Text>
                                    <View style={styles.discountTag}>
                                        <Text style={styles.discountTagText}>{product.discount} OFF</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                )}

                {/* Trending Gear Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Trending Gear</Text>
                            <Text style={styles.sectionSubtitle}>Most loved by crickets this week</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ProductList', {})} style={styles.viewAllBtn}>
                            <Text style={styles.viewAllBtnText}>SEE ALL</Text>
                            <Ionicons name="chevron-forward" size={14} color="#005CE6" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={trendingProducts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.trendingCard}>
                                <ProductCard
                                    product={item}
                                    onPress={(p) => navigation.navigate('ProductDetail', { productId: p.id })}
                                />
                            </View>
                        )}
                        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
                        contentContainerStyle={styles.horizontalList}
                    />
                </View>

                {/* Recommended Section - High Fidelity */}
                <View style={styles.recommendedSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Recommended for You</Text>
                            <Text style={styles.sectionSubtitle}>Handpicked gear for your playstyle</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ProductList', {})} style={styles.viewAllBtn}>
                            <Text style={styles.viewAllBtnText}>EXPLORE</Text>
                            <Ionicons name="apps" size={14} color="#005CE6" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.grid}>
                        {products.slice(20, 24).map(item => (
                            <View key={item.id} style={{ width: '48%' }}>
                                <ProductCard
                                    product={item}
                                    onPress={(p) => navigation.navigate('ProductDetail', { productId: p.id })}
                                />
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: spacing.xxl * 2 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Slightly off-white for e-commerce depth
    },
    searchSection: {
        padding: spacing.md,
        backgroundColor: colors.primary, // Amazon yellow/blue style, here staying with brand color
        paddingBottom: spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        fontSize: 14,
        color: colors.text.primary,
    },
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        backgroundColor: '#EFF6FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    addressBarText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: colors.text.secondary,
        marginHorizontal: 8,
    },
    voiceBtn: {
        padding: spacing.xs,
    },
    categoryContainer: {
        backgroundColor: '#FFF',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    categoryList: {
        paddingHorizontal: spacing.lg,
    },
    heroSlider: {
        paddingVertical: spacing.md,
    },
    heroSlide: {
        width: width - (spacing.md * 2),
        marginHorizontal: spacing.md,
        borderRadius: radius.lg,
        height: 160,
        padding: spacing.lg,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    heroTag: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 4,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 12,
        lineHeight: 28,
    },
    heroButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: radius.md,
        alignSelf: 'flex-start',
    },
    heroButtonText: {
        color: colors.primary,
        fontWeight: '800',
        fontSize: 12,
    },
    heroIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        opacity: 0.3,
        transform: [{ rotate: '-15deg' }],
    },
    dealOfTheDay: {
        margin: spacing.md,
        backgroundColor: '#FFF',
        borderRadius: radius.md,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    dealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    dealTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dealTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text.primary,
    },
    timerBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    seeAllDeal: {
        color: '#005CE6',
        fontSize: 12,
        fontWeight: '700',
    },
    dealGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallProductCard: {
        width: '23%',
        alignItems: 'center',
    },
    smallProductImage: {
        width: '100%',
        height: 70,
        borderRadius: radius.sm,
        backgroundColor: '#F8FAFC',
        marginBottom: 4,
    },
    smallProductPrice: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.text.primary,
    },
    discountTag: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2,
        marginTop: 2,
    },
    discountTagText: {
        color: '#166534',
        fontSize: 8,
        fontWeight: 'bold',
    },
    section: {
        marginTop: spacing.sm,
        backgroundColor: '#FFF',
        paddingVertical: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text.primary,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 2,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: radius.sm,
    },
    viewAllBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#005CE6',
        marginRight: 4,
    },
    horizontalList: {
        paddingHorizontal: spacing.lg,
    },
    trendingCard: {
        width: width * 0.45,
    },
    recommendedSection: {
        marginTop: spacing.sm,
        backgroundColor: '#FFF',
        paddingVertical: spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    }
});
