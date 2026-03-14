import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Platform, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

export const MessageRequestsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { chatRequests, acceptRequest, declineRequest } = useAppStore();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const handleAccept = (id: string, name: string) => {
        acceptRequest(id);
        Alert.alert('Request Accepted', `You can now chat with ${name}.`);
    };

    const handleDecline = (id: string, name: string) => {
        Alert.alert(
            'Decline Request',
            `Are you sure you want to decline the request from ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Decline',
                    style: 'destructive',
                    onPress: () => {
                        declineRequest(id);
                    }
                }
            ]
        );
    };

    const renderRequestItem = ({ item }: { item: any }) => (
        <View style={styles.requestItem}>
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name={item.type === 'team' ? "people" : "person"} size={24} color={colors.text.tertiary} />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.senderName}>{item.sender}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleAccept(item.id, item.sender)}
                    >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.declineButton]}
                        onPress={() => handleDecline(item.id, item.sender)}
                    >
                        <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Message Requests</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={chatRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequestItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="mail-open-outline" size={48} color={colors.text.tertiary} />
                        </View>
                        <Text style={styles.emptyTitle}>No Requests</Text>
                        <Text style={styles.emptySubtitle}>You don't have any pending message or team requests at the moment.</Text>
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
    header: {
        backgroundColor: '#005CE6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
        paddingHorizontal: spacing.sm,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        textAlign: 'center',
    },
    iconButton: {
        padding: spacing.sm,
    },
    listContent: {
        paddingVertical: spacing.md,
    },
    requestItem: {
        flexDirection: 'row',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: radius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatarImage: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },
    avatarPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    senderName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    timeText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    messageText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginBottom: spacing.md,
        lineHeight: 18,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
        height: 36,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#005CE6',
    },
    acceptButtonText: {
        color: colors.text.inverse,
        fontWeight: 'bold',
        fontSize: 13,
    },
    declineButton: {
        backgroundColor: colors.surfaceHighlight,
    },
    declineButtonText: {
        color: colors.text.secondary,
        fontWeight: '600',
        fontSize: 13,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
        marginTop: 100,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
