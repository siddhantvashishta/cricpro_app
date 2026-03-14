import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { AppHeader } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { FANTASY_TIPS_MOCK } from '../../data/mockTips';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export const FantasyTipsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    const renderTip = ({ item }: { item: typeof FANTASY_TIPS_MOCK[0] }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('FantasyTipDetails', { tipId: item.id })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>EXPERT ANALYSIS</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.expertRow}>
                    <Ionicons name="person-circle-outline" size={16} color="#FFF" />
                    <Text style={styles.expertName}>By {item.expert}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Fantasy Expert Tips" showBack />
            <FlatList
                data={FANTASY_TIPS_MOCK}
                keyExtractor={(item) => item.id}
                renderItem={renderTip}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    listContent: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.lg,
        height: 200,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: spacing.md,
        justifyContent: 'flex-end',
    },
    badge: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        backgroundColor: '#F97316',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 4,
    },
    badgeText: {
        ...typography.presets.caption,
        color: '#FFF',
        fontWeight: typography.weights.bold,
        fontSize: 10,
    },
    title: {
        ...typography.presets.bodyLarge,
        color: '#FFF',
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
    },
    expertRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expertName: {
        ...typography.presets.caption,
        color: '#E4E4E7',
        marginLeft: spacing.xs,
    }
});
