import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';

interface CategoryBadgeProps {
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
    onPress: (id: string) => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
    id,
    name,
    icon,
    isActive,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, isActive && styles.activeContainer]}
            activeOpacity={0.8}
            onPress={() => onPress(id)}
        >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <MaterialCommunityIcons
                    name={icon as any}
                    size={24}
                    color={isActive ? colors.text.inverse : colors.text.secondary}
                />
            </View>
            <Text style={[styles.name, isActive && styles.activeName]}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    activeContainer: {
        // Optional active state styling
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeIconContainer: {
        backgroundColor: '#F97316',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    name: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    activeName: {
        color: '#F97316',
        fontWeight: '700',
    }
});
