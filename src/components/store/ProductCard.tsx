import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { Product } from '../../data/mockStoreData';
import { RatingStars } from './RatingStars';
import { useAppStore } from '../../store/useAppStore';
import { StoreToast } from '../StoreToast';

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const { addToCart, wishlist, toggleWishlist } = useAppStore();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ message: string; type: 'cart' | 'wishlist' }>({
        message: '',
        type: 'cart'
    });

    const isWishlisted = !!wishlist[product.id];

    const handleWishlist = () => {
        toggleWishlist(product.id);
        const msg = isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist';
        setToastConfig({ message: msg, type: 'wishlist' });
        setToastVisible(true);
    };

    const handleAddToCart = () => {
        addToCart(product);
        setToastConfig({ message: 'Added to Cart', type: 'cart' });
        setToastVisible(true);
    };

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.9}
                onPress={() => onPress(product)}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

                    {product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount} OFF</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={handleWishlist}
                    >
                        <Ionicons
                            name={isWishlisted ? "heart" : "heart-outline"}
                            size={18}
                            color={isWishlisted ? "#EF4444" : colors.text.secondary}
                        />
                    </TouchableOpacity>

                    {/* Premium Assurance Badge */}
                    <View style={styles.assuredBadge}>
                        <Ionicons name="checkmark-circle" size={10} color="#005CE6" />
                        <Text style={styles.assuredText}>CricAssured</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
                    <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

                    <View style={styles.ratingRow}>
                        <RatingStars rating={product.rating} reviews={product.reviews} size={10} />
                        <Text style={styles.reviewCount}>({product.reviews})</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
                            {product.originalPrice && (
                                <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</Text>
                            )}
                        </View>
                        {product.discount && (
                            <Text style={styles.discountColorText}>{product.discount} saved today</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddToCart}
                    >
                        <Ionicons name="cart-outline" size={16} color="#FFF" />
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            <StoreToast
                visible={toastVisible}
                message={toastConfig.message}
                type={toastConfig.type}
                onHide={() => setToastVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: '100%',
        marginBottom: spacing.md,
    },
    container: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#F8FAFC',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#22C55E', // Green badge for positive feeling
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomRightRadius: radius.md,
        zIndex: 5,
    },
    discountText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    assuredBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.95)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    assuredText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#005CE6',
        marginLeft: 2,
        fontStyle: 'italic',
    },
    content: {
        padding: spacing.md,
    },
    brand: {
        fontSize: 11,
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
        fontWeight: '600',
    },
    name: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 6,
        height: 36,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewCount: {
        fontSize: 10,
        color: colors.text.tertiary,
        marginLeft: 4,
    },
    priceContainer: {
        marginBottom: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.text.primary,
    },
    originalPrice: {
        fontSize: 12,
        color: colors.text.tertiary,
        textDecorationLine: 'line-through',
    },
    discountColorText: {
        fontSize: 11,
        color: '#22C55E',
        fontWeight: 'bold',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#005CE6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: radius.md,
        gap: 6,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
    }
});
