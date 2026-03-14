import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppHeader } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const SchedulesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const matches = useAppStore((state) => state.matches);
    const schedules = matches.filter(m => m.status === 'upcoming');

    const renderSchedule = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={16} color="#D97706" />
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.teamsContainer}>
                <View style={styles.teamInfo}>
                    <View style={styles.teamLogoPlaceholder} />
                    <Text style={styles.teamName}>{item.team_a.name}</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.teamInfo}>
                    <View style={styles.teamLogoPlaceholder} />
                    <Text style={styles.teamName}>{item.team_b.name}</Text>
                </View>
            </View>
            <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <Text style={styles.seriesText}>{item.series}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Match Schedules" showBack />
            <FlatList
                data={schedules}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderSchedule}
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
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    timeText: {
        ...typography.presets.bodySmall,
        color: '#D97706',
        fontWeight: typography.weights.bold,
        marginLeft: spacing.xs,
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    teamInfo: {
        alignItems: 'center',
        flex: 1,
    },
    teamLogoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        marginBottom: spacing.xs,
    },
    teamName: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        textAlign: 'center',
    },
    vsText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginHorizontal: spacing.sm,
        fontWeight: typography.weights.bold,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    locationText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginLeft: spacing.xs,
    },
    seriesText: {
        ...typography.presets.caption,
        color: colors.primary,
        textAlign: 'center',
        fontWeight: typography.weights.medium,
    }
});
