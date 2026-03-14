import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../theme';

interface QuantityStepperProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    size?: 'small' | 'large';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    size = 'small'
}) => {
    const isSmall = size === 'small';
    const btnSize = isSmall ? 28 : 40;
    const iconSize = isSmall ? 18 : 24;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, { width: btnSize, height: btnSize }]}
                onPress={onDecrease}
            >
                <Ionicons name="remove" size={iconSize} color={colors.text.primary} />
            </TouchableOpacity>

            <Text style={[styles.quantity, { fontSize: isSmall ? 14 : 18 }]}>{quantity}</Text>

            <TouchableOpacity
                style={[styles.button, { width: btnSize, height: btnSize }]}
                onPress={onIncrease}
            >
                <Ionicons name="add" size={iconSize} color={colors.text.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        padding: 4,
    },
    button: {
        backgroundColor: '#FFF',
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quantity: {
        paddingHorizontal: spacing.lg,
        fontWeight: '700',
        color: colors.text.primary,
        minWidth: 40,
        textAlign: 'center',
    }
});
