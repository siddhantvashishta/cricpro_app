import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import { QuantityStepper } from './QuantityStepper';

interface CartItemProps {
    item: any;
    onUpdateQuantity: (id: string, q: number) => void;
    onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.brand}>{item.brand}</Text>
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onRemove(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                    <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#F3F4FB',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: radius.md,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        marginLeft: spacing.lg,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    brand: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        textTransform: 'uppercase',
    },
    name: {
        ...typography.presets.bodySmall,
        fontWeight: '700',
        color: colors.text.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text.primary,
    }
});
