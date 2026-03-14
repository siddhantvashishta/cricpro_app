import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ABHI_LOADING = require('../../../assets/abhiloading.png');

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Snappy Sequence
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 1500,
                useNativeDriver: true,
            })
        ]).start();

        // Faster exit
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 400,
                    useNativeDriver: true,
                })
            ]).start(() => {
                onAnimationComplete();
            });
        }, 1200); // Reduced wait time

        return () => clearTimeout(timer);
    }, [onAnimationComplete, fadeAnim, scaleAnim]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Animated.Image
                source={ABHI_LOADING}
                style={[
                    styles.image,
                    {
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
                resizeMode="cover"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020912',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 9 / 16, // Enforce 9:16 ratio
    },
});
