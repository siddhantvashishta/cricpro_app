import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StoreStackParamList } from '../../navigation/StoreNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

type OrderSuccessRouteProp = RouteProp<StoreStackParamList, 'OrderSuccess'>;
type OrderSuccessNavProp = NativeStackNavigationProp<StoreStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC = () => {
    const route = useRoute<OrderSuccessRouteProp>();
    const navigation = useNavigation<OrderSuccessNavProp>();
    const { orderId } = route.params;
    const { setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'Order Placed',
                showBack: false, // Don't allow going back to checkout
                rightIcons: []
            });
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color="#10B981" />
                </View>

                <Text style={styles.title}>Order Placed!</Text>
                <Text style={styles.subtitle}>Your cricket gear is on the way. We've sent the details to your email.</Text>

                <View style={styles.orderInfo}>
                    <Text style={styles.orderLabel}>Order ID</Text>
                    <Text style={styles.orderValue}>{orderId}</Text>
                </View>

                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('TrackOrder', { orderId })}
                >
                    <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate('StoreHome')}
                >
                    <Text style={styles.continueButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        padding: spacing.xxl,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...typography.presets.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.xl,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        marginBottom: 48,
    },
    orderLabel: {
        color: colors.text.secondary,
        marginRight: 12,
        fontWeight: '600',
    },
    orderValue: {
        fontWeight: '800',
        color: colors.text.primary,
    },
    trackButton: {
        width: width * 0.8,
        height: 56,
        backgroundColor: '#000',
        borderRadius: radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    trackButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
    },
    continueButton: {
        width: width * 0.8,
        height: 56,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        fontWeight: '800',
        fontSize: 16,
    }
});
