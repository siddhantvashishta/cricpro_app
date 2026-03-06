import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { radius } from '../theme';

interface PromoBannerProps {
    imageUrl?: string;
}

// Dummy image resembling the widescreen ad banner
const DUMMY_BANNER = 'https://picsum.photos/seed/sports/800/200';

export const PromoBanner: React.FC<PromoBannerProps> = ({
    imageUrl = DUMMY_BANNER,
}) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 120, // Height to match the aspect ratio in design
        backgroundColor: '#000', // fallback
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
