import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components';
import { colors, spacing, typography, radius } from '../theme';

// Map of categories referencing the screenshot
const COMMUNITY_CATEGORIES = [
    { id: '1', title: 'Scorers', icon: 'clipboard-list-outline' },
    { id: '2', title: 'Umpires', icon: 'account-tie-hat' }, // Closest match to umpire with hat
    { id: '3', title: 'Commentators', icon: 'microphone-outline' },
    { id: '4', title: 'Streamers', icon: 'youtube-tv' }, // Video/play outline
    { id: '5', title: 'Organisers', icon: 'account-tie' },
    { id: '6', title: 'Academies', icon: 'school-outline' }, // Building
    { id: '7', title: 'Grounds', icon: 'stadium-outline' }, // Ground/stadium
    { id: '8', title: 'Box Cricket & Nets', icon: 'cricket' }, // generic cricket icon
];

export const CommunityScreen: React.FC = () => {

    const renderCategoryItem = ({ item }: { item: typeof COMMUNITY_CATEGORIES[0] }) => (
        <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.icon as any} size={42} color={colors.text.primary} />
            </View>
            <Text style={styles.categoryTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                rightIcons={[
                    { name: 'search' },
                    { name: 'chatbox-ellipses-outline' },
                    { name: 'funnel-outline' }
                ]}
            />

            {/* Location Header Row */}
            <View style={styles.locationHeader}>
                <Text style={styles.headerText}>
                    Cricket community in <Text style={styles.locationHighlight}>Bengaluru (Bangalore)</Text>
                </Text>
            </View>

            {/* Grid Layout */}
            <FlatList
                data={COMMUNITY_CATEGORIES}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={renderCategoryItem}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.rowSpacer}
                showsVerticalScrollIndicator={false}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // standard white backing
    },
    locationHeader: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // light divider
    },
    headerText: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    },
    locationHighlight: {
        color: '#F97316', // Orange highlight 
        fontWeight: typography.weights.bold,
    },
    gridContent: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    rowSpacer: {
        justifyContent: 'flex-start',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    categoryCard: {
        flex: 1,
        maxWidth: '31%', // To ensure 3 fit properly with gap
        minHeight: 110,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,

        // Soft shadow from design
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        marginBottom: spacing.sm,
    },
    categoryTitle: {
        ...typography.presets.caption,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
    }
});
