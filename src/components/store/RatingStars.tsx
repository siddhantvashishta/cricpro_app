import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme';

interface RatingStarsProps {
    rating: number;
    size?: number;
    showText?: boolean;
    reviews?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    size = 14,
    showText = true,
    reviews
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : star - 0.5 <= rating ? "star-half" : "star-outline"}
                        size={size}
                        color="#FBBF24"
                    />
                ))}
            </View>
            {showText && (
                <Text style={[styles.ratingText, { fontSize: size * 0.8 }]}>
                    {rating} {reviews !== undefined && `(${reviews})`}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        marginRight: 4,
    },
    ratingText: {
        color: '#6B7280',
        fontWeight: '500',
    }
});
