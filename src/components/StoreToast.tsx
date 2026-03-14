import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

interface StoreToastProps {
    visible: boolean;
    message: string;
    type: 'cart' | 'wishlist';
    onHide: () => void;
}

const { width } = Dimensions.get('window');

export const StoreToast: React.FC<StoreToastProps> = ({ visible, message, type, onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();

            const timer = setTimeout(() => {
                hide();
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hide = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 10,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => onHide());
    };

    if (!visible) return null;

    return (
        <Animated.View style={[
            styles.container,
            { opacity, transform: [{ translateY }] }
        ]} pointerEvents="none">
            <View style={[styles.content, type === 'cart' ? styles.cartBg : styles.wishlistBg]}>
                <Ionicons
                    name={type === 'cart' ? "cart" : "heart"}
                    size={16}
                    color="#FFF"
                    style={styles.icon}
                />
                <Text style={styles.text}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: spacing.xl,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: radius.full,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    cartBg: {
        backgroundColor: '#1E293B',
    },
    wishlistBg: {
        backgroundColor: '#EF4444',
    },
    icon: {
        marginRight: 6,
    },
    text: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    }
});
