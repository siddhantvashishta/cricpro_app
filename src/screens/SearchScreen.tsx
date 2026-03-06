import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';

const RECENT_SEARCHES = [
    'Mighty Meteors',
    'PlayZone - Tennis Cricket',
    'Bengaluru Tournaments',
    'Pro Premium Willow Bat',
];

const TRENDING_TOPICS = [
    'Hades Big Bash Final',
    'Local Academies near me',
    'Top ranked batsmen',
    'Live match: MIB vs BSW'
];

export const SearchScreen: React.FC = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Search Header */}
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={colors.text.secondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search players, teams, matches..."
                        placeholderTextColor={colors.text.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={colors.text.secondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content Area */}
            <View style={styles.content}>

                {searchQuery.length === 0 ? (
                    <>
                        {/* Recent Searches */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent</Text>
                                <TouchableOpacity>
                                    <Text style={styles.clearText}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                            {RECENT_SEARCHES.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.searchItemRow} activeOpacity={0.7}>
                                    <Ionicons name="time-outline" size={20} color={colors.text.secondary} style={styles.listIcon} />
                                    <Text style={styles.searchItemText}>{item}</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#E4E4E7" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Trending Searches */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { marginBottom: spacing.md }]}>Trending</Text>
                            <View style={styles.chipContainer}>
                                {TRENDING_TOPICS.map((topic, index) => (
                                    <TouchableOpacity key={index} style={styles.chip} activeOpacity={0.7}>
                                        <Ionicons name="trending-up" size={14} color="#005CE6" style={styles.chipIcon} />
                                        <Text style={styles.chipText}>{topic}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    // Search Results Empty State (Active Search)
                    <View style={styles.activeSearchContainer}>
                        <Ionicons name="search-outline" size={48} color={colors.text.secondary} style={{ marginBottom: spacing.md }} />
                        <Text style={styles.activeSearchHint}>Searching for "{searchQuery}"</Text>
                        <Text style={styles.activeSearchSub}>Press enter or select below</Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Match app background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        minHeight: 60,
    },
    backButton: {
        padding: spacing.sm,
        marginRight: spacing.xs,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // light grey input
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        height: 40,
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...typography.presets.body,
        color: colors.text.primary,
        paddingHorizontal: spacing.sm,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xxl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    clearText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.bold,
    },
    searchItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    listIcon: {
        marginRight: spacing.md,
    },
    searchItemText: {
        ...typography.presets.body,
        color: colors.text.primary,
        flex: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F5FF', // light blue background
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    chipIcon: {
        marginRight: 6,
    },
    chipText: {
        ...typography.presets.bodySmall,
        color: '#005CE6',
        fontWeight: typography.weights.medium,
    },
    activeSearchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100, // Move it up slightly
    },
    activeSearchHint: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: 4,
    },
    activeSearchSub: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    }
});
