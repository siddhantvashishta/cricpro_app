import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components';
import { colors, spacing, typography, radius } from '../theme';

// Dummy Categories
const STORE_CATEGORIES = [
    { id: 'all', name: 'All Gear' },
    { id: 'bats', name: 'Cricket Bats' },
    { id: 'balls', name: 'Balls' },
    { id: 'jerseys', name: 'Jerseys' },
    { id: 'equipments', name: 'Equipment' },
    { id: 'custom', name: 'Custom Kits' },
];

// Dummy Products
const TRENDING_PRODUCTS = [
    {
        id: '1',
        name: 'Pro Premium Willow Bat',
        price: '₹12,499',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: '2',
        name: 'Official Match Ball (Pack of 6)',
        price: '₹2,999',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1629888879586-773df4fb4b95?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: '3',
        name: 'Pro Series Batting Gloves',
        price: '₹1,299',
        rating: 4.6,
        image: 'https://plus.unsplash.com/premium_photo-1663047247754-52d37f193cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: '4',
        name: 'Elite Cricket Helmet',
        price: '₹3,499',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
];

export const StoreScreen: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const renderProduct = ({ item }: { item: typeof TRENDING_PRODUCTS[0] }) => (
        <TouchableOpacity style={styles.productCard} activeOpacity={0.8}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add" size={18} color={colors.text.inverse} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header configured for an e-commerce layout */}
            <AppHeader
                rightIcons={[
                    { name: 'search-outline' },
                    { name: 'cart-outline' }
                ]}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Search Bar Row (Store specific) */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search bats, jerseys, teams..."
                            placeholderTextColor={colors.text.secondary}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Promotional Hero Banner */}
                <View style={styles.heroBannerContainer}>
                    <View style={styles.heroBanner}>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTag}>SEASON SALE</Text>
                            <Text style={styles.heroTitle}>UP TO{'\n'}50% OFF</Text>
                            <TouchableOpacity style={styles.heroButton}>
                                <Text style={styles.heroButtonText}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Placeholder abstract sports shape */}
                        <Ionicons name="flash" size={100} color="rgba(255,255,255,0.15)" style={styles.heroDecoIcon} />
                    </View>
                </View>

                {/* Categories Slider */}
                <View style={styles.sectionContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {STORE_CATEGORIES.map(category => (
                            <TouchableOpacity
                                key={category.id}
                                style={[styles.categoryPill, activeCategory === category.id && styles.categoryPillActive]}
                                onPress={() => setActiveCategory(category.id)}
                            >
                                <Text style={[styles.categoryText, activeCategory === category.id && styles.categoryTextActive]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Custom Jersey Promo Section */}
                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={styles.customPromoCard} activeOpacity={0.9}>
                        <View style={styles.customPromoTextContainer}>
                            <Text style={styles.customPromoTitle}>Design Your Team Jersey</Text>
                            <Text style={styles.customPromoSub}>Fully customizable names, numbers & logos for your entire squad.</Text>
                            <Text style={styles.customPromoLink}>Start Designing <Ionicons name="arrow-forward" size={14} /></Text>
                        </View>
                        <View style={styles.customPromoIconContainer}>
                            <Ionicons name="shirt" size={60} color="#005CE6" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Trending Products Grid */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={TRENDING_PRODUCTS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderProduct}
                        numColumns={2}
                        scrollEnabled={false} // Disable since it's inside a ScrollView
                        columnWrapperStyle={styles.productRowSpacer}
                        contentContainerStyle={styles.productList}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: spacing.xxl * 1.5,
    },
    searchContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.surface,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        height: 44,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...typography.presets.body,
        color: colors.text.primary,
        height: '100%',
    },
    heroBannerContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        backgroundColor: colors.surface,
    },
    heroBanner: {
        backgroundColor: '#F97316', // Vibrant Orange
        borderRadius: radius.lg,
        padding: spacing.xl,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
    },
    heroContent: {
        flex: 1,
        zIndex: 2,
    },
    heroTag: {
        ...typography.presets.caption,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: typography.weights.bold,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    heroTitle: {
        ...typography.presets.h1,
        color: colors.text.inverse,
        fontSize: 32,
        lineHeight: 36,
        marginBottom: spacing.md,
    },
    heroButton: {
        backgroundColor: colors.text.inverse,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        borderRadius: radius.full,
    },
    heroButtonText: {
        ...typography.presets.bodySmall,
        color: '#F97316',
        fontWeight: typography.weights.bold,
    },
    heroDecoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -20,
        zIndex: 1,
        transform: [{ rotate: '-15deg' }],
    },
    sectionContainer: {
        marginTop: spacing.md,
        backgroundColor: colors.surface,
        paddingVertical: spacing.lg,
    },
    categoryScroll: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    categoryPill: {
        paddingHorizontal: spacing.xl,
        paddingVertical: 10,
        borderRadius: radius.full,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryPillActive: {
        backgroundColor: '#FFF0E6', // Light orange tint
        borderColor: '#F97316',
    },
    categoryText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    categoryTextActive: {
        color: '#F97316',
        fontWeight: typography.weights.bold,
    },
    customPromoCard: {
        marginHorizontal: spacing.lg,
        backgroundColor: '#F0F5FF', // Light blue
        borderRadius: radius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    customPromoTextContainer: {
        flex: 1,
        paddingRight: spacing.md,
    },
    customPromoTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: '#005CE6',
        marginBottom: 4,
    },
    customPromoSub: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        lineHeight: 18,
        marginBottom: spacing.sm,
    },
    customPromoLink: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: '#005CE6',
    },
    customPromoIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#005CE6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    seeAllText: {
        ...typography.presets.bodySmall,
        color: '#005CE6',
        fontWeight: typography.weights.bold,
    },
    productList: {
        paddingHorizontal: spacing.lg,
    },
    productRowSpacer: {
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    productCard: {
        width: '48%', // Allows 2 items per row with space between
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        // Soft e-commerce shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    productImageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: radius.md,
        borderTopRightRadius: radius.md,
        position: 'relative',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: radius.full,
        padding: 6,
    },
    productInfo: {
        padding: spacing.md,
    },
    productName: {
        ...typography.presets.caption,
        fontWeight: typography.weights.medium,
        color: colors.text.primary,
        height: 36, // Force double line height for alignment consistency
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    ratingText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginLeft: 4,
        fontSize: 11,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    addButton: {
        backgroundColor: '#000',
        borderRadius: radius.sm,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
