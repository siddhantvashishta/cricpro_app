import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ImageSourcePropType } from 'react-native';
import { colors } from '../theme';

// Import the specific image provided by the user
// Using require since it's a local asset
const SPLASH_IMAGE = require('../../assets/loadingscreen.png');

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
    // Animation values
    const scaleValue = useRef(new Animated.Value(0.5)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animation on mount
        Animated.parallel([
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Small delay after animation completes before switching screens
            setTimeout(onAnimationComplete, 1200);
        });
    }, [onAnimationComplete, opacityValue, scaleValue]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={SPLASH_IMAGE}
                style={[
                    styles.image,
                    {
                        opacity: opacityValue,
                        transform: [{ scale: scaleValue }]
                    }
                ]}
                resizeMode="cover"
            />
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary, // Using the deep sports blue from theme
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
