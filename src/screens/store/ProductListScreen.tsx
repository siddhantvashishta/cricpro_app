import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../../theme';
import { ProductCard } from '../../components/store';
import { useAppStore } from '../../store/useAppStore';

type ProductListRouteProp = RouteProp<StoreStackParamList, 'ProductList'>;
type ProductListNavProp = NativeStackNavigationProp<StoreStackParamList, 'ProductList'>;

export const ProductListScreen: React.FC = () => {
    const route = useRoute<ProductListRouteProp>();
    const navigation = useNavigation<ProductListNavProp>();
    const { products, categories, setHeaderConfig } = useAppStore();

    const [searchQuery, setSearchQuery] = useState(route.params?.search || '');
    const [activeCategory, setActiveCategory] = useState(route.params?.categoryId || 'all');
    const [sortBy, setSortBy] = useState('popular');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = products;

        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sorting
        if (sortBy === 'price_low') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'price_high') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

        return result;
    }, [activeCategory, searchQuery, sortBy, products]);

    const categoryName = activeCategory === 'all'
        ? 'All Products'
        : categories.find(c => c.id === activeCategory)?.name || 'Products';

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: categoryName,
                showBack: true,
                rightIcons: [
                    { name: 'options-outline', onPress: () => setIsFilterVisible(true) }
                ]
            });
        });
        return unsubscribe;
    }, [navigation, categoryName]);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={colors.text.secondary} />
                    <TextInput
                        placeholder="Search in this category..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.sortBar}>
                <Text style={styles.resultsCount}>{filteredProducts.length} Results</Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => { }}>
                    <Text style={styles.sortText}>Sort: {sortBy === 'popular' ? 'Popularity' : sortBy === 'price_low' ? 'Price: Low to High' : 'Price: High to Low'}</Text>
                    <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ width: '48%' }}>
                        <ProductCard
                            product={item}
                            onPress={(p) => navigation.navigate('ProductDetail', { productId: p.id })}
                        />
                    </View>
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color={colors.text.secondary} />
                        <Text style={styles.emptyText}>No products found matching your criteria</Text>
                    </View>
                }
            />

            {/* Simple Sort Modal */}
            <Modal
                transparent
                visible={isFilterVisible}
                animationType="fade"
                onRequestClose={() => setIsFilterVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsFilterVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort By</Text>
                        {[
                            { id: 'popular', label: 'Popularity' },
                            { id: 'price_low', label: 'Price: Low to High' },
                            { id: 'price_high', label: 'Price: High to Low' },
                            { id: 'rating', label: 'Customer Rating' },
                        ].map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.sortOption}
                                onPress={() => {
                                    setSortBy(item.id);
                                    setIsFilterVisible(false);
                                }}
                            >
                                <Text style={[styles.sortOptionLabel, sortBy === item.id && styles.sortOptionActive]}>
                                    {item.label}
                                </Text>
                                {sortBy === item.id && <Ionicons name="checkmark" size={20} color="#F97316" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchBarContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        ...typography.presets.bodySmall,
    },
    sortBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    resultsCount: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        ...typography.presets.caption,
        color: colors.text.primary,
        fontWeight: '700',
        marginRight: 4,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    },
    listContent: {
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        color: colors.text.secondary,
        ...typography.presets.body,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing.xl,
    },
    modalTitle: {
        ...typography.presets.h3,
        marginBottom: spacing.lg,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    sortOptionLabel: {
        ...typography.presets.body,
        color: colors.text.primary,
    },
    sortOptionActive: {
        color: '#F97316',
        fontWeight: 'bold',
    }
});
