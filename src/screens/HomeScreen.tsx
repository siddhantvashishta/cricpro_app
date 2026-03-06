import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
    AppHeader,
    TabSwitch,
    PromoBanner,
    PlayerCard,
    ProClubContent,
    FloatingCoinToss,
    CreationFab,
    AdCarousel,
    FantasyTipCard,
    PollCard
} from '../components';
import { colors, spacing, typography, radius } from '../theme';
import { MOCK_PLAYERS } from '../data/mockPlayers';
import { SCHEDULES_MOCK, RESULTS_MOCK } from '../data/mockMatches';

// --- Dummy Data mimicking the screenshot design ---
const TOP_PLAYERS = MOCK_PLAYERS;
const SCHEDULES = SCHEDULES_MOCK;
const RESULTS = RESULTS_MOCK;

const SOCIAL_POSTS = [
    { id: 'p1', author: 'CricPro Official', time: '2h ago', content: 'What a devastating spell of fast bowling today! 🌪️🔥', likes: 1240, comments: 85, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p2', author: 'Roman Saini', time: '5h ago', content: 'Great practice session with the boys. Ready for the finals! 🏏💪', likes: 3500, comments: 210, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p3', author: 'Virat K', time: '10h ago', content: 'Nothing beats the feeling of a match-winning century! 💯🙏', likes: 8500, comments: 420, image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p4', author: 'Cricket Daily', time: '1d ago', content: 'Who do you think will win the championship this year? Vote now! 🗳️🏏', likes: 2100, comments: 560, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
];

const FANTASY_TIPS = [
    { id: 't1', title: 'Pitch Report: Batsman Friendly Track!', expert: 'Aakash C.', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 't2', title: 'Top Pick: Virat is in supreme form.', expert: 'Harsha B.', imageUrl: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 't3', title: 'Must Have: Bumrah for death overs.', expert: 'Ian B.', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
];

const POLL_DATA = {
    question: 'Who will win the toss today?',
    options: [
        { id: '1', label: 'Ind vs Aus', percentage: 58 },
        { id: '2', label: 'Others', percentage: 42 },
    ],
    totalVotes: 12450
};

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [activeTab, setActiveTab] = useState('For you');
    const [activeBottomTab, setActiveBottomTab] = useState('home');

    const renderPlayer = ({ item }: { item: typeof TOP_PLAYERS[0] }) => (
        <View style={styles.playerCardWrapper}>
            <PlayerCard
                name={item.name}
                isPro={item.isPro}
                runs={item.runs}
                wickets={item.wickets}
                imageUrl={item.imageUrl}
                onPress={() => navigation.navigate('PlayerProfile', { playerId: item.id })}
            />
        </View>
    );

    const renderSchedule = ({ item }: { item: typeof SCHEDULES[0] }) => (
        <TouchableOpacity
            style={styles.scheduleCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
        >
            <View style={styles.scheduleHeader}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
            <View style={styles.scheduleTeams}>
                <Text style={styles.teamText}>{item.team1.name}</Text>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.teamText}>{item.team2.name}</Text>
            </View>
            <Text style={styles.scheduleLocation}>{item.location}</Text>
        </TouchableOpacity>
    );

    const renderResult = ({ item }: { item: typeof RESULTS[0] }) => (
        <TouchableOpacity
            style={[styles.resultCard, item.highlight && styles.resultCardHighlight]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
        >
            <View style={styles.resultRow}>
                <Text style={styles.resultTeamName}>{item.team1.name}</Text>
                <Text style={styles.resultScore}>{item.team1.score}</Text>
            </View>
            <View style={styles.resultRow}>
                <Text style={styles.resultTeamName}>{item.team2.name}</Text>
                <Text style={styles.resultScore}>{item.team2.score}</Text>
            </View>
            <Text style={[styles.resultOutcome, item.highlight && styles.resultOutcomeHighlight]}>{item.result}</Text>
        </TouchableOpacity>
    );

    const renderFantasyTip = ({ item }: { item: typeof FANTASY_TIPS[0] }) => (
        <FantasyTipCard
            title={item.title}
            expert={item.expert}
            imageUrl={item.imageUrl}
            onPress={() => Alert.alert('Fantasy Tips', `Full expert analysis by ${item.expert}...`)}
        />
    );

    const renderPost = ({ item }: { item: typeof SOCIAL_POSTS[0] }) => (
        <TouchableOpacity
            style={styles.postCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Community' })}
        >
            <View style={styles.postHeader}>
                <View style={styles.postAuthorAvatar} />
                <View>
                    <Text style={styles.postAuthorName}>{item.author}</Text>
                    <Text style={styles.postTime}>{item.time}</Text>
                </View>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postFooter}>
                <Text style={styles.postFooterText}>👍 {item.likes} Likes</Text>
                <Text style={styles.postFooterText}>💬 {item.comments} Comments</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Exact Header Replication */}
            <AppHeader onRenewPress={() => navigation.navigate('RenewPro')} />

            {/* Exact Tab Replication */}
            <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            {activeTab === 'For you' ? (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Schedules Section (Moved Up) */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Schedules</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Action', 'Navigating to full schedules list...')}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={SCHEDULES}
                            keyExtractor={(item) => item.id}
                            renderItem={renderSchedule}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContent}
                            snapToInterval={280 + spacing.md}
                            decelerationRate="fast"
                        />
                    </View>

                    {/* Ad Carousel Inserted Here */}
                    <AdCarousel />

                    {/* Results Section (Moved Up) */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Results</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Action', 'Navigating to full results list...')}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={RESULTS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderResult}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContent}
                            snapToInterval={280 + spacing.md}
                            decelerationRate="fast"
                        />
                    </View>

                    {/* Popular Cricketers Section (Moved Down) */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Popular cricketers</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'looking' })}>
                                <Text style={styles.seeAllText}>Find Cricketers</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={TOP_PLAYERS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderPlayer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContent}
                            snapToInterval={160 + spacing.md} // Card width + margin
                            decelerationRate="fast"
                        />
                    </View>

                    {/* Fantasy Tips Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Fantasy Expert Tips</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Fantasy Tips', 'Full tips list coming soon!')}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={FANTASY_TIPS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderFantasyTip}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContent}
                            snapToInterval={200 + spacing.md}
                            decelerationRate="fast"
                        />
                    </View>

                    {/* Interactive Poll Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Daily Cricket Poll</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListContent}>
                            <PollCard
                                question={POLL_DATA.question}
                                options={POLL_DATA.options}
                                totalVotes={POLL_DATA.totalVotes}
                            />
                            {/* Placeholder for more polls */}
                            <View style={[styles.pollPlaceholder, { marginLeft: spacing.md }]}>
                                <Text style={styles.placeholderText}>New polls daily!</Text>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Social/Posts Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Community Posts</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Community' })}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={SOCIAL_POSTS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderPost}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContent}
                            snapToInterval={300 + spacing.md}
                            decelerationRate="fast"
                        />
                    </View>

                </ScrollView>
            ) : (
                <ProClubContent />
            )}

            {/* Functional Floating Coin Toss */}
            <FloatingCoinToss />

            {/* Universal Creation FAB */}
            <CreationFab />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray background visible in the screenshot
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    sectionContainer: {
        paddingTop: spacing.lg,
        backgroundColor: colors.surface,
        marginTop: spacing.md, // Increased gap for better hierarchy
        paddingBottom: spacing.lg,
        borderRadius: radius.lg, // Rounded sections for modern look
        marginHorizontal: spacing.sm, // Slight horizontal margin for floating effect
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: spacing.screenPadding,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.medium,
        color: colors.text.primary,
    },
    seeAllText: {
        ...typography.presets.bodySmall,
        color: '#F97316', // orange
        backgroundColor: '#FFF0E6', // light orange bg
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginRight: spacing.screenPadding,
    },
    horizontalListContent: {
        paddingHorizontal: spacing.screenPadding,
    },
    playerCardWrapper: {
        marginRight: spacing.sm,
    },
    pollPlaceholder: {
        width: 150,
        height: 180,
        borderRadius: radius.lg,
        backgroundColor: colors.surfaceHighlight,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    // New Styles for Schedules, Results, Posts
    scheduleCard: {
        width: 280,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: spacing.md,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    scheduleHeader: {
        marginBottom: spacing.sm,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    scheduleTime: {
        ...typography.presets.bodySmall,
        color: '#D97706', // Gold/Dark Yellow
        fontWeight: typography.weights.bold,
    },
    scheduleTeams: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    teamText: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center',
    },
    vsText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginHorizontal: spacing.sm,
    },
    scheduleLocation: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    resultCard: {
        width: 280,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: spacing.md,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    resultCardHighlight: {
        backgroundColor: '#FFF0E6', // Light Orange
        borderColor: '#F97316',
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    resultTeamName: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: typography.weights.medium,
    },
    resultScore: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
    },
    resultOutcome: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        textAlign: 'center',
    },
    resultOutcomeHighlight: {
        color: '#F97316',
        fontWeight: typography.weights.bold,
        borderTopColor: '#FDBA74',
    },
    postCard: {
        width: 300,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    postAuthorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E4E4E7',
        marginRight: spacing.sm,
    },
    postAuthorName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    postTime: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    postContent: {
        ...typography.presets.bodySmall,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    postImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    postFooterText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginRight: spacing.md,
    }
});
