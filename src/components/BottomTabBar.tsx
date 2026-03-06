import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export interface TabItem {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface BottomTabBarProps {
    tabs?: TabItem[];
    activeTab?: string;
    onTabPress?: (id: string) => void;
}

// Renaming labels slightly to fit all 6 items nicely on one horizontal line
const DUMMY_TABS: TabItem[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'looking', label: 'Looking', icon: 'glasses' },
    { id: 'mycricket', label: 'My Cricket', icon: 'baseball' },
    { id: 'community', label: 'Community', icon: 'people' },
    { id: 'store', label: 'Store', icon: 'bag-handle' },
    { id: 'profile', label: 'More', icon: 'menu' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    tabs = DUMMY_TABS,
    activeTab = 'home',
    onTabPress = () => { },
}) => {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => onTabPress(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive ? tab.icon : (`${tab.icon}-outline` as keyof typeof Ionicons.glyphMap)}
                            size={22}
                            color={isActive ? '#005CE6' : colors.text.secondary} // exact blue indicator
                        />
                        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: colors.surface,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        justifyContent: 'space-evenly', // Evenly spaces them so they perfectly center without crowding edges
        paddingHorizontal: 2, // Remove inner padding to maximize width
    },
    tabItem: {
        flex: 1, // Distributes all 6 equally
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    tabLabel: {
        ...typography.presets.caption,
        fontSize: 9, // Reduced font to fit 6 items
        color: colors.text.secondary,
        marginTop: 2,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
    },
    activeTabLabel: {
        color: '#005CE6', // exact blue indicator
        fontWeight: typography.weights.bold,
    },
});
