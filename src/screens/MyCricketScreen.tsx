import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { AppHeader, MyCricketTopTabs, MyCricketActionBanner, MyCricketSubTabs, MyCricketMatchCard } from '../components';
import { colors, spacing } from '../theme';

const TOP_TABS = ['Matches', 'Tournaments', 'Teams', 'Stats', 'Highlights'];
const SUB_TABS = ['Your', 'Played', 'Network', 'All'];

// Dummy data mirroring the provided screenshot exactly
const DUMMY_MATCHES = [
    {
        id: '1',
        leagueName: 'League Matches',
        tournamentName: 'PlayZone - Tennis Cricket',
        status: 'Upcoming',
        dateStr: 'Tomorrow',
        overs: '20 Ov.',
        location: 'Greater Noida, Playzone - BCCI. (Greate...',
        team1: 'YOUNG FIGHTERS',
        team2: 'Mywoods Champions',
        scheduledText: 'Match scheduled to begin on Tomorrow at 06:30 AM',
        footerLinks: ['Insights', 'Table', 'Leaderboard']
    },
    {
        id: '2',
        leagueName: 'League Matches',
        tournamentName: 'Hades Big Bash 5.0 (Red tennis)',
        status: 'Upcoming',
        dateStr: '07-Mar-26',
        overs: '20 Ov.',
        location: 'Bengaluru (Bangalore), Hades 2',
        team1: 'Mighty Meteors',
        team2: 'Men in Blue (MIB X1)',
        scheduledText: 'Match scheduled to begin on 07-Mar-26 at 06:20 AM',
        footerLinks: ['Insights', 'Table', 'Leaderboard']
    },
    {
        id: '3',
        leagueName: 'Final',
        tournamentName: 'Hades Big Bash 3.0 (Red tennis)',
        status: 'Upcoming',
        dateStr: '08-Mar-26',
        overs: '20 Ov.',
        location: 'Bengaluru (Bangalore), Hades 2',
        team1: 'Mighty Meteors',
        team2: 'BSW Tennis (BTM Scoring Willows)',
        scheduledText: 'Match scheduled to begin on 08-Mar-26 at 09:30 AM',
        footerLinks: ['Insights', 'Table', 'Leaderboard']
    }
];

export const MyCricketScreen: React.FC = () => {
    const [activeTopTab, setActiveTopTab] = useState('Matches');
    const [activeSubTab, setActiveSubTab] = useState('Your');

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                rightIcons={[
                    { name: 'search' },
                    { name: 'chatbox-ellipses-outline' },
                    { name: 'funnel-outline' }
                ]}
            />

            <MyCricketTopTabs
                tabs={TOP_TABS}
                activeTab={activeTopTab}
                onTabPress={setActiveTopTab}
            />

            <FlatList
                data={DUMMY_MATCHES}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <MyCricketActionBanner />
                        <MyCricketSubTabs
                            tabs={SUB_TABS}
                            activeTab={activeSubTab}
                            onTabPress={setActiveSubTab}
                        />
                        <View style={styles.listSpacer} />
                    </>
                }
                renderItem={({ item }) => (
                    <MyCricketMatchCard
                        leagueName={item.leagueName}
                        tournamentName={item.tournamentName}
                        status={item.status}
                        dateStr={item.dateStr}
                        overs={item.overs}
                        location={item.location}
                        team1={item.team1}
                        team2={item.team2}
                        scheduledText={item.scheduledText}
                        footerLinks={item.footerLinks}
                    />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Match white app background
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    listSpacer: {
        height: spacing.sm,
    }
});
