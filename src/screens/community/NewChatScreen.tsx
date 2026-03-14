import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../../theme';
import { MOCK_PLAYERS, PlayerProfile } from '../../data/mockPlayers';
import { AppHeader } from '../../components';

export const NewChatScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return MOCK_PLAYERS;
        return MOCK_PLAYERS.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSelectUser = (user: PlayerProfile) => {
        // Navigate to ChatDetail with selected user info
        navigation.navigate('ChatDetail', {
            name: user.name,
            avatar: user.imageUrl
        });
    };

    const renderUserItem = ({ item }: { item: typeof MOCK_PLAYERS[0] }) => (
        <TouchableOpacity
            style={styles.userItem}
            activeOpacity={0.7}
            onPress={() => handleSelectUser(item)}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
                {item.isPro && (
                    <View style={styles.proBadge}>
                        <Ionicons name="star" size={8} color="#FFF" />
                    </View>
                )}
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AppHeader
                title="New Chat"
                showBack
            />

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={colors.text.secondary} />
                    <TextInput
                        placeholder="Search for players..."
                        placeholderTextColor={colors.text.secondary}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={colors.text.secondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Suggested Contacts</Text>
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={colors.text.secondary} />
                        <Text style={styles.emptyText}>No players found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchSection: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        ...typography.presets.body,
        color: colors.text.primary,
        paddingVertical: 8,
    },
    sectionHeader: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#F8FAFC',
    },
    sectionTitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
    },
    proBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F97316',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.presets.body,
        fontWeight: '700',
        color: colors.text.primary,
    },
    userRole: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: spacing.xxl,
    },
    emptyText: {
        ...typography.presets.body,
        color: colors.text.secondary,
        marginTop: spacing.md,
    },
});
