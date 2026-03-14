import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { useAppStore } from '../../store/useAppStore';
import { colors, spacing, typography, radius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const ChatListScreen: React.FC = () => {
    const { conversations, joinedTeams } = useAppStore();
    const navigation = useNavigation<any>();

    const renderChatItem = ({ item, isTeam }: { item: any; isTeam?: boolean }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatDetail' as never, { name: item.name, isTeam } as never)}
        >
            <View style={styles.avatarContainer}>
                <View style={[styles.avatarPlaceholder, isTeam && styles.teamAvatar]}>
                    <Ionicons name={isTeam ? "people" : "person"} size={24} color={isTeam ? colors.primary : colors.text.tertiary} />
                </View>
                {item.unread && <View style={styles.unreadDot} />}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={[styles.lastMsg, item.unread && styles.unreadMsg]} numberOfLines={1}>
                    {item.lastMsg}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Messages" showBack />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Team Discussions Section */}
                {joinedTeams.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Team Discussions</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{joinedTeams.length}</Text>
                            </View>
                        </View>
                        {joinedTeams.map((team) => (
                            <React.Fragment key={team.id}>
                                {renderChatItem({ item: team, isTeam: true })}
                            </React.Fragment>
                        ))}
                    </View>
                )}

                {/* Direct Messages Section */}
                <View style={[styles.section, { marginTop: spacing.md }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Direct Messages</Text>
                    </View>
                    {conversations.length > 0 ? (
                        conversations.map((chat) => (
                            <React.Fragment key={chat.id}>
                                {renderChatItem({ item: chat })}
                            </React.Fragment>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubbles-outline" size={64} color={colors.text.tertiary} />
                            <Text style={styles.emptyText}>No messages yet.</Text>
                            <Text style={styles.emptySubText}>Start a conversation from the 'Looking' section!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        backgroundColor: colors.surface,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    sectionTitle: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: spacing.sm,
    },
    badgeText: {
        ...typography.presets.caption,
        color: colors.text.inverse,
        fontSize: 10,
        fontWeight: typography.weights.bold,
    },
    listContent: {
        flexGrow: 1,
    },
    chatItem: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamAvatar: {
        backgroundColor: colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: colors.primary + '33',
    },
    unreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.surface,
    },
    content: {
        flex: 1,
        marginLeft: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    time: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    lastMsg: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    unreadMsg: {
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
    emptyContainer: {
        paddingVertical: spacing.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    emptyText: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    emptySubText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
