import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Alert, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AppHeader, MyCricketTopTabs, MyCricketActionBanner, MyCricketSubTabs, MyCricketMatchCard, MatchInsightsModal, TournamentTableModal, LeaderboardModal, TeamMembersModal, TrainingDrillsModal, CompareStatsModal, UniversalShareModal, MatchVideoModal, ReportModal, CertificateModal, PlanModal, ConnectModal, ResumeModal, MatchesListModal, StatsModal, AchievementsModal, SocialModal, AwardsModal, JournalModal, RegistrationModal, BracketsModal, InfoModal, RulesModal, GalleryModal } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

const TOP_TABS = ['Matches', 'Tournaments', 'Teams', 'Stats', 'Highlights'];
const SUB_TABS = ['Your', 'Played', 'Network', 'All'];

// Data will be fetched from useAppStore

// Data will be fetched from useAppStore

import { MyCricketFilterModal } from '../../components/MyCricketFilterModal';

export const MyCricketScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { myMatches, myTournaments, myTeams, myStats, myHighlights, setHeaderConfig } = useAppStore();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: 'My Cricket',
                rightIcons: [
                    { name: 'search', onPress: () => navigation.navigate('Search') },
                    { name: 'chatbox-ellipses-outline', onPress: () => navigation.navigate('DirectMessages') },
                    { name: 'funnel-outline', onPress: () => setIsFilterVisible(true) }
                ],
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation]);
    const [activeTopTab, setActiveTopTab] = useState('Matches');
    const [activeSubTab, setActiveSubTab] = useState('Your');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Analytics Modals State
    const [insightsVisible, setInsightsVisible] = useState(false);
    const [tableVisible, setTableVisible] = useState(false);
    const [leaderboardVisible, setLeaderboardVisible] = useState(false);
    const [rosterVisible, setRosterVisible] = useState(false);
    const [drillsVisible, setDrillsVisible] = useState(false);
    const [compareVisible, setCompareVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [videoVisible, setVideoVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [certVisible, setCertVisible] = useState(false);
    const [planVisible, setPlanVisible] = useState(false);
    const [connectVisible, setConnectVisible] = useState(false);
    const [resumeVisible, setResumeVisible] = useState(false);
    const [matchesVisible, setMatchesVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [achievementsVisible, setAchievementsVisible] = useState(false);
    const [socialVisible, setSocialVisible] = useState(false);
    const [awardsVisible, setAwardsVisible] = useState(false);
    const [journalVisible, setJournalVisible] = useState(false);

    // Information Modals State
    const [registerVisible, setRegisterVisible] = useState(false);
    const [bracketsVisible, setBracketsVisible] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [galleryVisible, setGalleryVisible] = useState(false);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const getFilteredData = () => {
        let baseData: any[] = [];
        switch (activeTopTab) {
            case 'Matches': baseData = myMatches; break;
            case 'Tournaments': baseData = myTournaments; break;
            case 'Teams': baseData = myTeams; break;
            case 'Stats': baseData = myStats; break;
            case 'Highlights': baseData = myHighlights; break;
            default: baseData = [];
        }

        if (activeSubTab === 'All') return baseData;
        return baseData.filter(item => item.subTab === activeSubTab);
    };

    const handleLinkPress = (link: string, item: any) => {
        const title = item.tournamentName || item.teamName || 'Details';

        switch (link) {
            case 'Scorecard':
                navigation.navigate('MatchDetails', { matchId: item.id, initialTab: 'scorecard' });
                break;
            case 'Insights':
                setSelectedItem(item);
                setInsightsVisible(true);
                break;
            case 'Matches':
            case 'Schedule':
            case 'Fixtures':
                setSelectedItem(item);
                setMatchesVisible(true);
                break;
            case 'Results':
                navigation.navigate('MainTabs', { screen: 'Home' }); // Or a dedicated results screen
                break;
            case 'Standings':
            case 'Table':
                setSelectedItem(item);
                setTableVisible(true);
                break;
            case 'Leaderboard':
                setSelectedItem(item);
                setLeaderboardVisible(true);
                break;
            case 'Members':
            case 'Squad':
                setSelectedItem(item);
                setRosterVisible(true);
                break;
            case 'Drills':
                setDrillsVisible(true);
                break;
            case 'Compare':
            case 'Comparison':
                setSelectedItem(item);
                setCompareVisible(true);
                break;
            case 'Share':
                setSelectedItem(item);
                setShareVisible(true);
                break;
            case 'Play Video':
            case 'Highlight':
            case 'Watch':
            case 'Watch Full':
            case 'Play':
            case 'Clips':
            case 'Replay':
            case 'Slow-mo':
                setSelectedItem(item);
                setVideoVisible(true);
                break;
            case 'Full Report':
            case 'Breakdown':
            case 'Analysis':
                setSelectedItem(item);
                setReportVisible(true);
                break;
            case 'Certificate':
                setSelectedItem(item);
                setCertVisible(true);
                break;
            case 'Plan':
                setSelectedItem(item);
                setPlanVisible(true);
                break;
            case 'Connect':
                setSelectedItem(item);
                setConnectVisible(true);
                break;
            case 'Resume':
                setSelectedItem(item);
                setResumeVisible(true);
                break;
            case 'Join':
            case 'Register':
                setSelectedItem(item);
                setRegisterVisible(true);
                break;
            case 'Brackets':
                setSelectedItem(item);
                setBracketsVisible(true);
                break;
            case 'Stats': setSelectedItem(item);
                setStatsVisible(true);
                break;
            case 'Achievements':
                setSelectedItem(item);
                setAchievementsVisible(true);
                break;
            case 'Social':
                setSelectedItem(item);
                setSocialVisible(true);
                break;
            case 'Awards':
                setSelectedItem(item);
                setAwardsVisible(true);
                break;
            case 'Journal':
                setSelectedItem(item);
                setJournalVisible(true);
                break;
            case 'Squads':
            case 'Members':
                setSelectedItem(item);
                setRosterVisible(true);
                break;
            case 'Gallery':
            case 'Photos':
                setSelectedItem(item);
                setGalleryVisible(true);
                break;
            case 'Rules':
                setSelectedItem(item);
                setRulesVisible(true);
                break;
            case 'Info':
                setSelectedItem(item);
                setInfoVisible(true);
                break;
            default: Alert.alert(link, `${link} functionality for ${title} is ready and waiting for your input.`);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <MyCricketMatchCard
            leagueName={item.leagueName}
            tournamentName={item.tournamentName}
            status={item.status}
            dateStr={item.dateStr}
            overs={item.overs}
            location={item.location}
            team1={item.team1}
            team2={item.team2}
            team1Color={item.team1Color}
            team2Color={item.team2Color}
            team1Logo={item.team1Logo}
            team2Logo={item.team2Logo}
            mainLogo={item.mainLogo}
            scheduledText={item.scheduledText}
            footerLinks={item.footerLinks}
            thumbnailUrl={item.thumbnailUrl}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
            onLinkPress={(link: string) => handleLinkPress(link, item)}
        />
    );

    return (
        <View style={styles.container}>
                <MyCricketFilterModal
                    visible={isFilterVisible}
                    onClose={() => setIsFilterVisible(false)}
                    onApply={(filters) => {
                        console.log('Applied filters:', filters);
                        Alert.alert('Filters Applied', `Showing ${filters.type} matches from ${filters.time}.`);
                    }}
                />

                <MyCricketTopTabs
                    tabs={TOP_TABS}
                    activeTab={activeTopTab}
                    onTabPress={(tab) => {
                        setActiveTopTab(tab);
                        setActiveSubTab('Your'); // Reset subtab on top switch
                    }}
                />

                <FlatList
                    data={getFilteredData()}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <>
                            <MyCricketActionBanner onStartPress={() => navigation.navigate('RenewPro')} />
                            <MyCricketSubTabs
                                tabs={SUB_TABS}
                                activeTab={activeSubTab}
                                onTabPress={setActiveSubTab}
                            />
                            <View style={styles.listSpacer} />
                        </>
                    }
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="documents-outline" size={64} color={colors.text.tertiary} />
                            <Text style={styles.emptyText}>No {activeTopTab.toLowerCase()} found in {activeSubTab.toLowerCase()} filter.</Text>
                        </View>
                    }
                />

                <MatchInsightsModal
                    visible={insightsVisible}
                    onClose={() => setInsightsVisible(false)}
                    onFullMatchCentre={() => {
                        if (selectedItem) {
                            navigation.navigate('MatchDetails', { matchId: selectedItem.id });
                        }
                    }}
                    matchData={selectedItem}
                />

                <TournamentTableModal
                    visible={tableVisible}
                    onClose={() => setTableVisible(false)}
                    tournamentName={selectedItem?.tournamentName}
                />

                <LeaderboardModal
                    visible={leaderboardVisible}
                    onClose={() => setLeaderboardVisible(false)}
                    tournamentName={selectedItem?.tournamentName}
                />

                <TeamMembersModal
                    visible={rosterVisible}
                    onClose={() => setRosterVisible(false)}
                    teamName={selectedItem?.team1 || 'Team Roster'}
                    title="Roster"
                />

                <TrainingDrillsModal
                    visible={drillsVisible}
                    onClose={() => setDrillsVisible(false)}
                    title="Training"
                />

                <CompareStatsModal
                    visible={compareVisible}
                    onClose={() => setCompareVisible(false)}
                    title="Comparison"
                />

                <UniversalShareModal
                    visible={shareVisible}
                    onClose={() => setShareVisible(false)}
                    title={selectedItem?.tournamentName || 'Cricket Match'}
                />

                <MatchVideoModal
                    visible={videoVisible}
                    onClose={() => setVideoVisible(false)}
                    subtitle={selectedItem?.tournamentName}
                    title="Replay"
                />

                <ReportModal
                    visible={reportVisible}
                    onClose={() => setReportVisible(false)}
                    title={selectedItem?.tournamentName}
                    data={selectedItem}
                />

                <CertificateModal
                    visible={certVisible}
                    onClose={() => setCertVisible(false)}
                    data={selectedItem}
                />

                <PlanModal
                    visible={planVisible}
                    onClose={() => setPlanVisible(false)}
                />

                <ConnectModal
                    visible={connectVisible}
                    onClose={() => setConnectVisible(false)}
                    data={selectedItem}
                />

                <ResumeModal
                    visible={resumeVisible}
                    onClose={() => setResumeVisible(false)}
                    data={selectedItem}
                />

                <MatchesListModal
                    visible={matchesVisible}
                    onClose={() => setMatchesVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1 || 'Related Matches'}
                />

                <StatsModal
                    visible={statsVisible}
                    onClose={() => setStatsVisible(false)}
                    data={selectedItem}
                />
                <AchievementsModal
                    visible={achievementsVisible}
                    onClose={() => setAchievementsVisible(false)}
                    data={selectedItem}
                />
                <SocialModal
                    visible={socialVisible}
                    onClose={() => setSocialVisible(false)}
                    data={selectedItem}
                />
                <AwardsModal
                    visible={awardsVisible}
                    onClose={() => setAwardsVisible(false)}
                    data={selectedItem}
                />
                <JournalModal
                    visible={journalVisible}
                    onClose={() => setJournalVisible(false)}
                    data={selectedItem}
                />

                <RegistrationModal
                    visible={registerVisible}
                    onClose={() => setRegisterVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1}
                    data={selectedItem}
                />
                <BracketsModal
                    visible={bracketsVisible}
                    onClose={() => setBracketsVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1}
                    data={selectedItem}
                />
                <InfoModal
                    visible={infoVisible}
                    onClose={() => setInfoVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1}
                    data={selectedItem}
                />
                <RulesModal
                    visible={rulesVisible}
                    onClose={() => setRulesVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1}
                    data={selectedItem}
                />
                <GalleryModal
                    visible={galleryVisible}
                    onClose={() => setGalleryVisible(false)}
                    title={selectedItem?.tournamentName || selectedItem?.team1}
                    data={selectedItem}
                />
            </View>
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
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.xl,
    },
    emptyText: {
        ...typography.presets.body,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
