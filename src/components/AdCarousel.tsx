import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { spacing, radius, colors } from '../theme';

const { width } = Dimensions.get('window');

// Carousel item width is screen width minus padding
const ITEM_WIDTH = width - (spacing.screenPadding * 2);

interface AdItem {
    id: string;
    imageUrl: string;
    link?: string;
}

const DUMMY_ADS: AdItem[] = [
    { id: 'ad1', imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', link: 'https://example.com/ad1' },
    { id: 'ad2', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', link: 'https://example.com/ad2' },
    { id: 'ad3', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', link: 'https://example.com/ad3' },
    { id: 'ad4', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', link: 'https://example.com/ad4' },
    { id: 'ad5', imageUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', link: 'https://example.com/ad5' },
];

export const AdCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    useEffect(() => {
        const interval = setInterval(() => {
            if (DUMMY_ADS.length > 0) {
                const nextIndex = (currentIndex + 1) % DUMMY_ADS.length;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, 4000); // 4 seconds between scrolls

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handlePress = (link?: string) => {
        if (link) {
            // In a real app, use Linking.openURL(link) or internal navigation
            console.log('Navigating to:', link);
        }
    };

    const renderItem = ({ item }: { item: AdItem }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handlePress(item.link)}
            style={styles.slideContainer}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

            {/* Ad Badge */}
            <View style={styles.adBadge}>
                <View style={styles.adBadgeDot} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={DUMMY_ADS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + spacing.sm}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH + spacing.sm,
                    offset: (ITEM_WIDTH + spacing.sm) * index,
                    index,
                })}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {DUMMY_ADS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.dotActive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },
    listContent: {
        paddingHorizontal: spacing.screenPadding,
    },
    slideContainer: {
        width: ITEM_WIDTH,
        height: 100, // Mini height requirement
        marginRight: spacing.sm,
        borderRadius: radius.md,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors.border, // Fallback background
    },
    image: {
        width: '100%',
        height: '100%',
    },
    adBadge: {
        position: 'absolute',
        bottom: spacing.xs,
        right: spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    adBadgeDot: {
        width: 14,
        height: 6,
        backgroundColor: '#F97316', // Orange dot simulating an 'Ad' label natively
        borderRadius: 3,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.border,
        marginHorizontal: 3,
    },
    dotActive: {
        width: 16,
        backgroundColor: colors.primary,
    }
});
