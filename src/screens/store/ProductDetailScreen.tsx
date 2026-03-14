import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../../theme';
import { MOCK_PRODUCTS } from '../../data/mockStoreData';
import { RatingStars, ProductCard } from '../../components/store';
import { useAppStore } from '../../store/useAppStore';
import { StoreToast } from '../../components/StoreToast';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<StoreStackParamList, 'ProductDetail'>;
type ProductDetailNavProp = NativeStackNavigationProp<StoreStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const navigation = useNavigation<ProductDetailNavProp>();
    const { productId } = route.params;

    const { addToCart, wishlist, toggleWishlist, setHeaderConfig } = useAppStore();
    const product = MOCK_PRODUCTS.find(p => p.id === productId);

    const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0]);
    const [selectedWeight, setSelectedWeight] = useState(product?.variants?.weights?.[0]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ message: string; type: 'cart' | 'wishlist' }>({
        message: '',
        type: 'cart'
    });

    if (!product) return null;

    const isWishlisted = !!wishlist[product.id];

    const showToast = (message: string, type: 'cart' | 'wishlist') => {
        setToastConfig({ message, type });
        setToastVisible(true);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this ${product.name} on CricPro Store! ₹${product.price}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleWishlist = () => {
        toggleWishlist(product.id);
        showToast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist', 'wishlist');
    };

    const relatedProducts = MOCK_PRODUCTS
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: '', // Transparent vibe
                showBack: true,
                rightIcons: [
                    { name: 'share-social-outline', onPress: handleShare },
                    { name: 'cart-outline', onPress: () => navigation.navigate('Cart') }
                ]
            });
        });
        return unsubscribe;
    }, [navigation, product]);
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.mainImage} />
                    
                    {/* Badge Overlay */}
                    <View style={styles.badgingContainer}>
                        {product.isTrending && (
                            <View style={styles.trendingBadge}>
                                <Ionicons name="trending-up" size={12} color="#FFF" />
                                <Text style={styles.badgeText}>TRENDING</Text>
                            </View>
                        )}
                        <View style={[styles.trendingBadge, { backgroundColor: '#005CE6', marginTop: 8 }]}>
                            <Ionicons name="shield-checkmark" size={12} color="#FFF" />
                            <Text style={styles.badgeText}>AUTHENTIC</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.wishlistFloat}
                        onPress={handleWishlist}
                    >
                        <Ionicons
                            name={isWishlisted ? "heart" : "heart-outline"}
                            size={24}
                            color={isWishlisted ? "#EF4444" : colors.text.primary}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.brandRow}>
                        <Text style={styles.brand}>{product.brand}</Text>
                        <View style={styles.assuredBadge}>
                            <Ionicons name="checkmark-circle" size={12} color="#005CE6" />
                            <Text style={styles.assuredText}>CricAssured</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.name}>{product.name}</Text>

                    <View style={styles.ratingRow}>
                        <RatingStars rating={product.rating} reviews={product.reviews} size={14} />
                        <Text style={styles.reviewLink}>{product.reviews} ratings</Text>
                    </View>

                    <View style={styles.priceCard}>
                        <View style={styles.priceMainRow}>
                            <Text style={styles.priceSymbol}>₹</Text>
                            <Text style={styles.price}>{product.price.toLocaleString()}</Text>
                            {product.discount && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{product.discount} OFF</Text>
                                </View>
                            )}
                        </View>
                        {product.originalPrice && (
                            <Text style={styles.originalPriceRow}>
                                M.R.P.: <Text style={styles.strikePrice}>₹{product.originalPrice.toLocaleString()}</Text>
                            </Text>
                        )}
                        <Text style={styles.taxInfo}>Inclusive of all taxes</Text>
                    </View>

                    {/* Delivery Info */}
                    <View style={styles.deliverySection}>
                        <View style={styles.deliveryItem}>
                            <Ionicons name="cube-outline" size={20} color={colors.text.secondary} />
                            <View style={styles.deliveryTextCol}>
                                <Text style={styles.deliveryTitle}>FREE Delivery</Text>
                                <Text style={styles.deliverySubtitle}>By tomorrow, Mar 15</Text>
                            </View>
                        </View>
                        <View style={styles.deliveryItem}>
                            <Ionicons name="return-up-back-outline" size={20} color={colors.text.secondary} />
                            <View style={styles.deliveryTextCol}>
                                <Text style={styles.deliveryTitle}>7 Days Replacement</Text>
                                <Text style={styles.deliverySubtitle}>Free & easy returns</Text>
                            </View>
                        </View>
                    </View>

                    {/* Variants */}
                    {product.variants?.sizes && (
                        <View style={styles.variantSection}>
                            <Text style={styles.variantTitle}>Select Size</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.variantList}>
                                    {product.variants.sizes.map(size => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[styles.sizeOption, selectedSize === size && styles.activeVariant]}
                                            onPress={() => setSelectedSize(size)}
                                        >
                                            <Text style={[styles.variantLabel, selectedSize === size && styles.activeVariantText]}>
                                                {size}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Specifications */}
                    {product.specifications && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Product Specifications</Text>
                            <View style={styles.specContainer}>
                                {Object.entries(product.specifications).map(([key, val], idx) => (
                                    <View key={key} style={[styles.specRow, idx % 2 === 0 && styles.evenSpecRow]}>
                                        <Text style={styles.specKey}>{key}</Text>
                                        <Text style={styles.specValue}>{val}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this item</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    {/* Related Products */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Similar Items</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ProductList', { categoryId: product.category })}>
                                <Text style={styles.seeAllLink}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
                            {relatedProducts.map(item => (
                                <View key={item.id} style={styles.relatedCardWrapper}>
                                    <ProductCard
                                        product={item}
                                        onPress={(p) => navigation.push('ProductDetail', { productId: p.id })}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Sticky Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => {
                        addToCart(product);
                        showToast('Added to Cart', 'cart');
                    }}
                >
                    <Ionicons name="cart-outline" size={20} color="#000" />
                    <Text style={styles.cartBtnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => {
                        addToCart(product);
                        navigation.navigate('Checkout');
                    }}
                >
                    <Text style={styles.buyBtnText}>Buy Now</Text>
                </TouchableOpacity>
            </View>

            <StoreToast
                visible={toastVisible}
                message={toastConfig.message}
                type={toastConfig.type}
                onHide={() => setToastVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        backgroundColor: '#F8FAFC',
    },
    imageContainer: {
        width: width,
        height: width * 1.1,
        backgroundColor: '#FFF',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    badgingContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    wishlistFloat: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        backgroundColor: '#FFF',
        paddingTop: spacing.lg,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        marginTop: -radius.xl,
        paddingHorizontal: spacing.lg,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    brand: {
        fontSize: 14,
        fontWeight: '700',
        color: '#005CE6',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    assuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    assuredText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#005CE6',
        marginLeft: 2,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        lineHeight: 28,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewLink: {
        fontSize: 13,
        color: '#005CE6',
        marginLeft: 8,
        fontWeight: '600',
    },
    priceCard: {
        backgroundColor: '#F8FAFC',
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: 20,
    },
    priceMainRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceSymbol: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginRight: 2,
    },
    price: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
    },
    originalPriceRow: {
        fontSize: 13,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    strikePrice: {
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#22C55E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 12,
        alignSelf: 'center',
    },
    discountText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '900',
    },
    taxInfo: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 8,
    },
    deliverySection: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
        paddingVertical: 16,
        marginBottom: 24,
    },
    deliveryItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    deliveryTextCol: {
        flex: 1,
    },
    deliveryTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.text.primary,
    },
    deliverySubtitle: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 2,
    },
    variantSection: {
        marginBottom: 24,
    },
    variantTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 12,
        color: colors.text.primary,
    },
    variantList: {
        flexDirection: 'row',
    },
    sizeOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 10,
        backgroundColor: '#F8FAFC',
    },
    activeVariant: {
        borderColor: '#005CE6',
        backgroundColor: '#EFF6FF',
    },
    variantLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text.secondary,
    },
    activeVariantText: {
        color: '#005CE6',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 16,
        color: colors.text.primary,
    },
    specContainer: {
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: radius.md,
        overflow: 'hidden',
    },
    specRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    evenSpecRow: {
        backgroundColor: '#F8FAFC',
    },
    specKey: {
        flex: 1,
        fontSize: 13,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    specValue: {
        flex: 1.5,
        fontSize: 13,
        color: colors.text.primary,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllLink: {
        color: '#005CE6',
        fontWeight: '700',
        fontSize: 13,
    },
    relatedList: {
        paddingRight: 20,
    },
    relatedCardWrapper: {
        width: 160,
        marginRight: 12,
    },
    bottomBar: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 12,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    cartBtn: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#000',
        gap: 8,
    },
    cartBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#000',
    },
    buyBtn: {
        flex: 1,
        height: 50,
        backgroundColor: colors.primary, // Brand blue
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buyBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
    }
});
