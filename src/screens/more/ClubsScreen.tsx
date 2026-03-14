import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, shadows } from '../../theme';
import { AppHeader } from '../../components';

const CLUBS = [
    {
        id: '1',
        name: 'MCC',
        fullName: 'Marylebone Cricket Club',
        location: 'London, UK',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Marylebone_Cricket_Club_logo.svg/1200px-Marylebone_Cricket_Club_logo.svg.png',
        members: '18,500+',
        founded: '1787'
    },
    {
        id: '2',
        name: 'Sydney Cricket Club',
        fullName: 'Sydney Cricket Club',
        location: 'Sydney, Australia',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Sydney_Cricket_Ground_logo.svg/1200px-Sydney_Cricket_Ground_logo.svg.png',
        members: '5,000+',
        founded: '1894'
    },
    {
        id: '3',
        name: 'Mumbai Cricket Club',
        fullName: 'Mumbai Cricket Club',
        location: 'Mumbai, India',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/BCCI_logo.svg/1200px-BCCI_logo.svg.png', // Generic BCCI logo for now
        members: '12,000+',
        founded: '1930'
    },
    {
        id: '4',
        name: 'Royal Challengers',
        fullName: 'Royal Challengers Cricket Club',
        location: 'Bangalore, India',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Royal_Challengers_Bangalore_logo.svg/1200px-Royal_Challengers_Bangalore_logo.svg.png',
        members: '2,500+',
        founded: '2008'
    },
    {
        id: '5',
        name: 'Cape Town Cricket Club',
        fullName: 'Cape Town Cricket Club',
        location: 'Cape Town, SA',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Cricket_South_Africa_logo.svg/1200px-Cricket_South_Africa_logo.svg.png',
        members: '1,200+',
        founded: '1844'
    }
];

export const ClubsScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [followed, setFollowed] = useState<Record<string, boolean>>({});

    const filteredClubs = CLUBS.filter(club =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.location.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFollow = (id: string) => {
        setFollowed(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderClub = ({ item }: { item: typeof CLUBS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.logoBadge}>
                    <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
                </View>
                <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{item.name}</Text>
                    <Text style={styles.clubLocation}>
                        <Ionicons name="location-outline" size={12} color={colors.text.tertiary} /> {item.location}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.followButton, followed[item.id] && styles.followedButton]}
                    onPress={() => toggleFollow(item.id)}
                >
                    <Text style={[styles.followText, followed[item.id] && styles.followedText]}>
                        {followed[item.id] ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.members}</Text>
                    <Text style={styles.statLabel}>Members</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.founded}</Text>
                    <Text style={styles.statLabel}>Founded</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <TouchableOpacity style={styles.viewMore}>
                        <Text style={styles.viewMoreText}>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Cricket Clubs" showBack />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search clubs, regions..."
                    placeholderTextColor={colors.text.tertiary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredClubs}
                keyExtractor={item => item.id}
                renderItem={renderClub}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <Text style={styles.featuredTitle}>Featured Clubs</Text>
                        <Text style={styles.featuredDesc}>Discover and connect with prestigious cricket clubs worldwide.</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Ionicons name="business-outline" size={60} color={colors.surface} />
                        <Text style={styles.emptyText}>No clubs found matching your search.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        margin: spacing.md,
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        height: 50,
    },
    searchIcon: {
        marginHorizontal: spacing.xs,
    },
    searchInput: {
        flex: 1,
        color: colors.text.primary,
        ...typography.presets.bodySmall,
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    listHeader: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    featuredTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    featuredDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    card: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: 20,
        padding: spacing.md,
        ...shadows.soft,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    logoBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginRight: spacing.md,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    clubInfo: {
        flex: 1,
    },
    clubName: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: 2,
    },
    clubLocation: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    followButton: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    followedButton: {
        backgroundColor: colors.primary,
    },
    followText: {
        ...typography.presets.caption,
        color: colors.primary,
        fontWeight: 'bold',
    },
    followedText: {
        color: '#fff',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        padding: spacing.sm,
        borderRadius: 12,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: 'bold',
    },
    statLabel: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    viewMore: {
        padding: spacing.xs,
    },
    viewMoreText: {
        ...typography.presets.caption,
        color: colors.primary,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
    },
    emptyText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
