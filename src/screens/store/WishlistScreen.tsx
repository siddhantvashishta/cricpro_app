import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { colors, spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PRODUCTS } from '../../data/mockStoreData';
import { ProductCard } from '../../components/store';

const { width } = Dimensions.get('window');

type WishlistNavProp = NativeStackNavigationProp<StoreStackParamList, 'Wishlist'>;

export const WishlistScreen: React.FC = () => {
    const navigation = useNavigation<WishlistNavProp>();
    const { wishlist, setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'My Wishlist',
                showBack: true,
                rightIcons: [
                    { name: 'cart-outline', onPress: () => navigation.navigate('Cart') }
                ]
            });
        });
        return unsubscribe;
    }, [navigation]);

    // Map wishlist keys (IDs) to actual product objects
    const wishlistProducts = MOCK_PRODUCTS.filter(p => !!wishlist[p.id]);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={64} color={colors.text.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
                Save items you love to find them later and keep an eye on price drops.
            </Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('StoreHome')}
            >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            {wishlistProducts.length > 0 ? (
                <FlatList
                    data={wishlistProducts}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={{ width: '48%' }}>
                            <ProductCard
                                product={item}
                                onPress={(p) => navigation.navigate('ProductDetail', { productId: p.id })}
                            />
                        </View>
                    )}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                renderEmptyState()
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xxl,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4FB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        ...typography.presets.h2,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        ...typography.presets.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    shopButton: {
        backgroundColor: '#000',
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.lg,
        borderRadius: radius.lg,
    },
    shopButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
    }
});
