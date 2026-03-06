import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, LayoutAnimation, UIManager, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const FloatingCoinToss: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<'H' | 'T' | null>(null);
    const spinValue = useRef(new Animated.Value(0)).current;

    const tossCoin = () => {
        if (isFlipping || isExpanded) return;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(true);
        setIsFlipping(true);
        setResult(null);

        // Reset spin
        spinValue.setValue(0);

        // Animate spin (multiple rotations)
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500, // 1.5 seconds flip
            easing: Easing.out(Easing.cubic), // Slows down at end
            useNativeDriver: true,
        }).start(() => {
            // Determine result after animation completes using purely random 50/50 chance
            const randomVal = Math.random();
            const outcome = randomVal >= 0.5 ? 'H' : 'T';
            setResult(outcome);
            setIsFlipping(false);

            // Wait 3 seconds then shrink back
            setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsExpanded(false);
                // Clear the result a bit after it shrinks
                setTimeout(() => setResult(null), 300);
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
                style={[styles.container, !isExpanded && { paddingRight: 6 }]}
                activeOpacity={0.8}
                onPress={tossCoin}
            >
                {/* 3D Animated Coin */}
                <Animated.View style={[styles.coinContainer, { transform: [{ rotateY: spin }] }, !isExpanded && { marginRight: 0 }]}>
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
                                <Text style={styles.resultText}>{result}</Text>
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

                {/* Text Label Enhancing UX (Only shows when expanded) */}
                {isExpanded && (
                    <View style={styles.textWrapper}>
                        <Text style={styles.fabTitle}>
                            {isFlipping ? 'Toss the Coin' : result ? `It's ${result === 'H' ? 'Heads' : 'Tails'}!` : 'Toss the Coin'}
                        </Text>
                        {!isFlipping && !result && (
                            <Text style={styles.fabSubtitle}>Tap to flip</Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 24, // Sits above the tab bar since it will be inside screens
        right: 24, // Standard right margin
        zIndex: 999, // Ensure it floats above all other scrollable content
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8, // Strong drop shadow for floating effect on the wrapper
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 30,
        paddingLeft: 6,
        paddingRight: 16,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    coinContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface, // Clean white background for the PNG to pop
        borderWidth: 1,
        borderColor: colors.border, // Subtle border
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    coinFace: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 22,
        overflow: 'hidden', // Ensures the image doesn't overlap the exact circle
    },
    coinImage: {
        width: '100%',
        height: '100%',
    },
    resultText: {
        ...typography.presets.h3,
        color: '#D97706',
        fontWeight: typography.weights.bold,
    },
    textWrapper: {
        justifyContent: 'center',
    },
    fabTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    fabSubtitle: {
        ...typography.presets.caption,
        fontSize: 10,
        color: colors.text.secondary,
        marginTop: 2,
    }
});
