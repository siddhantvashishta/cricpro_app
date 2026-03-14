import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform, Image } from 'react-native';
import { colors, typography } from '../theme';

export const FloatingCoinToss: React.FC = () => {
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<'H' | 'T' | null>(null);
    const spinValue = useRef(new Animated.Value(0)).current;

    const tossCoin = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setResult(null);

        // Reset spin
        spinValue.setValue(0);

        // Animate spin (multiple rotations)
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500, // 1.5 seconds flip
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            // Determine result after animation completes
            const randomVal = Math.random();
            const outcome = randomVal >= 0.5 ? 'H' : 'T';
            setResult(outcome);
            setIsFlipping(false);

            // Wait 3 seconds then clear
            setTimeout(() => {
                setResult(null);
            }, 3000);
        });
    };

    // Interpolate the rotation value
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1080deg'], // 3 full spins
    });

    return (
        <View style={styles.fabWrapper}>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={tossCoin}
            >
                {/* 3D Animated Coin */}
                <Animated.View style={[styles.coinContainer, { transform: [{ rotateY: spin }] }]}>
                    {isFlipping ? (
                        <View style={styles.coinFace}>
                            <Image
                                source={require('../../assets/toss.png')}
                                style={styles.coinImage}
                                resizeMode="cover"
                            />
                        </View>
                    ) : (
                        <View style={styles.coinFace}>
                            {result ? (
                                <View style={styles.resultContainer}>
                                    <Text style={styles.resultText}>{result}</Text>
                                </View>
                            ) : (
                                <Image
                                    source={require('../../assets/toss.png')}
                                    style={styles.coinImage}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 96, // Moved above the creation FAB for a cleaner stack
        right: 16,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinContainer: {
        width: 56, // Matches FAB
        height: 56, // Matches FAB
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinFace: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 28,
        overflow: 'hidden',
    },
    coinImage: {
        width: '100%',
        height: '100%',
    },
    resultContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F59E0B',
    },
    resultText: {
        ...typography.presets.h2,
        color: '#D97706',
        fontWeight: typography.weights.bold,
    }
});
