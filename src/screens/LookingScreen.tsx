import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
    AppHeader,
    LookingActionHeader,
    LookingFilterTabs,
    LookingCard,
    BottomTabBar
} from '../components';
import { colors, spacing } from '../theme';

// Based on the screenshot details
const DUMMY_LOOKING_DATA = [
    {
        id: '1',
        teamName: "Darshan's team (Mcca Warriors)",
        description: 'is looking for an opponent to play a Match.',
        date: 'Sat, Mar 07 2026 | 12:30 PM',
        ground: 'Open ground',
        timeAgo: '12 minutes ago',
        distance: '-- KM',
        rightIconType: 'VS' as const,
    },
    {
        id: '2',
        teamName: "Nabangkur Paul's team (Bengaluru Super Giants (BSM))",
        description: 'is looking for an All-rounder (None) to join his team.',
        date: 'Sat, Mar 07 2026',
        ground: 'Open ground',
        requirementText: 'All-rounder (None)',
        timeAgo: '13 minutes ago',
        distance: '-- KM',
        rightIconType: 'Person' as const,
    },
    {
        id: '3',
        teamName: "Nabangkur Paul's team (Bengaluru Super Giants (BSM))",
        description: 'is looking for a Batter to join his team.',
        date: 'Sat, Mar 07 2026',
        ground: 'Open ground',
        requirementText: 'Batter',
        timeAgo: '14 minutes ago',
        distance: '-- KM',
        rightIconType: 'Person' as const,
    },
    {
        id: '4',
        teamName: "Nabangkur Paul's team (Bengaluru Super Giants (BSM))",
        description: 'is looking for a Bowler (None) to join his team.',
        date: 'Sat, Mar 07 2026',
        ground: 'Open ground',
        requirementText: 'Bowler (None)',
        timeAgo: '15 minutes ago',
        distance: '-- KM',
        rightIconType: 'Person' as const,
    }
];

export const LookingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Custom AppHeader for Looking Section */}
            <AppHeader
                rightIcons={[
                    { name: 'locate-outline' },
                    { name: 'chatbox-ellipses-outline' },
                    { name: 'funnel-outline', badgeCount: 1 }
                ]}
            />

            <FlatList
                data={DUMMY_LOOKING_DATA}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View style={styles.headerStack}>
                        <LookingActionHeader />
                        <LookingFilterTabs />
                    </View>
                }
                renderItem={({ item }) => (
                    <LookingCard
                        teamName={item.teamName}
                        description={item.description}
                        requirementText={item.requirementText}
                        date={item.date}
                        ground={item.ground}
                        timeAgo={item.timeAgo}
                        distance={item.distance}
                        rightIconType={item.rightIconType}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray background to show card outlines
    },
    headerStack: {
        backgroundColor: colors.surface,
        marginBottom: spacing.md,
    },
    listContent: {
        paddingBottom: spacing.xxl,
    }
});
