import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFESSIONALS } from '../../data/mockProfessionals';

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
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const { matches, myTeams, communityPosts } = useAppStore();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const getSearchResults = () => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();

        const filteredMatches = matches.filter(m =>
            m.team_a.name.toLowerCase().includes(query) ||
            m.team_b.name.toLowerCase().includes(query) ||
            (m.location && m.location.toLowerCase().includes(query))
        ).map(m => ({ id: m.id, title: `${m.team_a.name} vs ${m.team_b.name}`, subtitle: m.location || 'TBA', type: 'Match', route: 'MatchDetails', params: { matchId: m.id } }));

        const filteredTeams = myTeams.filter(t =>
            (t.tournamentName && t.tournamentName.toLowerCase().includes(query)) ||
            (t.scheduledText && t.scheduledText.toLowerCase().includes(query))
        ).map(t => ({ id: t.id, title: t.tournamentName, subtitle: t.scheduledText, type: 'Team' }));

        const filteredPosts = communityPosts.filter(p =>
            (p.content && p.content.toLowerCase().includes(query)) ||
            (p.author?.name && p.author.name.toLowerCase().includes(query))
        ).map(p => ({ id: p.id, title: p.content, subtitle: `By ${p.author.name}`, type: 'Post', route: 'Community' }));

        const filteredProfessionals = MOCK_PROFESSIONALS.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        ).map(p => ({ id: p.id, title: p.name, subtitle: p.category, type: 'Pro' }));

        return [...filteredMatches, ...filteredTeams, ...filteredProfessionals, ...filteredPosts];
    };

    const searchResults = getSearchResults();

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
                    searchResults.length > 0 ? (
                        <FlatList
                            data={searchResults}
                            keyExtractor={item => item.id + item.type}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }: { item: any }) => (
                                <TouchableOpacity
                                    style={styles.resultItem}
                                    onPress={() => {
                                        if (item.route) {
                                            navigation.navigate(item.route, item.params);
                                        }
                                    }}
                                >
                                    <View style={styles.resultIconBg}>
                                        <Ionicons
                                            name={item.type === 'Match' ? 'baseball-outline' : item.type === 'Team' ? 'shield-outline' : item.type === 'Pro' ? 'person-outline' : 'document-text-outline'}
                                            size={20}
                                            color="#005CE6"
                                        />
                                    </View>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.resultSubtitle} numberOfLines={1}>{item.type} • {item.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        // Search Results Empty State (Active Search)
                        <View style={styles.activeSearchContainer}>
                            <Ionicons name="search-outline" size={48} color={colors.text.secondary} style={{ marginBottom: spacing.md }} />
                            <Text style={styles.activeSearchHint}>No results found for "{searchQuery}"</Text>
                            <Text style={styles.activeSearchSub}>Try searching for something else</Text>
                        </View>
                    )
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
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    resultIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    resultTextContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    resultTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    resultSubtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    }
});
