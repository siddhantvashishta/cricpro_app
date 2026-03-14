import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../../theme';

type NewsDetailRouteProp = RouteProp<{
    NewsDetail: {
        item: {
            id: string;
            title: string;
            summary: string;
            image: string;
            time: string;
            category: string;
        }
    }
}, 'NewsDetail'>;

export const NewsDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<NewsDetailRouteProp>();
    const { item } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${item.title}\n\nRead more on CricPro App!\n${item.summary}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share the news.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>News Detail</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: item.image }} style={styles.mainImage} />

                <View style={styles.contentContainer}>
                    <View style={styles.metaRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    <Text style={styles.title}>{item.title}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.summary}>{item.summary}</Text>

                    <Text style={styles.extraContent}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        {"\n\n"}
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        {"\n\n"}
                        Cricketers across the globe are adapting to these changes, ensuring that the spirit of the game remains intact while leveraging modern advancements for better performance and player safety.
                    </Text>

                    <View style={styles.bottomActions}>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => Alert.alert('Liked', 'You liked this news!')}>
                            <Ionicons name="heart-outline" size={20} color={colors.text.secondary} />
                            <Text style={styles.bottomButtonText}>Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => Alert.alert('Comments', 'Opening comments...')}>
                            <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
                            <Text style={styles.bottomButtonText}>Comment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButton} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={20} color={colors.text.secondary} />
                            <Text style={styles.bottomButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: spacing.md,
    },
    actionButton: {
        padding: spacing.xs,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    mainImage: {
        width: '100%',
        height: 300,
        backgroundColor: colors.border,
    },
    contentContainer: {
        padding: spacing.lg,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    categoryBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    categoryText: {
        ...typography.presets.caption,
        color: '#FFF',
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    timeText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    title: {
        ...typography.presets.h2,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        lineHeight: 32,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.lg,
    },
    summary: {
        ...typography.presets.bodyLarge,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
        lineHeight: 26,
        marginBottom: spacing.lg,
    },
    extraContent: {
        ...typography.presets.body,
        color: colors.text.secondary,
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    bottomButtonText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
});
